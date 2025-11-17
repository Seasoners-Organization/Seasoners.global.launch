import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Simple in-memory rate limiter per IP (dev-friendly; replace with Redis in prod)
const registerAttempts = new Map<string, number[]>();
function rateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const arr = registerAttempts.get(ip) || [];
  const recent = arr.filter((t) => now - t < windowMs);
  recent.push(now);
  registerAttempts.set(ip, recent);
  return recent.length <= limit;
}

import bcrypt from 'bcrypt';
import disposableDomains from 'disposable-email-domains';
import zxcvbn from 'zxcvbn';

// Validation schema (password required)
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/).optional(),
  role: z.enum(['USER', 'HOST', 'EMPLOYER']).default('USER'),
  captchaToken: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Basic rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

  const body = await req.json();

    const validatedData = registrationSchema.parse(body);

    // Verify captcha
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json({ error: 'Captcha not configured' }, { status: 500 });
    }
    const remoteip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: validatedData.captchaToken,
        ...(remoteip ? { remoteip } : {}),
      }).toString(),
    });
    const captchaJson = await captchaRes.json();
    if (!captchaJson.success) {
      return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
    }

    // Block disposable email addresses
    const emailDomain = validatedData.email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Disposable email addresses are not allowed.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    // Enforce password strength (zxcvbn score >= 3)
    const strength = zxcvbn(validatedData.password);
    if (strength.score < 3) {
      return NextResponse.json({
        error: 'Password too weak. Use a longer passphrase with mixed characters.',
        suggestions: strength.feedback?.suggestions || [],
      }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with password
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        phoneNumber: validatedData.phoneNumber,
        role: validatedData.role,
        verificationAttempts: {
          create: [
            { type: 'EMAIL', status: 'PENDING' }
          ]
        }
      }
    });

    // Trigger email verification flow (server-side call to existing verify-email route)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
      const verifyRes = await fetch(`${baseUrl}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      });

      if (!verifyRes.ok) {
        const errorText = await verifyRes.text();
        console.error('❌ Failed to send verification email:', errorText);
      } else {
        console.log('✅ Verification email sent successfully to:', user.email);
      }
    } catch (err) {
      console.error('❌ Error calling verify-email route:', err);
    }

    return NextResponse.json({
      message: 'Registration successful. Please verify your email.',
      userId: user.id
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
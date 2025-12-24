import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/utils/onboarding-emails';
import { getResend } from '@/lib/resend';
import { getEmailConfig } from '@/lib/email-config';
import crypto from 'crypto';

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
import { zxcvbn } from '@zxcvbn-ts/core';

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

    // Verify captcha (supports reCAPTCHA v2 and v3 tokens)
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error('[Register] RECAPTCHA_SECRET_KEY not configured');
      return NextResponse.json({ error: 'Captcha not configured' }, { status: 500 });
    }
    const remoteip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    try {
      const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: validatedData.captchaToken,
          ...(remoteip ? { remoteip } : {}),
        }).toString(),
      });
      if (!captchaRes.ok) {
        console.error('[Register] Captcha API error:', captchaRes.status);
        return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
      }
      
      const captchaJson = await captchaRes.json();
      if (!captchaJson.success) {
        const hostname = captchaJson.hostname as string | undefined;
        const errorCodes = captchaJson['error-codes'];
        // Extra diagnostics: log hostname and error codes to help identify domain/key mismatches
        console.error('[Register] Captcha failed:', errorCodes, 'hostname:', hostname);

        const allowedHostnames = ['seasoners.eu', 'www.seasoners.eu'];
        if (hostname && !allowedHostnames.includes(hostname)) {
          return NextResponse.json({ error: 'Captcha verification failed (hostname mismatch)' }, { status: 400 });
        }

        return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
      }
    } catch (captchaError) {
      console.error('[Register] Captcha fetch error:', captchaError);
      return NextResponse.json({ error: 'Captcha verification error' }, { status: 500 });
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
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error('[Register] Database check error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
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
    try {
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          phoneNumber: validatedData.phoneNumber,
          role: validatedData.role,
        }
      });
      
      console.log('[Register] User created successfully:', user.id);

      // Send verification email immediately (inline, no HTTP roundtrip)
      const sendVerificationEmail = async () => {
        try {
          const resend = getResend();
          if (!resend) {
            console.warn('RESEND_API_KEY not set; skipping verification email');
            return;
          }

          const token = crypto.randomBytes(32).toString('hex');
          const expires = new Date(Date.now() + 30 * 60 * 1000);
          await prisma.verificationToken.create({
            data: { identifier: user.email!, token, expires },
          });

          const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
          const verificationUrl = `${baseUrl}/auth/verify/email?token=${encodeURIComponent(token)}`;
          const emailConfig = getEmailConfig('verification');

          const sendResult = await resend.emails.send({
            from: emailConfig.from,
            replyTo: emailConfig.replyTo,
            to: user.email!,
            subject: 'Verify your email',
            html: `
              <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #334155;">
                <h1 style="color: #0ea5e9; font-size: 22px; margin: 0 0 12px;">Verify your email</h1>
                <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Click below to confirm your email and activate your account.</p>
                <p style="text-align: center; margin: 16px 0;">
                  <a href="${verificationUrl}" style="display: inline-block; background: #0ea5e9; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Verify Email</a>
                </p>
                <p style="font-size: 12px; color: #64748b; margin: 16px 0 0;">This link expires in 30 minutes.</p>
              </div>
            `,
            text: `Verify your email\n\nUse this link:\n${verificationUrl}\n\nExpires in 30 minutes.`,
          });

          if ((sendResult as any)?.error) {
            console.error('❌ Verification email error:', (sendResult as any).error);
          } else {
            console.log('✅ Verification email sent:', (sendResult as any)?.data?.id);
          }
        } catch (err) {
          console.error('❌ Verification email failed:', err);
        }
      };

      // Fire both emails in parallel (non-blocking)
      Promise.all([
        sendWelcomeEmail(user).catch(err => console.error('❌ Welcome email failed:', err)),
        sendVerificationEmail().catch(err => console.error('❌ Verification email failed:', err))
      ]);

      return NextResponse.json({
        message: 'Registration successful. Please verify your email.',
        userId: user.id
      }, { status: 201 });
    } catch (createError) {
      console.error('[Register] User creation failed:', createError);
      return NextResponse.json({ 
        error: 'Failed to create user account',
        details: createError instanceof Error ? createError.message : 'Unknown error'
      }, { status: 500 });
    }

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
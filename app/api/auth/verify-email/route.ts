import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getResend } from '@/lib/resend';
import { getEmailConfig } from '@/lib/email-config';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Simple in-memory rate limiter for email sends
const emailAttempts = new Map<string, number[]>();
function rateLimitEmail(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const arr = emailAttempts.get(key) || [];
  const recent = arr.filter((t) => now - t < windowMs);
  recent.push(now);
  emailAttempts.set(key, recent);
  return recent.length <= limit;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function appBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000'
  );
}

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    if (!rateLimitEmail(`${ip}:${email}`)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // Generate and persist verification token (30 minutes)
    const token = generateToken();
    const expires = new Date(Date.now() + 30 * 60 * 1000);
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Create verification URL with robust base
    const verificationUrl = `${appBaseUrl()}/auth/verify/email?token=${encodeURIComponent(token)}`;

    // Send verification email via Resend
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping verification email');
      return NextResponse.json({ message: 'Verification email skipped (no email provider configured).' });
    }
    const emailConfig = getEmailConfig('verification');
    const sendResult = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: email,
      subject: 'Verify your email to activate Seasoners',
      // Lightweight HTML for faster delivery and fewer filters
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #334155;">
          <h1 style="color: #0ea5e9; font-size: 22px; margin: 0 0 12px;">Verify your email</h1>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Click the button below to confirm your email and activate your account.
          </p>
          <p style="text-align: center; margin: 16px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background: #0ea5e9; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
              Verify Email
            </a>
          </p>
          <p style="font-size: 12px; color: #64748b; margin: 16px 0 0;">This link expires in 30 minutes.</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 8px 0 0;">If you didn't sign up, you can ignore this email.</p>
        </div>
      `,
      text: `Verify your email\n\nUse this link to activate your account (expires in 30 minutes):\n${verificationUrl}\n\nIf you didn't sign up, ignore this email.`,
      tags: [{ name: 'type', value: 'transactional' }, { name: 'feature', value: 'email_verification' }],
    });
    if ((sendResult as any)?.error) {
      console.error('Resend verification email error:', (sendResult as any).error);
      if ((sendResult as any).response) {
        (sendResult as any).response.text().then((text) => {
          console.error('Resend verification email response:', text);
        });
      }
      return NextResponse.json(
        { error: 'Failed to send verification email', details: (sendResult as any).error },
        { status: 500 }
      );
    } else {
      console.log('✅ Verification email sent:', (sendResult as any)?.data?.id);
    }

    return NextResponse.json({
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

// Handle email verification
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid verification link' },
        { status: 400 }
      );
    }

    // Look up token in DB
    const tokenRow = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!tokenRow || tokenRow.expires < new Date()) {
      return NextResponse.json(
        { error: 'Verification link expired' },
        { status: 400 }
      );
    }

    // Update user's email verification status (find by email)
    await prisma.user.update({
      where: { email: tokenRow.identifier },
      data: { 
        emailVerified: new Date(),
        verificationAttempts: {
          updateMany: {
            where: { type: 'EMAIL' },
            data: { status: 'VERIFIED' }
          }
        }
      }
    });

    // Clean up used token
    await prisma.verificationToken.delete({ where: { token } });

    // Redirect to success page
    return NextResponse.redirect(
      `${appBaseUrl()}/auth/verify?success=email`
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
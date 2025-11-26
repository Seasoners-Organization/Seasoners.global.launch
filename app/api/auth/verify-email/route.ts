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
      subject: 'Welcome to Seasoners – Verify your email',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                    max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #0369a1; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
              Welcome to Seasoners
            </h1>
            <p style="color: #64748b; font-size: 15px; margin: 0;">
              Let's get you connected.
            </p>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
              You're one step away from joining a global community built on trust, fairness, and human connection.
            </p>
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
              Click the button below to verify your email and activate your account.
            </p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%);
                        color: #ffffff; padding: 14px 32px; text-decoration: none; 
                        border-radius: 8px; font-weight: 600; font-size: 15px;">
                Verify Email Address
              </a>
            </div>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">
              <strong>This link expires in 30 minutes.</strong>
            </p>
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">
              Didn't create a Seasoners account? You can safely ignore this email.
            </p>
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Seasoners – Work. Live. Explore. Together.
            </p>
          </div>
        </div>
      `,
    });
    if ((sendResult as any)?.error) {
      console.error('Resend verification email error:', (sendResult as any).error);
    } else {
      console.log('✅ Verification email sent:', (sendResult as any)?.data?.id);
    }

    if ((sendResult as any)?.error) {
      console.error('Resend send error:', (sendResult as any).error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
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
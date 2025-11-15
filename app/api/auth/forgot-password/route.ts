import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account exists, a reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    
    try {
      const result = await resend.emails.send({
        from: 'Seasoners <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your Seasoners password',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                      max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #0369a1; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
                Reset Your Password
              </h1>
              <p style="color: #64748b; font-size: 15px; margin: 0;">
                We received a request to reset your password.
              </p>
            </div>

            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
                Click the button below to create a new password for your Seasoners account.
              </p>
              <div style="text-align: center;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%);
                          color: #ffffff; padding: 14px 32px; text-decoration: none; 
                          border-radius: 8px; font-weight: 600; font-size: 15px;">
                  Reset Password
                </a>
              </div>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
              <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 8px 0;">
                <strong>This link expires in 1 hour.</strong>
              </p>
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">
                Didn't request a password reset? You can safely ignore this email — your password won't change.
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
      console.log('Password reset email sent:', result);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Don't expose email failure to user
    }

    return NextResponse.json({ 
      message: 'If an account exists, a reset link has been sent.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

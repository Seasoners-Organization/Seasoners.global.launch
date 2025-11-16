import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if user exists - always return success
      return NextResponse.json({
        message: 'If an account exists, a verification email has been sent.'
      });
    }

    // If already verified, return success
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email is already verified.'
      });
    }

    // Call the verify-email API to send the email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        email: user.email
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send verification email:', errorText);
      throw new Error('Failed to send verification email');
    }

    return NextResponse.json({
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification' },
      { status: 500 }
    );
  }
}
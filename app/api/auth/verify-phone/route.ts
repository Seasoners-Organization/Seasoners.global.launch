import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';

const prisma = new PrismaClient();
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Cache verification codes with expiry (5 minutes)
const verificationCodes = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeCode(userId: string, code: string) {
  verificationCodes.set(userId, {
    code,
    attempts: 0,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  // Clean up expired codes
  setTimeout(() => {
    verificationCodes.delete(userId);
  }, 5 * 60 * 1000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, phoneNumber, code } = body;

    if (action === 'send') {
      // Generate and send new verification code
      const verificationCode = generateCode();
      storeCode(userId, verificationCode);

      // Send SMS
      await twilioClient.messages.create({
        body: `Your Seasoners verification code is: ${verificationCode}`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
      });

      return NextResponse.json({
        message: 'Verification code sent successfully'
      });

    } else if (action === 'verify') {
      // Verify submitted code
      const storedData = verificationCodes.get(userId);
      
      if (!storedData) {
        return NextResponse.json(
          { error: 'No verification code found' },
          { status: 400 }
        );
      }

      if (storedData.expires < Date.now()) {
        verificationCodes.delete(userId);
        return NextResponse.json(
          { error: 'Verification code expired' },
          { status: 400 }
        );
      }

      if (storedData.attempts >= 3) {
        verificationCodes.delete(userId);
        return NextResponse.json(
          { error: 'Too many attempts. Please request a new code.' },
          { status: 400 }
        );
      }

      if (storedData.code !== code) {
        storedData.attempts++;
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        );
      }

      // Update user's phone verification status
      await prisma.user.update({
        where: { id: userId },
        data: { 
          phoneVerified: new Date(),
          verificationAttempts: {
            updateMany: {
              where: { type: 'PHONE' },
              data: { status: 'VERIFIED' }
            }
          }
        }
      });

      // Clean up used code
      verificationCodes.delete(userId);

      return NextResponse.json({
        message: 'Phone number verified successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Phone verification error:', error);
    return NextResponse.json(
      { error: 'Failed to process phone verification' },
      { status: 500 }
    );
  }
}
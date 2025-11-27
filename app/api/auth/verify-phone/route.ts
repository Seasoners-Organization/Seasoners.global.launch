import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';

const prisma = new PrismaClient();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || 'VA3f330d423cba8010c2a57cf1debfd348';

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
      // Use Twilio Verify API to send code
      await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' });

      return NextResponse.json({
        message: 'Verification code sent successfully'
      });


    } else if (action === 'verify') {
      // Use Twilio Verify API to check code
      const verificationCheck = await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: phoneNumber, code });

      if (verificationCheck.status !== 'approved') {
        return NextResponse.json(
          { error: 'Invalid or expired verification code' },
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
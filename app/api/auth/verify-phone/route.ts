import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { prisma } from '@/lib/prisma';
import { sendVerificationCompletedEmail } from '@/utils/onboarding-emails';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
  console.warn('⚠️ Twilio env vars missing (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID). Phone verification will fail.');
}

const twilioClient = twilio(
  TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN || ''
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, phoneNumber, code } = body;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      return NextResponse.json(
        { error: 'Phone verification not configured (Twilio env missing)' },
        { status: 500 }
      );
    }


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

      // If a userId is provided, persist verification on the user record; otherwise, just return success
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            phoneNumber,
            phoneVerified: new Date(),
            verificationAttempts: {
              updateMany: {
                where: { type: 'PHONE' },
                data: { status: 'VERIFIED' }
              }
            }
          }
        });

        // Send non-blocking verification completed email
        try {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user && user.email) {
            sendVerificationCompletedEmail(user as any, 'phone').catch(() => {});
          }
        } catch (e) {
          console.warn('sendVerificationCompletedEmail failed:', e);
        }
      }

      // Send non-blocking verification completed email
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
          // fire-and-forget
          sendVerificationCompletedEmail(user as any, 'phone').catch(() => {});
        }
      } catch (e) {
        console.warn('sendVerificationCompletedEmail failed:', e);
      }

      return NextResponse.json({ message: 'Phone number verified successfully' });
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
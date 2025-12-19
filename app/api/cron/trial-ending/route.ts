import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTrialEndingEmail } from '@/utils/onboarding-emails';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const twoDays = 2 * 24 * 60 * 60 * 1000;
    const targetStart = new Date(now.getTime() + twoDays);
    targetStart.setHours(0, 0, 0, 0);
    const targetEnd = new Date(now.getTime() + twoDays);
    targetEnd.setHours(23, 59, 59, 999);

    const users = await prisma.user.findMany({
      where: {
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: {
          gte: targetStart,
          lte: targetEnd,
        },
        email: { not: null },
      },
      select: { id: true, email: true, name: true, subscriptionExpiresAt: true },
    });

    const results: Array<{ id: string; sent: boolean; error?: string }> = [];

    await Promise.all(
      users.map(async (user) => {
        try {
          await sendTrialEndingEmail(user as any, 2);
          results.push({ id: user.id, sent: true });
        } catch (e: any) {
          results.push({ id: user.id, sent: false, error: e?.message || 'unknown error' });
        }
      })
    );

    return NextResponse.json({ count: users.length, results });
  } catch (e: any) {
    console.error('cron/trial-ending error:', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

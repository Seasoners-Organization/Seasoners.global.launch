import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canSendMessages, getCurrentPeriodStart, FREE_MESSAGE_QUOTA } from '@/utils/subscription';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get current month usage
    const periodStart = getCurrentPeriodStart();
    const usage = await (prisma as any).messageUsage.findUnique({
      where: {
        userId_periodStart: {
          userId: user.id,
          periodStart: periodStart,
        },
      },
    });

    const currentUsage = usage?.sentCount || 0;
    const quotaCheck = canSendMessages(user as any, currentUsage);

    return NextResponse.json({
      tier: user.subscriptionTier,
      unlimited: quotaCheck.unlimited || false,
      quota: quotaCheck.unlimited ? null : {
        total: FREE_MESSAGE_QUOTA,
        used: currentUsage,
        remaining: quotaCheck.remaining || 0,
      },
      periodStart: periodStart.toISOString(),
      canSend: quotaCheck.allowed,
    });

  } catch (err) {
    console.error('Get message quota error:', err);
    return NextResponse.json({ error: 'Failed to fetch quota' }, { status: 500 });
  }
}

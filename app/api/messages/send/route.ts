import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canSendMessages, getCurrentPeriodStart, FREE_MESSAGE_QUOTA } from '@/utils/subscription';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Messaging unavailable' }, { status: 503 });
    }

    const body = await req.json();
    const { recipientId, listingId, message } = body;

    if (!recipientId || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'recipientId and message required' }, { status: 400 });
    }

    if (message.trim().length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 chars)' }, { status: 413 });
    }

    const sender = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    // Check recipient exists and prevent self-messaging
    const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }
    if (recipient.id === sender.id) {
      return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
    }

    // MESSAGE QUOTA ENFORCEMENT
    const periodStart = getCurrentPeriodStart();
    
    // Get or create usage record for current month
    let usage = await (prisma as any).messageUsage.findUnique({
      where: {
        userId_periodStart: {
          userId: sender.id,
          periodStart: periodStart,
        },
      },
    });

    if (!usage) {
      usage = await (prisma as any).messageUsage.create({
        data: {
          userId: sender.id,
          periodStart: periodStart,
          sentCount: 0,
        },
      });
    }

    // Check quota
    const quotaCheck = canSendMessages(sender as any, usage.sentCount);
    
    if (!quotaCheck.allowed) {
      return NextResponse.json({ 
        error: quotaCheck.reason,
        quota: quotaCheck.quota,
        used: quotaCheck.used,
        upgradeRequired: true,
      }, { status: 403 });
    }

    // Optional listing validation
    let listing = null;
    if (listingId) {
      listing = await prisma.listing.findUnique({ where: { id: listingId } });
    }

    // Simple rate limiting: max 20 messages per minute per sender
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCount = await prisma.message.count({
      where: { senderId: sender.id, createdAt: { gte: oneMinuteAgo } },
    });

    if (recentCount >= 20) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please wait before sending more messages.' 
      }, { status: 429 });
    }

    // Create message
    const created = await prisma.message.create({
      data: {
        senderId: sender.id,
        recipientId: recipient.id,
        listingId: listing ? listing.id : listingId || null,
        body: message.trim(),
      },
    });

    // Increment usage count
    await (prisma as any).messageUsage.update({
      where: {
        userId_periodStart: {
          userId: sender.id,
          periodStart: periodStart,
        },
      },
      data: {
        sentCount: { increment: 1 },
      },
    });

    // Return success with updated quota info
    const newUsage = usage.sentCount + 1;
    const updatedQuotaCheck = canSendMessages(sender as any, newUsage);

    return NextResponse.json({ 
      message: created,
      quota: updatedQuotaCheck.unlimited ? null : {
        total: FREE_MESSAGE_QUOTA,
        used: newUsage,
        remaining: updatedQuotaCheck.remaining || 0,
      },
    }, { status: 201 });
    
  } catch (err) {
    console.error('Send message error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

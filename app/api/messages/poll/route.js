import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '../../../../lib/prisma';
import { rateLimit } from '../../../../lib/rate-limit';

/**
 * Optimized message polling endpoint with rate limiting
 * Returns only new messages since the provided timestamp
 * 
 * Query params:
 * - userId: recipient user ID
 * - since: timestamp of last message check (ISO string)
 * - limit: max messages to return (default 50, max 100)
 */
export async function GET(request) {
  try {
    // Rate limit: max 30 polls per minute per user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';
    
    const result = rateLimit(`poll-${session.user.id}-${ip}`, 30, 60000);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Too many poll requests. Please slow down.' },
        { 
          status: 429,
          headers: { 'Retry-After': String(result.retryAfter) }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const since = searchParams.get('since');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Build query
    const where = {
      OR: [
        { senderId: session.user.id, recipientId: userId },
        { senderId: userId, recipientId: session.user.id },
      ],
    };

    // Only get messages since the provided timestamp
    if (since) {
      where.createdAt = { gt: new Date(since) };
    }

    const messages = await prisma.message.findMany({
      where,
      select: {
        id: true,
        content: true,
        senderId: true,
        recipientId: true,
        createdAt: true,
        isRead: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    // Mark received messages as read
    if (messages.length > 0) {
      const receivedMessageIds = messages
        .filter(m => m.recipientId === session.user.id && !m.isRead)
        .map(m => m.id);

      if (receivedMessageIds.length > 0) {
        await prisma.message.updateMany({
          where: { id: { in: receivedMessageIds } },
          data: { isRead: true },
        });
      }
    }

    return NextResponse.json({
      messages,
      hasMore: messages.length === limit,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Poll messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

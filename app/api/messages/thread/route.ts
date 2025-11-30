import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get('userId');
    const listingId = searchParams.get('listingId');
    if (!otherUserId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const me = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!me) return NextResponse.json({ messages: [] }, { status: 200 });

    const where: any = {
      OR: [
        { senderId: me.id, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: me.id }
      ]
    };
    if (listingId) where.listingId = listingId;

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    // Mark unread messages addressed to current user as read
    const unreadIds = messages.filter(m => m.recipientId === me.id && !m.readAt).map(m => m.id);
    if (unreadIds.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { readAt: new Date() }
      });
    }
    const updated = unreadIds.length
      ? messages.map(m => unreadIds.includes(m.id) ? { ...m, readAt: new Date() } : m)
      : messages;

    return NextResponse.json({ messages: updated, unreadMarked: unreadIds.length }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load thread' }, { status: 500 });
  }
}

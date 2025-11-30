import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ conversations: [] }, { status: 200 });
    }

    const me = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!me) return NextResponse.json({ conversations: [] }, { status: 200 });

    // Fetch last 20 message threads: group by other participant + listing
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: me.id },
          { recipientId: me.id }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { listing: true }
    });

    // Build conversation map
    const map = new Map<string, any>();
    for (const msg of messages) {
      const otherUserId = msg.senderId === me.id ? msg.recipientId : msg.senderId;
      const key = `${otherUserId}:${msg.listingId || 'general'}`;
      const isUnreadForMe = msg.recipientId === me.id && !msg.readAt;
      if (!map.has(key)) {
        map.set(key, {
          userId: otherUserId,
          listingId: msg.listingId || null,
          lastMessage: msg.body,
          lastSentAt: msg.createdAt,
          listing: msg.listing ? { id: msg.listing.id, title: msg.listing.title, type: msg.listing.type } : null,
          unreadCount: isUnreadForMe ? 1 : 0
        });
      } else if (isUnreadForMe) {
        const existing = map.get(key);
        existing.unreadCount += 1;
      }
    }

    const conversations = Array.from(map.values())
      .sort((a, b) => b.lastSentAt.getTime() - a.lastSentAt.getTime())
      .slice(0, 20);

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load inbox' }, { status: 500 });
  }
}

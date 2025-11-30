import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canContactSellers } from '@/utils/subscription';

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
    if (!sender) return NextResponse.json({ error: 'Sender not found' }, { status: 404 });

    // Recipient existence & self-message prevention
    const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
    if (!recipient) return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    if (recipient.id === sender.id) return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });

    // Basic permission: must be SEARCHER or LISTER to contact
    if (!canContactSellers(sender as any)) {
      return NextResponse.json({ error: 'Upgrade required to send messages' }, { status: 403 });
    }

    // Optional listing validation
    let listing = null;
    if (listingId) {
      listing = await prisma.listing.findUnique({ where: { id: listingId } });
      // Silently ignore invalid listingId (kept as null) rather than erroring
    }

    // Simple rate limiting: max 20 messages per minute per sender
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCount = await prisma.message.count({
      where: { senderId: sender.id, createdAt: { gte: oneMinuteAgo } }
    });
    if (recentCount >= 20) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait before sending more messages.' }, { status: 429 });
    }

    const created = await prisma.message.create({
      data: {
        senderId: sender.id,
        recipientId: recipient.id,
        listingId: listing ? listing.id : listingId || null,
        body: message.trim()
      }
    });

    return NextResponse.json({ message: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
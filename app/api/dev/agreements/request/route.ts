import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendAgreementRequestEmail } from '../../../../../utils/agreement-emails';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { email, listingId, preamble, clauses, startDate, endDate, countryCode = 'AT' } = body;

    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    if (!listingId || !preamble || !clauses) {
      return NextResponse.json({ error: 'Missing required fields: listingId, preamble, clauses' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({ where: { email } });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    const agreement = await prisma.agreement.create({
      data: {
        listingId,
        hostId: listing.userId,
        guestId: currentUser.id,
        preamble,
        clauses,
        countryCode,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'PENDING_HOST',
      },
      include: {
        listing: true,
        host: { select: { id: true, name: true, email: true, image: true } },
        guest: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    try {
      await sendAgreementRequestEmail(agreement, agreement.host);
    } catch (err) {
      console.error('Failed to send agreement request email (dev):', err);
    }

    return NextResponse.json(agreement, { status: 201 });
  } catch (err) {
    console.error('Dev agreement request error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

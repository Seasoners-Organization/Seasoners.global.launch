import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { sendAgreementRequestEmail } from '../../../../utils/agreement-emails';

/**
 * POST /api/agreements/request
 * Allows a guest to request an agreement for an existing listing. This creates
 * an agreement with status 'PENDING_HOST' and notifies the host.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { listingId, preamble, clauses, startDate, endDate, countryCode = 'AT' } = body;

    if (!listingId || !preamble || !clauses) {
      return NextResponse.json({ error: 'Missing required fields: listingId, preamble, clauses' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    // Create agreement with host as listing.owner and current user as guest
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

    // Notify host about the request
    try {
      await sendAgreementRequestEmail(agreement, agreement.host);
    } catch (err) {
      console.error('Failed to send agreement request email:', err);
    }

    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    console.error('Error creating agreement request:', error);
    return NextResponse.json({ error: 'Failed to create agreement request' }, { status: 500 });
  }
}

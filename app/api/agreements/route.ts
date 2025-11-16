import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendAgreementCreatedEmail } from '../../../utils/agreement-emails';

/**
 * POST /api/agreements
 * Create a new agreement between host and guest for a listing
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { listingId, guestId, preamble, clauses, startDate, endDate, countryCode = 'AT' } = body;

    // Validate required fields
    if (!listingId || !guestId || !preamble || !clauses) {
      return NextResponse.json(
        { error: 'Missing required fields: listingId, guestId, preamble, clauses' },
        { status: 400 }
      );
    }

    // Verify listing exists and belongs to current user (host)
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only the listing owner can create agreements' },
        { status: 403 }
      );
    }

    // Verify guest exists
    const guest = await prisma.user.findUnique({
      where: { id: guestId },
    });

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Create agreement
    const agreement = await prisma.agreement.create({
      data: {
        listingId,
        hostId: currentUser.id,
        guestId,
        preamble,
        clauses,
        countryCode,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'DRAFT',
      },
      include: {
        listing: true,
        host: {
          select: { id: true, name: true, email: true, image: true },
        },
        guest: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Send email notification to guest
    try {
      await sendAgreementCreatedEmail(agreement, guest);
    } catch (emailError) {
      console.error('Failed to send agreement created email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    console.error('Error creating agreement:', error);
    return NextResponse.json(
      { error: 'Failed to create agreement' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agreements
 * List all agreements for the authenticated user (as host or guest)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role'); // 'host', 'guest', or null (both)
    const status = searchParams.get('status'); // Filter by status

    // Build query
    const where: any = {
      OR: [],
    };

    if (role === 'host') {
      where.OR.push({ hostId: currentUser.id });
    } else if (role === 'guest') {
      where.OR.push({ guestId: currentUser.id });
    } else {
      // Default: show both
      where.OR.push({ hostId: currentUser.id }, { guestId: currentUser.id });
    }

    if (status) {
      where.status = status;
    }

    const agreements = await prisma.agreement.findMany({
      where,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            type: true,
            location: true,
            region: true,
            city: true,
          },
        },
        host: {
          select: { id: true, name: true, email: true, image: true },
        },
        guest: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(agreements);
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agreements' },
      { status: 500 }
    );
  }
}

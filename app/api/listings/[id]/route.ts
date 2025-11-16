import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const listingId = params.id;

    // Check if listing exists and belongs to user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (listing.userId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this listing' },
        { status: 403 }
      );
    }

    // Delete the listing
    await prisma.listing.delete({
      where: { id: listingId },
    });

    // Update user's total listings count
    await prisma.user.update({
      where: { id: user.id },
      data: { totalListings: { decrement: 1 } },
    });

    return NextResponse.json(
      { message: 'Listing deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            trustScore: true,
            responseRate: true,
            createdAt: true,
            profilePicture: true,
            aboutMe: true,
            spokenLanguages: true,
            occupation: true,
            interests: true,
            nationality: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing }, { status: 200 });

  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

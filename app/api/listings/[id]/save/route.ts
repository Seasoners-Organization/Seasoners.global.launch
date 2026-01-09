import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canContactSellers } from '@/utils/subscription';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, subscriptionTier: true, subscriptionStatus: true, subscriptionExpiresAt: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check subscription permission
    if (!canContactSellers(user as any)) {
      return NextResponse.json(
        { error: 'Subscription required to save listings' },
        { status: 403 }
      );
    }

    // Save the listing
    const saved = await prisma.savedListing.create({
      data: {
        userId: user.id,
        listingId: id,
      },
    });

    return NextResponse.json({
      success: true,
      data: saved,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint violation - already saved
      return NextResponse.json(
        { error: 'Listing already saved' },
        { status: 400 }
      );
    }

    console.error('Save listing error:', error);
    return NextResponse.json(
      { error: 'Failed to save listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove the saved listing
    const deleted = await prisma.savedListing.delete({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId: id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: deleted,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Not found
      return NextResponse.json(
        { error: 'Saved listing not found' },
        { status: 404 }
      );
    }

    console.error('Unsave listing error:', error);
    return NextResponse.json(
      { error: 'Failed to unsave listing' },
      { status: 500 }
    );
  }
}

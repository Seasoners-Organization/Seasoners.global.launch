import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canCreateListings } from '@/utils/subscription';

export async function GET(request: NextRequest) {
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

    // Check if user is a lister
    if (!canCreateListings(user as any)) {
      return NextResponse.json(
        { error: 'Only listers can view analytics' },
        { status: 403 }
      );
    }

    // Get all listings for this user with analytics
    const listings = await prisma.listing.findMany({
      where: { userId: user.id },
      include: {
        analytics: {
          orderBy: { date: 'desc' },
          take: 30, // Last 30 days
        },
        _count: {
          select: {
            reviews: true,
            agreements: true,
            messages: true,
            savedBy: true,
          },
        },
      },
    });

    // Calculate aggregated stats
    const analytics = listings.map((listing) => {
      const totalViews = listing.analytics.reduce(
        (sum, day) => sum + day.pageViews,
        0
      );
      const totalUniqueViews = listing.analytics.reduce(
        (sum, day) => sum + day.uniqueViews,
        0
      );
      const totalMessages = listing.analytics.reduce(
        (sum, day) => sum + day.messagesSent,
        0
      );
      const totalApplications = listing.analytics.reduce(
        (sum, day) => sum + day.applicationsReceived,
        0
      );
      const totalSaves = listing.analytics.reduce(
        (sum, day) => sum + day.savedCount,
        0
      );

      return {
        id: listing.id,
        title: listing.title,
        type: listing.type,
        location: listing.location,
        price: listing.price,
        createdAt: listing.createdAt,
        stats: {
          totalViews,
          totalUniqueViews,
          totalMessages,
          totalApplications,
          totalSaves,
          totalReviews: listing._count.reviews,
          totalAgreements: listing._count.agreements,
          currentSaves: listing._count.savedBy,
        },
        recentActivity: listing.analytics.slice(0, 7),
      };
    });

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

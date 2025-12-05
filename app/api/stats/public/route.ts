import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/stats/public
 * Returns public community stats for display on homepage
 * Cached hourly to reduce database load
 */
export async function GET() {
  try {
    // Count total users
    const userCount = await prisma.user.count();

    // Count total listings (STAY + JOB + FLATSHARE)
    const listingCount = await prisma.listing.count();

    // Count unique countries/regions from listings
    const uniqueRegions = await prisma.listing.findMany({
      distinct: ['region'],
      select: { region: true },
      where: { region: { not: null } }
    });
    const countryCount = uniqueRegions.filter(r => r.region).length;

    // Count messages (as a proxy for "connections made")
    // Each message represents an interaction between two users
    const messageCount = await prisma.message.count();

    return NextResponse.json(
      {
        users: userCount,
        listings: listingCount,
        connections: messageCount,
        countries: countryCount,
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch public stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

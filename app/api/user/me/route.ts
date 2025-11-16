import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
    }

    // Cast prisma to any to include newly added fields until types are regenerated
    const user = await (prisma as any).user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
        isEarlyBird: true,
        waitlistStatus: true,
        totalListings: true,
        trustScore: true,
        responseRate: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        profilePicture: true,
        dateOfBirth: true,
        nationality: true,
        spokenLanguages: true,
        occupation: true,
        workExperience: true,
        skills: true,
        aboutMe: true,
        interests: true,
        availability: true,
        willingToRelocate: true,
        hasWorkPermit: true,
        workPermitCountries: true,
        profileVisibility: true,
        openToOpportunities: true,
        preferredRegions: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
    }

    return NextResponse.json({ user }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  }
}

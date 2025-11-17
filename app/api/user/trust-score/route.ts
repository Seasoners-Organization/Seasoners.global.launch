import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import trustMetrics from '../../../../utils/trust-metrics';
const { calculateTrustScore, getTrustSuggestions } = trustMetrics;

/**
 * GET /api/user/trust-score
 * Calculate and return user's current trust score with breakdown
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user with all trust-related fields
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform verification status to boolean
    const userForCalc = {
      name: user.name,
      image: user.image,
      phone: user.phoneNumber,
      region: null, // Not using region in calculation yet
      preferredLanguage: (user as any).preferredLanguage,
      bio: (user as any).bio,
      emailVerified: !!user.emailVerified,
      phoneVerified: !!user.phoneVerified,
      identityVerified: user.identityVerified === 'VERIFIED',
      responseRate: user.responseRate,
      completedAgreements: (user as any).completedAgreements || 0,
      completedStays: (user as any).completedStays || 0,
      reviewsGiven: (user as any).reviewsGivenCount || 0,
      reviewsReceived: (user as any).reviewsReceivedCount || 0,
      storiesShared: (user as any).storiesShared || 0,
      culturalNotesAdded: (user as any).culturalNotesAdded || 0,
      helpfulFlags: (user as any).helpfulFlags || 0,
    };

    // Calculate fresh trust score
    const trustData: any = calculateTrustScore(userForCalc);
    const suggestions: any = getTrustSuggestions(trustData.factors);

    // Update user's trust score in DB (async, don't wait)
    (prisma.user.update({
      where: { id: user.id },
      data: {
        trustScore: trustData.score,
      } as any
    }) as any).catch((err: any) => console.error('Failed to update trust score:', err));

    return NextResponse.json({
      score: trustData.score,
      level: trustData.level,
      factors: trustData.factors,
      suggestions: suggestions.slice(0, 3), // Top 3 suggestions
      lastCalculated: trustData.lastCalculated,
    });

  } catch (error) {
    console.error('Trust score calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate trust score' },
      { status: 500 }
    );
  }
}

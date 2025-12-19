import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has an active subscription
    if (!user.stripeSubscriptionId || user.subscriptionStatus !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'No active subscription to cancel' },
        { status: 400 }
      );
    }

    // Cancel Stripe subscription
    const stripe = getStripe();
    await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'CANCELLED',
        subscriptionTier: 'FREE',
      },
    });

    console.log(`Subscription cancelled for user ${user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    
    if (error instanceof Error && error.message.includes('No such subscription')) {
      return NextResponse.json(
        { error: 'Subscription not found in Stripe' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

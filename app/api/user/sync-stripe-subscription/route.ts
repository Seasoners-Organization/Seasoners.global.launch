import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user (after possible email update)
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check Stripe for a customer with this email
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    // Find Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email ?? undefined, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({ message: 'No Stripe customer found for this email.' }, { status: 200 });
    }

    // Find active subscription for this customer
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 10 });
    const activeSub = subscriptions.data.find(sub => sub.status === 'active');
    if (!activeSub) {
      return NextResponse.json({ message: 'No active subscription found for this email.' }, { status: 200 });
    }

    // Update user with subscription info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: 'PLUS', // New monetization model uses PLUS tier
        subscriptionStatus: 'ACTIVE',
        stripeCustomerId: customer.id,
        stripeSubscriptionId: activeSub.id,
        subscriptionExpiresAt: new Date((activeSub as any).current_period_end * 1000),
      },
    });

    return NextResponse.json({ message: 'Subscription synced from Stripe.', subscriptionId: activeSub.id }, { status: 200 });
  } catch (error) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json({ error: 'Failed to sync subscription' }, { status: 500 });
  }
}

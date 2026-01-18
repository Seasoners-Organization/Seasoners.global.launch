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
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const { tier, returnUrl } = await req.json();

    // In new model, only PLUS tier exists for subscriptions
    if (tier !== 'PLUS') {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get price ID from environment
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price configuration missing' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const trialDays = 7; // 7-day free trial
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.seasoners.eu';
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe?cancelled=true`,
      metadata: {
        userId: user.id,
        email: user.email,
        tier: 'PLUS',
      },
      subscription_data: {
        trial_period_days: trialDays,
        metadata: {
          userId: user.id,
          tier: 'PLUS',
        },
      },
      automatic_tax: { enabled: false },
      billing_address_collection: 'auto',
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (err) {
    console.error('Create checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

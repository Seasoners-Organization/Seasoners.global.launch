import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import Stripe from 'stripe';
import { getStripe } from '../../../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
  const { tier, returnUrl, isEarlyBird, isEarlyBirdOneTime, email } = await req.json();

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Determine if this is a one-time early-bird lock-in (no auth required)
    const session = await getServerSession(authOptions);

    // Validate tier only for subscription flow; early-bird one-time does not depend on tier
    if (!isEarlyBirdOneTime) {
      if (!tier || !['SEARCHER', 'LISTER'].includes(tier)) {
        return NextResponse.json(
          { error: 'Invalid subscription tier' },
          { status: 400 }
        );
      }
    }

    // For one-time early-bird payment, allow without auth (use provided email)
    let user = null as any;
    if (!isEarlyBirdOneTime) {
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'Unauthorized. Please sign in.' },
          { status: 401 }
        );
      }
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    // Check if early-bird pricing is active
    const launchSettings = await (prisma as any).launchSettings.findFirst();
  const useEarlyBirdPricing = (isEarlyBird || isEarlyBirdOneTime) && launchSettings?.earlyBirdActive;

    // Get the appropriate price ID
    let priceId: string | undefined;
    const isOneTime = Boolean(isEarlyBirdOneTime);

    if (isOneTime) {
      // One-time early-bird payment (covers all features)
      priceId = process.env.STRIPE_EARLY_BIRD_PRICE_ID as string;
    } else if (useEarlyBirdPricing) {
      // Subscription flow with early-bird discount (if used elsewhere)
      priceId = tier === 'SEARCHER'
        ? process.env.STRIPE_SEARCHER_PRICE_ID
        : process.env.STRIPE_LISTER_PRICE_ID;
    } else {
      // Regular subscription pricing
      priceId = tier === 'SEARCHER' 
        ? process.env.STRIPE_SEARCHER_PRICE_ID 
        : process.env.STRIPE_LISTER_PRICE_ID;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price configuration missing' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: isOneTime ? email : user.email,
      client_reference_id: isOneTime ? undefined : user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isOneTime ? 'payment' : 'subscription',
      success_url: `${returnUrl || process.env.NEXTAUTH_URL}?${isOneTime ? 'earlybird' : 'subscription'}=success`,
      cancel_url: `${returnUrl || process.env.NEXTAUTH_URL}?${isOneTime ? 'earlybird' : 'subscription'}=cancelled`,
      metadata: {
        userId: isOneTime ? '' : user.id,
        email: isOneTime ? email : user.email,
        tier: isOneTime ? 'ALL' : tier,
        isEarlyBird: useEarlyBirdPricing ? 'true' : 'false',
        isEarlyBirdOneTime: isOneTime ? 'true' : 'false',
      },
      ...(isOneTime
        ? {}
        : {
            subscription_data: {
              metadata: {
                userId: user.id,
                tier,
                isEarlyBird: useEarlyBirdPricing ? 'true' : 'false',
              },
            },
          }),
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

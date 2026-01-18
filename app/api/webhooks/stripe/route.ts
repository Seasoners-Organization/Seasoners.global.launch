import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const webhookSecret = getStripeWebhookSecret();

    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe webhook not configured' },
        { status: 500 }
      );
    }

    const body = await req.text();
    const headersList = await req.headers;
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`✅ Stripe webhook received: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, stripe);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const mode = session.mode; // 'subscription' | 'payment'
  const metadata = session.metadata || {};

  console.log(`📦 Checkout completed: mode=${mode}`, metadata);

  if (mode === 'payment') {
    // Check if this is a boost purchase
    if (metadata.listingId && metadata.boostType && metadata.durationDays) {
      await handleBoostPurchase(session, metadata);
      return;
    }
    
    // Check if this is early-bird one-time payment
    const isEarlyBirdOneTime = metadata.isEarlyBirdOneTime === 'true';
    if (isEarlyBirdOneTime) {
      await handleEarlyBirdOneTime(session, metadata);
      return;
    }
  }

  if (mode === 'subscription') {
    await handleSubscriptionCheckout(session, metadata);
  }
}

async function handleBoostPurchase(
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const { listingId, userId, durationDays, price } = metadata;

  console.log(`🚀 Processing boost purchase for listing ${listingId}`);

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      console.error(`❌ Listing ${listingId} not found`);
      return;
    }

    // Calculate expiry date
    const now = new Date();
    const expiresAt = new Date(now.getTime() + parseInt(durationDays) * 24 * 60 * 60 * 1000);

    // Update listing with featured boost
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        isFeatured: true,
        featuredUntil: expiresAt,
      },
    });

    // Create boost record
    await (prisma as any).listingBoost.create({
      data: {
        listingId: listingId,
        userId: userId,
        durationDays: parseInt(durationDays),
        price: parseFloat(price),
        startedAt: now,
        expiresAt: expiresAt,
        stripePaymentIntentId: session.payment_intent as string,
        stripeCheckoutSessionId: session.id,
      },
    });

    console.log(`✅ Boost activated for listing ${listingId} until ${expiresAt.toISOString()}`);
  } catch (err) {
    console.error(`❌ Failed to process boost purchase:`, err);
  }
}

async function handleEarlyBirdOneTime(
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const email = (metadata.email || session.customer_details?.email) as string | undefined;
  
  if (!email) {
    console.error('❌ Early-bird one-time completed without email');
    return;
  }

  console.log(`🐦 Processing early-bird one-time for ${email}`);

  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEarlyBird: true,
        earlyBirdSignupDate: new Date(),
        waitlistStatus: 'active',
        subscriptionTier: 'PLUS',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
      } as any,
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        isEarlyBird: true,
        earlyBirdSignupDate: new Date(),
        waitlistStatus: 'active',
        subscriptionTier: 'PLUS',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
        emailVerified: new Date(),
      } as any,
    });
  }

  await (prisma as any).waitlistSignup.upsert({
    where: { email },
    create: {
      email,
      earlyBirdLocked: true,
      checkoutSessionId: session.id,
      paymentIntentId: session.payment_intent as string || null,
      userId: user.id,
    },
    update: {
      earlyBirdLocked: true,
      checkoutSessionId: session.id,
      paymentIntentId: session.payment_intent as string || null,
      userId: user.id,
    },
  });

  console.log(`✅ Early-bird founding member status granted to ${email}`);
}

async function handleSubscriptionCheckout(
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const userId = metadata.userId;
  const tier = 'PLUS'; // New model only has PLUS subscription
  
  if (!userId) {
    console.error('❌ No userId in subscription checkout metadata');
    return;
  }

  console.log(`💳 Processing subscription checkout for user ${userId}`);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    console.error(`❌ User ${userId} not found`);
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: 'ACTIVE',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`✅ Subscription activated for user ${userId} - ${tier}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log(`🔄 Processing subscription update: ${subscription.id}`);

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!user) {
    console.error(`❌ User not found for subscription ${subscription.id}`);
    return;
  }

  const status = subscription.status === 'active' ? 'ACTIVE' : 
                 subscription.status === 'past_due' ? 'PAST_DUE' :
                 subscription.status === 'canceled' ? 'CANCELLED' : 'EXPIRED';

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: status,
      subscriptionExpiresAt: new Date((subscription as any).current_period_end * 1000),
    },
  });

  console.log(`✅ Subscription updated for user ${user.id} - ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`🗑️  Processing subscription deletion: ${subscription.id}`);

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!user) {
    console.error(`❌ User not found for subscription ${subscription.id}`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'CANCELLED',
      subscriptionTier: 'FREE',
    },
  });

  console.log(`✅ Subscription cancelled for user ${user.id} - reverted to FREE`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, stripe: Stripe) {
  if (!(invoice as any).subscription) return;

  console.log(`💰 Payment succeeded for subscription ${(invoice as any).subscription}`);

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: (invoice as any).subscription as string },
  });

  if (!user) {
    console.error(`❌ User not found for subscription ${(invoice as any).subscription}`);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'ACTIVE',
      subscriptionExpiresAt: new Date((subscription as any).current_period_end * 1000),
    },
  });

  console.log(`✅ Payment processed for user ${user.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!(invoice as any).subscription) return;

  console.log(`⚠️  Payment failed for subscription ${(invoice as any).subscription}`);

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: (invoice as any).subscription as string },
  });

  if (!user) {
    console.error(`❌ User not found for subscription ${(invoice as any).subscription}`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'PAST_DUE',
    },
  });

  console.log(`⚠️  User ${user.id} marked as PAST_DUE`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // This handles one-time payments that don't go through checkout.session.completed
  // Primarily for boosts if using Payment Intents directly
  console.log(`💳 Payment intent succeeded: ${paymentIntent.id}`);
  
  // Most boost payments will be handled via checkout.session.completed
  // This is a fallback/logging point
}

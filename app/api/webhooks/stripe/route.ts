import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { 
  sendSubscriptionConfirmationEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentFailedEmail 
} from '@/utils/onboarding-emails';
import { Resend } from 'resend';

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
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

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

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const mode = session.mode; // 'subscription' | 'payment'
  const metadata = session.metadata || {};
  const tier = metadata.tier as 'SEARCHER' | 'LISTER' | undefined;
  const isEarlyBird = metadata.isEarlyBird === 'true';
  const isEarlyBirdOneTime = metadata.isEarlyBirdOneTime === 'true';

  if (mode === 'payment' && isEarlyBirdOneTime) {
    // ...existing code...
    const email = (metadata.email || (session.customer_details as any)?.email) as string | undefined;
    if (!email) {
      console.error('Early-bird one-time completed without email');
      return;
    }
    // ...existing code...
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      // ...existing code...
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEarlyBird: true,
          earlyBirdSignupDate: new Date(),
          waitlistStatus: 'active',
          subscriptionTier: 'LISTER',
          subscriptionStatus: 'ACTIVE',
          subscriptionExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
        } as any,
      });
    } else {
      // ...existing code...
      user = await prisma.user.create({
        data: {
          email,
          isEarlyBird: true,
          earlyBirdSignupDate: new Date(),
          waitlistStatus: 'active',
          subscriptionTier: 'LISTER',
          subscriptionStatus: 'ACTIVE',
          subscriptionExpiresAt: new Date('2100-01-01T00:00:00.000Z'),
          emailVerified: new Date(),
        } as any,
      });
    }
    // ...existing code...
    await (prisma as any).waitlistSignup.upsert({
      where: { email },
      create: {
        email,
        earlyBirdLocked: true,
        checkoutSessionId: session.id,
        paymentIntentId: (session.payment_intent as string) || null,
        userId: user.id,
      },
      update: {
        earlyBirdLocked: true,
        checkoutSessionId: session.id,
        paymentIntentId: (session.payment_intent as string) || null,
        userId: user.id,
      },
    });
    // ...existing code...
    console.log(`✅ Early-bird founding member status granted to ${email} (User ID: ${user.id})`);
    return;
  }

  // Subscription-based flow (Payment Link support)
  const userId = metadata.userId as string | undefined;
  if (userId && tier) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: 'ACTIVE',
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isEarlyBird: isEarlyBird,
        earlyBirdSignupDate: isEarlyBird ? new Date() : undefined,
        waitlistStatus: isEarlyBird ? 'active' : undefined,
      } as any,
    });
    console.log(`Subscription activated for user ${userId} - ${tier}${isEarlyBird ? ' (Early-Bird)' : ''}`);
    return;
  }

  // Payment Link fallback: try to match user by email if no userId/metadata
  const email = session.customer_email || session.customer_details?.email;
  console.log('[Stripe Webhook] Payment Link fallback. Stripe session:', {
    customer_email: session.customer_email,
    customer_details: session.customer_details,
    metadata: session.metadata,
    email,
  });
  if (email) {
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      // Detect tier from subscription
      let detectedTier: 'SEARCHER' | 'LISTER' = 'LISTER';
      if (session.subscription) {
        try {
          const stripe = getStripe();
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const priceId = subscription.items.data[0]?.price.id;
          
          // Map price IDs to tiers
          const searcherPriceId = process.env.NEXT_PUBLIC_STRIPE_SEARCHER_PRICE_ID || 'price_1SSHZ80ptPH0EtIsjljxjcKb';
          const listerPriceId = process.env.NEXT_PUBLIC_STRIPE_LISTER_PRICE_ID || 'price_1SRJ710ptPH0EtIsYZpTMSRe';
          
          if (priceId === searcherPriceId) {
            detectedTier = 'SEARCHER';
          } else if (priceId === listerPriceId) {
            detectedTier = 'LISTER';
          }
          console.log(`[Stripe Webhook] Detected tier from price ${priceId}: ${detectedTier}`);
        } catch (err) {
          console.error('[Stripe Webhook] Failed to detect tier from subscription:', err);
        }
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: detectedTier,
          subscriptionStatus: 'ACTIVE',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`[Stripe Webhook] Payment Link: Upgraded user ${email} to ${detectedTier} (User ID: ${user.id})`);
    } else {
      console.warn(`[Stripe Webhook] Payment Link: No user found for email ${email}`);
    }
  } else {
    console.error('[Stripe Webhook] Payment Link: No email found in session', { session });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Try to find user by Stripe customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
    });

    if (!user) {
      console.error('User not found for subscription update');
      return;
    }

    await updateUserSubscription(user.id, subscription);
  } else {
    await updateUserSubscription(userId, subscription);
  }
}

async function updateUserSubscription(userId: string, subscription: Stripe.Subscription) {
  const status = subscription.status === 'active' ? 'ACTIVE' : 
                 subscription.status === 'past_due' ? 'PAST_DUE' :
                 subscription.status === 'canceled' ? 'CANCELLED' : 'EXPIRED';

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: status,
      stripeSubscriptionId: subscription.id,
      subscriptionExpiresAt: new Date((subscription as any).current_period_end * 1000),
    },
  });

  console.log(`Subscription updated for user ${userId} - ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!user) {
    console.error('User not found for subscription deletion');
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'CANCELLED',
      subscriptionTier: 'FREE',
    },
  });

  console.log(`Subscription cancelled for user ${user.id}`);

  // Send cancellation confirmation email
  sendSubscriptionCancelledEmail(user, {
    tier: user.subscriptionTier || 'FREE',
    expiresAt: new Date((subscription as any).current_period_end * 1000),
  }).catch(err => {
    console.error('❌ Failed to send subscription cancelled email:', err);
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, stripe: Stripe) {
  if (!(invoice as any).subscription) return;

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: (invoice as any).subscription as string },
  });

  if (!user) return;

  // Extend subscription period
  const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'ACTIVE',
      subscriptionExpiresAt: new Date((subscription as any).current_period_end * 1000),
    },
  });

  console.log(`Payment succeeded for user ${user.id}`);
  
  // Send subscription confirmation email (non-blocking)
  sendSubscriptionConfirmationEmail(user, {
    tier: user.subscriptionTier || 'FREE',
    status: 'ACTIVE',
    expiresAt: new Date((subscription as any).current_period_end * 1000),
  }).catch(err => {
    console.error('❌ Failed to send subscription confirmation email:', err);
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!(invoice as any).subscription) return;

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: (invoice as any).subscription as string },
  });

  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'PAST_DUE',
    },
  });

  console.log(`Payment failed for user ${user.id}`);
  
  // Send payment failed email using new template
  sendPaymentFailedEmail(user, {
    tier: user.subscriptionTier || 'FREE',
    status: 'PAST_DUE',
  }).catch(err => {
    console.error('❌ Failed to send payment failed email:', err);
  });
}

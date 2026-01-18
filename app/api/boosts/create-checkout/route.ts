import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { BOOST_PLANS } from '@/utils/subscription';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { listingId, boostType } = body; // boostType: 'BOOST_7' or 'BOOST_30'

    if (!listingId || !boostType) {
      return NextResponse.json({ 
        error: 'listingId and boostType required' 
      }, { status: 400 });
    }

    const boostPlan = BOOST_PLANS[boostType];
    if (!boostPlan || !boostPlan.priceId) {
      return NextResponse.json({ 
        error: 'Invalid boost type or price not configured' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify listing exists and belongs to user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.userId !== user.id) {
      return NextResponse.json({ 
        error: 'You can only boost your own listings' 
      }, { status: 403 });
    }

    // Create Stripe Checkout session for one-time payment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.seasoners.eu';
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price: boostPlan.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/listings/${listingId}?boost_success=true`,
      cancel_url: `${baseUrl}/listings/${listingId}?boost_cancelled=true`,
      metadata: {
        userId: user.id,
        listingId: listingId,
        boostType: boostType,
        durationDays: boostPlan.durationDays.toString(),
        price: boostPlan.price.toString(),
      },
    });

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (err) {
    console.error('Create boost checkout error:', err);
    return NextResponse.json({ 
      error: 'Failed to create boost checkout' 
    }, { status: 500 });
  }
}

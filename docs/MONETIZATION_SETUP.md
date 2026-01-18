# Monetization Model Setup Guide

## Overview

Seasoners uses a freemium model with optional paid upgrades and boosts:

- **FREE**: 10 messages/month, browse listings, create profile (no credit card)
- **Searcher Plus** (€9.90/month): Unlimited messages, saved searches, instant alerts
- **Boosts** (€9.90/7 days, €29.90/30 days): Featured placement for listings/jobs

**Important**: Seasoners does NOT process rent or employment payments. All transactions between users happen off-platform.

## Required Environment Variables

Add these to your `.env.local` and Vercel environment:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Subscription Price IDs (create these in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PLUS_ANNUAL_PRICE_ID=price_...  # Optional

# Boost Price IDs (one-time payments)
NEXT_PUBLIC_STRIPE_BOOST_7_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_BOOST_30_PRICE_ID=price_...

# Early Bird Price ID (if still offering legacy one-time payments)
STRIPE_EARLY_BIRD_PRICE_ID=price_...
```

## Stripe Setup Steps

### 1. Create Products & Prices in Stripe Dashboard

#### Product 1: Searcher Plus (Subscription)
- Name: "Seasoners Searcher Plus"
- Description: "Unlimited messages and instant alerts"
- **Monthly Price**:
  - Amount: EUR 9.90
  - Billing period: Monthly
  - Trial: 7 days
  - Copy Price ID → `NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID`
- **Annual Price** (Optional):
  - Amount: EUR 79.00
  - Billing period: Yearly
  - Copy Price ID → `NEXT_PUBLIC_STRIPE_PLUS_ANNUAL_PRICE_ID`

#### Product 2: Featured Boost (One-time)
- Name: "Seasoners Featured Boost"
- Description: "Featured placement for your listing"
- **7-Day Price**:
  - Amount: EUR 9.90
  - Type: One-time
  - Copy Price ID → `NEXT_PUBLIC_STRIPE_BOOST_7_PRICE_ID`
- **30-Day Price**:
  - Amount: EUR 29.90
  - Type: One-time
  - Copy Price ID → `NEXT_PUBLIC_STRIPE_BOOST_30_PRICE_ID`

### 2. Configure Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://www.seasoners.eu/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
4. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### 3. Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, test a checkout
stripe trigger checkout.session.completed
```

## Database Migration

Run Prisma migration to add new tables and fields:

```bash
# Generate migration
npx prisma migrate dev --name add_message_quotas_and_boosts

# Apply to production
npx prisma migrate deploy
```

The migration adds:
- `MessageUsage` table for tracking monthly quotas
- `ListingBoost` table for boost purchases
- `Listing.isFeatured` and `Listing.featuredUntil` fields
- Updated `SubscriptionTier` enum (FREE, PLUS)

## File Replacements

To activate the new monetization model, replace these files:

```bash
# Backup old files (optional)
mv utils/subscription.js utils/subscription-old.js
mv app/subscribe/page.jsx app/subscribe/page-old.jsx
mv app/api/messages/send/route.ts app/api/messages/send/route-old.ts
mv app/api/webhooks/stripe/route.ts app/api/webhooks/stripe/route-old.ts
mv app/api/subscription/create-checkout/route.ts app/api/subscription/create-checkout/route-old.ts

# Activate new files
mv utils/subscription-new.js utils/subscription.js
mv app/subscribe/page-new.jsx app/subscribe/page.jsx
mv app/api/messages/send/route-new.ts app/api/messages/send/route.ts
mv app/api/webhooks/stripe/route-new.ts app/api/webhooks/stripe/route.ts
mv app/api/subscription/create-checkout/route-new.ts app/api/subscription/create-checkout/route.ts
```

## Testing Checklist

### Free User Flow
- [ ] Register new account without credit card
- [ ] Browse stays and jobs successfully
- [ ] Send message #1 - verify counter shows "1/10 used"
- [ ] Send messages #2-10 - counter increments correctly
- [ ] Attempt message #11 - blocked with upgrade prompt
- [ ] Upgrade prompt links to pricing page

### Plus Subscription Flow
- [ ] Click "Upgrade to Plus" on pricing page
- [ ] Stripe Checkout opens with 7-day trial
- [ ] Complete payment with test card `4242424242424242`
- [ ] Redirected to success page
- [ ] User record shows `subscriptionTier: PLUS`, `subscriptionStatus: ACTIVE`
- [ ] Message quota UI shows "Unlimited" instead of counter
- [ ] Can send unlimited messages successfully
- [ ] Cancel subscription in Stripe Dashboard
- [ ] Webhook updates user to FREE tier at period end

### Boost Purchase Flow
- [ ] Create a listing (stay or job)
- [ ] Click "Boost This Listing" button
- [ ] Select 7-day or 30-day boost
- [ ] Stripe Checkout opens (one-time payment)
- [ ] Complete payment
- [ ] Listing shows `isFeatured: true` and `featuredUntil: [date]`
- [ ] Listing appears at top of search results
- [ ] After expiry, listing returns to normal position

### Webhook Verification
- [ ] Test each webhook event type
- [ ] Check server logs for "✅ Stripe webhook received"
- [ ] Verify signature validation working
- [ ] Confirm database updates for each event type

## Monitoring & Admin

### Check User Subscription Status
```javascript
// In Prisma Studio or API
await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  select: {
    subscriptionTier: true,
    subscriptionStatus: true,
    subscriptionExpiresAt: true,
    stripeCustomerId: true,
    stripeSubscriptionId: true,
  },
});
```

### Check Message Quota Usage
```javascript
const periodStart = new Date(Date.UTC(2026, 0, 1)); // Jan 1, 2026
await prisma.messageUsage.findUnique({
  where: {
    userId_periodStart: {
      userId: 'user_id',
      periodStart: periodStart,
    },
  },
});
```

### Check Active Boosts
```javascript
await prisma.listing.findMany({
  where: {
    isFeatured: true,
    featuredUntil: { gt: new Date() },
  },
  include: {
    boosts: true,
  },
});
```

## Troubleshooting

### "Upgrade required to send messages" error for Plus users
- Check `user.subscriptionStatus === 'ACTIVE'`
- Check `user.subscriptionTier === 'PLUS'`
- Check `user.subscriptionExpiresAt > now`
- Verify webhook fired correctly after subscription payment

### Boost not showing listing at top
- Verify `listing.isFeatured === true`
- Verify `listing.featuredUntil > now`
- Check listing query includes `.orderBy([{ isFeatured: 'desc' }, { featuredUntil: 'desc' }])`

### Webhook signature verification failing
- Verify `STRIPE_WEBHOOK_SECRET` matches Dashboard value
- Check webhook endpoint URL is correct
- Ensure raw request body is passed to `stripe.webhooks.constructEvent()`

### User stuck in PAST_DUE status
- Check Stripe Dashboard for failed payment reason
- User will be downgraded to FREE automatically after grace period
- Manual fix: Update `subscriptionStatus` to 'CANCELLED' and `subscriptionTier` to 'FREE'

## Support

For issues:
1. Check server logs for webhook events
2. Check Stripe Dashboard logs for webhook delivery
3. Verify environment variables are set correctly
4. Test with Stripe test cards before using real payments

Test Cards:
- Success: `4242424242424242`
- Decline: `4000000000000002`
- Requires Auth: `4000002500003155`

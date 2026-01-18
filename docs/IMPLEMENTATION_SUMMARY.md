# Monetization Model Implementation Summary

## What Was Implemented

### 1. Database Schema Changes (prisma/schema.prisma)
- **Updated SubscriptionTier enum**: Changed from (FREE, SEARCHER, LISTER) to (FREE, PLUS)
- **Added to Listing model**:
  - `isFeatured` (Boolean): Whether listing has active boost
  - `featuredUntil` (DateTime): Boost expiration timestamp
  - `boosts` relation to ListingBoost table
- **New MessageUsage model**: Tracks monthly outbound message count per user
- **New ListingBoost model**: Records boost purchases with Stripe payment IDs

### 2. Core Business Logic (utils/subscription-new.js)
- **SUBSCRIPTION_PLANS**: FREE (€0) and PLUS (€9.90/month or €79/year)
- **BOOST_PLANS**: BOOST_7 (€9.90 for 7 days), BOOST_30 (€29.90 for 30 days)
- **FREE_MESSAGE_QUOTA**: Constant set to 10 messages/month
- **Functions**:
  - `hasActiveSubscription()`: Checks if user has PLUS subscription
  - `canSendMessages()`: Returns quota check with usage stats
  - `hasActiveBoost()`: Checks if listing boost is still valid
  - `getCurrentPeriodStart()`: Gets first day of current month in UTC

### 3. Message Quota Enforcement (app/api/messages/send/route-new.ts)
- Checks current month's usage from MessageUsage table
- Blocks free users at 10 messages/month
- Plus users have unlimited messages
- Returns quota info in response: `{ used, remaining, total }`
- Increments usage count on successful send

### 4. Message Quota API (app/api/messages/quota/route.ts)
- GET endpoint returning current user's quota status
- Used by UI to display message counter
- Returns: `{ tier, unlimited, quota: { total, used, remaining }, canSend }`

### 5. Boost Purchase Flow (app/api/boosts/create-checkout/route.ts)
- POST endpoint to create Stripe Checkout for boost purchase
- Validates listing ownership
- Creates one-time payment session
- Metadata includes: userId, listingId, boostType, durationDays, price

### 6. Updated Stripe Webhooks (app/api/webhooks/stripe/route-new.ts)
- **checkout.session.completed**: Handles both subscriptions and boost purchases
- **Boost handling**: Sets `isFeatured=true`, calculates `featuredUntil`, creates ListingBoost record
- **Subscription handling**: Updates user to PLUS tier with proper expiry
- **Early-bird support**: Preserved for legacy one-time payment users
- Enhanced logging with emoji indicators (✅, ❌, 🚀, etc.)

### 7. Subscription Checkout (app/api/subscription/create-checkout/route-new.ts)
- Simplified to only handle PLUS tier
- 7-day free trial included
- No card required for free plan (only for Plus upgrade)

### 8. New Pricing Page (app/subscribe/page-new.jsx)
- Three sections: Free, Searcher Plus, Boosts
- Clear disclaimer: "Seasoners does not process rent or wage payments"
- Feature comparison with checkmarks
- FAQ section with common questions
- Responsive design with smooth animations

### 9. UI Components
- **MessageQuotaIndicator.jsx**: Shows "X/10 messages used" with progress bar
  - Green when quota healthy
  - Amber when near limit (≤2 remaining)
  - Red when at limit with upgrade CTA
- **ListingBoostButton.jsx**: Boost purchase interface for listing owners
  - Shows active boost status if present
  - 7-day vs 30-day options
  - Confirmation modal before purchase

### 10. Documentation
- **MONETIZATION_SETUP.md**: Complete setup guide with:
  - Stripe product/price creation steps
  - Environment variable configuration
  - Webhook setup instructions
  - Testing checklist
  - Troubleshooting guide
- **Migration SQL**: Ready-to-run database migration script

## Key Features

### For Free Users
✅ Browse all listings without restrictions  
✅ Create profile and verify identity  
✅ Send 10 outbound messages per month  
✅ 1 saved search  
✅ No credit card required  
❌ No instant alerts  

### For Plus Subscribers (€9.90/month)
✅ All free features  
✅ Unlimited outbound messages  
✅ Unlimited saved searches  
✅ Instant email alerts  
✅ Priority message indicator (UI only)  
✅ 7-day free trial  

### For Listing Owners
✅ Create listings completely free  
✅ Post jobs completely free  
✅ Optional 7-day boost (€9.90)  
✅ Optional 30-day boost (€29.90)  
✅ Featured listings appear at top of search results  

## What's Preserved

- **Early-bird users**: Kept lifetime access (isEarlyBird flag)
- **Existing subscriptions**: Mapped SEARCHER/LISTER → PLUS
- **All user data**: No data loss during migration
- **Existing Stripe integrations**: Compatible with current setup

## Activation Checklist

Before going live:

1. **Run Database Migration**
   ```bash
   npx prisma migrate dev --name add_message_quotas_and_boosts
   ```

2. **Create Stripe Products**
   - Searcher Plus Monthly (€9.90)
   - Searcher Plus Annual (€79.00) - optional
   - Featured Boost 7-Day (€9.90)
   - Featured Boost 30-Day (€29.90)

3. **Configure Environment Variables**
   - `NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PLUS_ANNUAL_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_BOOST_7_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_BOOST_30_PRICE_ID`

4. **Set Up Webhook**
   - Add endpoint: `https://www.seasoners.eu/api/webhooks/stripe`
   - Select required events (see docs)
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

5. **Replace Files**
   ```bash
   # Backup old versions
   mv utils/subscription.js utils/subscription-old.js
   mv app/subscribe/page.jsx app/subscribe/page-old.jsx
   mv app/api/messages/send/route.ts app/api/messages/send/route-old.ts
   mv app/api/webhooks/stripe/route.ts app/api/webhooks/stripe/route-old.ts
   mv app/api/subscription/create-checkout/route.ts app/api/subscription/create-checkout/route-old.ts
   
   # Activate new versions
   mv utils/subscription-new.js utils/subscription.js
   mv app/subscribe/page-new.jsx app/subscribe/page.jsx
   mv app/api/messages/send/route-new.ts app/api/messages/send/route.ts
   mv app/api/webhooks/stripe/route-new.ts app/api/webhooks/stripe/route.ts
   mv app/api/subscription/create-checkout/route-new.ts app/api/subscription/create-checkout/route.ts
   ```

6. **Test Everything**
   - Free user message quota enforcement
   - Plus subscription upgrade flow
   - Boost purchase and activation
   - Webhook processing
   - UI indicators

7. **Deploy**
   - Push to GitHub
   - Verify Vercel deployment
   - Test on production with Stripe test mode
   - Switch to live mode when ready

## Technical Notes

- **Message counting**: Uses UTC month boundaries for consistency
- **Boost sorting**: ORDER BY isFeatured DESC, featuredUntil DESC, createdAt DESC
- **Quota resets**: Automatic on first day of each month
- **Trial period**: 7 days, no card required (configured in Stripe)
- **Cancellation**: User reverts to FREE at subscription period end
- **Webhook security**: Signature verification on all webhook events

## Support & Maintenance

### Common Admin Tasks

**Check user's message usage:**
```javascript
const usage = await prisma.messageUsage.findUnique({
  where: {
    userId_periodStart: {
      userId: 'user_id',
      periodStart: new Date(Date.UTC(2026, 0, 1)),
    },
  },
});
```

**Reset quota manually (if needed):**
```javascript
await prisma.messageUsage.update({
  where: {
    userId_periodStart: {
      userId: 'user_id',
      periodStart: getCurrentPeriodStart(),
    },
  },
  data: { sentCount: 0 },
});
```

**Manually activate boost:**
```javascript
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

await prisma.listing.update({
  where: { id: 'listing_id' },
  data: {
    isFeatured: true,
    featuredUntil: expiresAt,
  },
});
```

## Files Created/Modified

### New Files
- `utils/subscription-new.js`
- `app/api/messages/send/route-new.ts`
- `app/api/messages/quota/route.ts`
- `app/api/boosts/create-checkout/route.ts`
- `app/api/webhooks/stripe/route-new.ts`
- `app/api/subscription/create-checkout/route-new.ts`
- `app/subscribe/page-new.jsx`
- `components/MessageQuotaIndicator.jsx`
- `components/ListingBoostButton.jsx`
- `docs/MONETIZATION_SETUP.md`
- `prisma/migrations/add_message_quotas_and_boosts.sql`

### Modified Files
- `prisma/schema.prisma` (SubscriptionTier enum, Listing model)

### Files To Replace (when activating)
- `utils/subscription.js` ← `subscription-new.js`
- `app/subscribe/page.jsx` ← `page-new.jsx`
- `app/api/messages/send/route.ts` ← `route-new.ts`
- `app/api/webhooks/stripe/route.ts` ← `route-new.ts`
- `app/api/subscription/create-checkout/route.ts` ← `route-new.ts`

## Rollback Plan

If issues arise:

1. Revert file replacements (use `-old` backups)
2. Keep database tables (MessageUsage, ListingBoost) for data preservation
3. Users with PLUS tier will continue working (backward compatible)
4. Stripe webhooks will still process (old code handles subscriptions)

## Success Metrics

Track these after launch:

- Free-to-Plus conversion rate
- Average messages sent per free user
- Boost purchase rate among listing owners
- Subscription retention rate
- Revenue: (Plus subscribers × €9.90) + (Boost purchases)

## Contact

For technical issues with this implementation:
- Check server logs for webhook events
- Review Stripe Dashboard for payment status
- Verify environment variables are set correctly
- Test locally with Stripe CLI before production deployment

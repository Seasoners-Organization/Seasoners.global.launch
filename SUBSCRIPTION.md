# Subscription System

## Overview
Seasoners uses a tiered subscription model to monetize platform access:

- **FREE**: Browse jobs and stays (default for all users)
- **SEARCHER**: €7/month - Contact sellers and employers
- **LISTER**: €12/month - Create unlimited listings + all Searcher features

## Implementation

### Database Schema
The `User` model includes subscription fields:
- `subscriptionTier`: FREE | SEARCHER | LISTER
- `subscriptionStatus`: ACTIVE | CANCELLED | EXPIRED | PAST_DUE
- `subscriptionExpiresAt`: DateTime (null for FREE tier)
- `stripeCustomerId`: Stripe customer ID (for payment integration)
- `stripeSubscriptionId`: Stripe subscription ID

### Access Control

**Listing Creation** (`/list`)
- Requires: `LISTER` subscription
- Gating: Form submission blocked, shows upgrade prompt
- API check: `/api/listings` POST validates subscription

**Contact Sellers** (`/stays`, `/jobs`)
- Requires: `SEARCHER` or `LISTER` subscription
- Gating: Contact button triggers subscription gate
- Future: Will enable direct messaging when implemented

### User Flow

1. **Unauthenticated**: Browse freely
2. **Free User**: Can browse, prompted to upgrade on contact/list actions
3. **Searcher**: Can browse + contact sellers
4. **Lister**: Full access - browse, contact, create listings

### Subscription Pages

**`/subscribe`**
- Displays two plan options (Searcher/Lister)
- Pricing cards with feature comparisons
- CTA buttons to initiate checkout
- Handles return URLs for post-upgrade redirect

**Navbar Indicator**
- Shows current subscription tier
- "⭐ Upgrade" for free users
- "✓ Searcher" for searcher tier
- "👑 Lister" for lister tier
- Links to `/subscribe` page

### API Routes

**`/api/user/me`** (GET)
- Returns current user with subscription details
- Used by client to check subscription status
- Dynamic route (not statically generated)

**`/api/subscription/create-checkout`** (POST)
- Accepts: `{ tier, returnUrl }`
- Creates Stripe checkout session (placeholder for now)
- Returns: `{ checkoutUrl }` or error

**`/api/listings`** (POST)
- Validates user has LISTER tier before creating listing
- Returns 403 if subscription insufficient

### Utilities

**`utils/subscription.js`**
- `SUBSCRIPTION_PLANS`: Pricing and features definitions
- `hasActiveSubscription(user)`: Check if subscription active
- `canContactSellers(user)`: SEARCHER or LISTER with active sub
- `canCreateListings(user)`: LISTER with active sub
- `getPlanByTier(tier)`: Get plan details
- Helper functions for status/expiry formatting

### Components

**`SubscriptionGate.jsx`**
- Modal overlay shown when access denied
- Props:
  - `isOpen`: boolean
  - `onClose`: callback
  - `requiredTier`: 'SEARCHER' | 'LISTER'
  - `action`: description (e.g., "contact sellers")
  - `onUpgrade`: callback with tier parameter
- Displays plan features and pricing
- CTA button to upgrade

## Payment Integration

### Current State
The system is **scaffold-ready** but Stripe is not yet configured.

### To Enable Stripe

1. Install Stripe SDK:
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. Add environment variables to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_STRIPE_SEARCHER_PRICE_ID=price_...
   NEXT_PUBLIC_STRIPE_LISTER_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. Uncomment Stripe integration in:
   - `/api/subscription/create-checkout/route.ts`

4. Create webhook handler at:
   - `/api/subscription/webhook/route.ts`
   - Handle events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

5. Update user subscription status on webhook events:
   ```typescript
   await prisma.user.update({
     where: { stripeCustomerId },
     data: {
       subscriptionTier,
       subscriptionStatus: 'ACTIVE',
       subscriptionExpiresAt: new Date(periodEnd * 1000),
       stripeSubscriptionId: subscription.id,
     },
   });
   ```

### Stripe Dashboard Setup

1. Create two products in Stripe:
   - **Searcher**: €7/month recurring
   - **Lister**: €12/month recurring

2. Copy price IDs to environment variables

3. Configure webhook endpoint:
   - URL: `https://yourdomain.com/api/subscription/webhook`
   - Events: All subscription events

4. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/subscription/webhook
   ```

## Testing (Without Stripe)

Users default to FREE tier. To manually upgrade for testing:

```javascript
// In Prisma Studio or migration
await prisma.user.update({
  where: { email: 'test@example.com' },
  data: {
    subscriptionTier: 'LISTER',
    subscriptionStatus: 'ACTIVE',
    subscriptionExpiresAt: new Date('2026-01-01'),
  },
});
```

## Future Enhancements

- [ ] Trial period (7 days free)
- [ ] Proration for tier upgrades
- [ ] Annual billing option (discount)
- [ ] Team/company accounts (multi-user)
- [ ] Usage analytics (listings created, contacts made)
- [ ] Subscription management page (cancel, update card)
- [ ] Email notifications (renewal, expiration, payment failed)
- [ ] Dunning (retry failed payments)
- [ ] Regional pricing adjustments

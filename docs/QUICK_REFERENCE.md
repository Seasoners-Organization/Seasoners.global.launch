# Monetization Model Quick Reference

## Pricing At A Glance

| Tier | Price | Messages | Saved Searches | Alerts | Listing Creation |
|------|-------|----------|----------------|--------|------------------|
| **Free** | €0 | 10/month | 1 | No | Free |
| **Plus** | €9.90/mo | Unlimited | Unlimited | Instant | Free |

| Boost | Price | Duration |
|-------|-------|----------|
| **Featured 7** | €9.90 | 7 days |
| **Featured 30** | €29.90 | 30 days |

## Key Environment Variables

```bash
NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_BOOST_7_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_BOOST_30_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## API Endpoints

### Message Quota
- **GET** `/api/messages/quota` - Get current quota status
- **POST** `/api/messages/send` - Send message (enforces quota)

### Subscriptions
- **POST** `/api/subscription/create-checkout` - Create Plus checkout
- **POST** `/api/subscription/cancel` - Cancel subscription

### Boosts
- **POST** `/api/boosts/create-checkout` - Create boost checkout

### Webhooks
- **POST** `/api/webhooks/stripe` - Stripe webhook handler

## Database Queries

### Check User Quota
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

### Check Active Boosts
```javascript
const featuredListings = await prisma.listing.findMany({
  where: {
    isFeatured: true,
    featuredUntil: { gt: new Date() },
  },
  orderBy: [
    { isFeatured: 'desc' },
    { featuredUntil: 'desc' },
  ],
});
```

### Update User Subscription
```javascript
await prisma.user.update({
  where: { id: 'user_id' },
  data: {
    subscriptionTier: 'PLUS',
    subscriptionStatus: 'ACTIVE',
    subscriptionExpiresAt: new Date('2026-02-01'),
  },
});
```

## Feature Flags

### Check Subscription Status
```javascript
import { hasActiveSubscription, canSendMessages } from '@/utils/subscription';

const isSubscribed = hasActiveSubscription(user);
const { allowed, remaining } = canSendMessages(user, currentUsage);
```

### Check Boost Status
```javascript
import { hasActiveBoost } from '@/utils/subscription';

const isBoosted = hasActiveBoost(listing);
```

## UI Components

### Message Quota Indicator
```jsx
import MessageQuotaIndicator from '@/components/MessageQuotaIndicator';

<MessageQuotaIndicator />
```

### Boost Purchase Button
```jsx
import ListingBoostButton from '@/components/ListingBoostButton';

<ListingBoostButton 
  listingId={listing.id} 
  currentBoost={listing.boosts[0]} 
/>
```

## Testing Stripe Events

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger payment_intent.succeeded
```

## Test Cards

| Card Number | Result |
|-------------|--------|
| 4242424242424242 | Success |
| 4000000000000002 | Decline |
| 4000002500003155 | Requires Auth |

## Common Issues

### "Upgrade required" for Plus users
- Check `subscriptionStatus === 'ACTIVE'`
- Check `subscriptionTier === 'PLUS'`
- Check `subscriptionExpiresAt > now`

### Boost not appearing
- Verify `isFeatured === true`
- Verify `featuredUntil > now`
- Check listing query orderBy

### Webhook failing
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check raw body is passed to verification
- Review Stripe Dashboard webhook logs

## Rollback

If needed, restore backups:
```bash
# Backups are in backups/pre-monetization-YYYYMMDD-HHMMSS/
cp backups/pre-monetization-*/subscription.js utils/subscription.js
# ... restore other files
```

## Support Contacts

- Stripe Dashboard: https://dashboard.stripe.com
- Documentation: docs/MONETIZATION_SETUP.md
- Implementation: docs/IMPLEMENTATION_SUMMARY.md

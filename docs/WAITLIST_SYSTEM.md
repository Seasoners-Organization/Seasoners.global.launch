# Waitlist & Early-Bird Launch System

## Overview
The waitlist system allows you to collect early signups with discounted pricing (€5/month for both tiers) before launching the full platform. Site access is gated until you manually enable launch.

## Architecture

### Database Models

**LaunchSettings** (singleton configuration)
- `isLaunched`: Boolean - Controls whether the site is publicly accessible
- `earlyBirdActive`: Boolean - Controls whether new signups get early-bird pricing
- `earlyBirdPrice`: €5/month for both tiers
- `regularSearcherPrice`: €7/month 
- `regularListerPrice`: €12/month
- `launchDate`: Timestamp when site was launched
- `updatedBy`: Admin user ID who made changes

**User** (extended fields)
- `isEarlyBird`: Boolean - Marks users who signed up during early-bird period
- `earlyBirdSignupDate`: Timestamp of early-bird signup
- `waitlistStatus`: String - "pending" | "active" (active = subscription confirmed)

### Routes

**Public Routes**
- `/waitlist` - Pre-launch landing page with pricing cards and signup
- `/api/webhooks/stripe` - Handles subscription confirmations

**Protected Routes (Admin Only)**
- `/admin/launch` - Dashboard to control launch settings
- `/api/admin/launch-settings` - GET/PATCH endpoint for launch configuration

**Gated Routes**
- All routes except waitlist, auth, API, and static assets are gated when `isLaunched = false`
- Early-bird users with `waitlistStatus = 'active'` can access during pre-launch

### Middleware Flow

```
Request → Check if path is exempt (waitlist, auth, API, static)
        ↓
        Check LaunchSettings.isLaunched
        ↓
        If NOT launched → Check user.isEarlyBird && user.waitlistStatus = 'active'
        ↓
        If not early-bird → Redirect to /waitlist
        ↓
        If launched OR early-bird active → Allow access
```

## Setup Instructions

### 1. Stripe Configuration

**Important:** The Price IDs you provided are PRODUCT IDs (prod_...), not PRICE IDs (price_...). You need to create PRICE entities in Stripe.

#### Create Prices in Stripe Dashboard

1. **Early-Bird Price** (€5/month - both tiers)
   - Navigate to: https://dashboard.stripe.com/prices
   - Click "Add a price"
   - Choose "Recurring" 
   - Amount: €5.00
   - Billing period: Monthly
   - Copy the price ID (starts with `price_...`)
   - Add to `.env`: `STRIPE_EARLY_BIRD_PRICE_ID=price_xxxxx`

2. **Regular Searcher Price** (€7/month)
   - Create recurring price: €7.00/month
   - Copy price ID
   - Replace in `.env`: `STRIPE_SEARCHER_PRICE_ID=price_xxxxx`

3. **Regular Lister Price** (€12/month)
   - Create recurring price: €12.00/month
   - Copy price ID
   - Replace in `.env`: `STRIPE_LISTER_PRICE_ID=price_xxxxx`

#### Configure Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret (starts with `whsec_...`)
6. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

### 2. Environment Variables

Required in `.env`:
```bash
STRIPE_SECRET_KEY=sk_live_...           # ✅ Already set
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # ✅ Already set
STRIPE_EARLY_BIRD_PRICE_ID=price_...    # ❌ Need to create in Stripe
STRIPE_SEARCHER_PRICE_ID=price_...      # ⚠️  Currently using prod_... (needs correction)
STRIPE_LISTER_PRICE_ID=price_...        # ⚠️  Currently using prod_... (needs correction)
STRIPE_WEBHOOK_SECRET=whsec_...         # ❌ Need from Stripe webhook setup
```

### 3. Database Initialization

The launch settings have been initialized:
```bash
✅ LaunchSettings created:
  - isLaunched: false (pre-launch mode)
  - earlyBirdActive: true (early-bird pricing enabled)
  - earlyBirdPrice: €5
```

To verify or re-initialize:
```bash
node scripts/init-launch-settings.js
```

## Usage

### For Pre-Launch Phase

1. **Users visit `/waitlist`**
   - See early-bird offer: €5/month for both tiers
   - Choose Searcher or Lister plan
   - Sign in via email (magic link)
   - Redirected to Stripe checkout

2. **User completes payment**
   - Stripe webhook triggers `/api/webhooks/stripe`
   - User record updated:
     - `subscriptionTier`: SEARCHER or LISTER
     - `subscriptionStatus`: ACTIVE
     - `isEarlyBird`: true
     - `earlyBirdSignupDate`: now
     - `waitlistStatus`: active
   - User can now access full platform

3. **Middleware gates non-early-bird users**
   - All routes redirect to `/waitlist` during pre-launch
   - Exception: Users with `isEarlyBird=true` and `waitlistStatus='active'`

### Admin Controls

Visit `/admin/launch` to:

**Site Launch Toggle**
- Toggle `isLaunched` between true/false
- When `true`: ALL users can access platform
- When `false`: Only early-bird active users can access
- Shows status badge: 🚀 LAUNCHED or ⏳ PRE-LAUNCH

**Early-Bird Pricing Toggle**
- Toggle `earlyBirdActive` between true/false  
- When `true`: New signups get €5/month rate
- When `false`: New signups get regular pricing (€7/€12)
- **Note:** Existing early-bird users keep €5 rate forever

**Statistics Dashboard**
- Early-Bird Members count
- Total Subscribers count
- Pending Waitlist count

### Launch Day Checklist

1. ✅ All Stripe prices created and configured
2. ✅ Webhook endpoint verified and working
3. ✅ Test early-bird signup flow end-to-end
4. ✅ Verify early-bird users can access platform
5. ✅ Verify non-early-bird users redirected to waitlist
6. ✅ Review admin dashboard shows correct stats
7. 🚀 Toggle `isLaunched` to `true` in `/admin/launch`
8. ✅ Verify all users can now access platform
9. 💰 Optionally disable early-bird pricing for new signups

## User Flow Diagrams

### Pre-Launch Flow (isLaunched = false)

```
User visits any route
        ↓
    Middleware checks
        ↓
    Is path exempt? (waitlist, auth, API)
    ↓               ↓
   Yes             No
    ↓               ↓
  Allow      Check isEarlyBird
                   ↓
              Yes & Active?
              ↓         ↓
            Yes        No
             ↓          ↓
           Allow    Redirect to /waitlist
```

### Signup Flow

```
User on /waitlist
        ↓
  Chooses tier (Searcher/Lister)
        ↓
  Clicks "Join Now"
        ↓
  Not signed in? → Magic link email → Return to waitlist
        ↓
  Signed in? → Create Stripe checkout
        ↓
  Redirected to Stripe
        ↓
  User enters payment
        ↓
  Stripe processes subscription
        ↓
  Webhook → Update user record
        ↓
  User redirected back with success message
        ↓
  User can now access full platform
```

## Pricing Structure

| Plan | Early-Bird | Regular | Savings |
|------|-----------|---------|---------|
| **Searcher** | €5/mo | €7/mo | €2/mo (29% off) |
| **Lister** | €5/mo | €12/mo | €7/mo (58% off) |

**Early-Bird Benefits:**
- Locked in for lifetime of subscription
- No price increases for early adopters
- Access during pre-launch phase
- Cancel anytime

## Technical Notes

### Price ID vs Product ID

Stripe has two concepts:
- **Product**: `prod_xxxxx` - Represents what you're selling (e.g., "Searcher Plan")
- **Price**: `price_xxxxx` - Represents the cost/billing (e.g., "€7/month recurring")

A product can have multiple prices (e.g., monthly vs annual).

**Your current configuration uses product IDs but needs price IDs.**

### Early-Bird Rate Protection

Once a user has `isEarlyBird = true`, they maintain the €5/month rate even if:
- Admin disables early-bird pricing for new signups
- Site launches and regular pricing applies to new users
- Price increases are implemented later

This is guaranteed because:
1. User's Stripe subscription is created with the early-bird price ID
2. Stripe maintains the original price for the subscription
3. Database `isEarlyBird` flag is permanent

### Middleware Performance

The middleware queries the database on every request to check launch status. Consider:
- Adding caching layer (Redis) for `LaunchSettings`
- Using edge config for ultra-low latency
- Currently acceptable for launch phase due to low traffic

### Security Considerations

- Admin routes require `role = 'ADMIN'`
- Launch settings can only be modified by admins
- Webhook endpoint verifies Stripe signatures
- Early-bird status cannot be manually set by users (only via Stripe webhook)

## Troubleshooting

### Users can't access after payment

1. Check webhook is receiving events: https://dashboard.stripe.com/webhooks
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Check user record in database:
   - `isEarlyBird` should be `true`
   - `waitlistStatus` should be `'active'`
   - `subscriptionStatus` should be `'ACTIVE'`

### Checkout failing

1. Verify price IDs in `.env` are correct (start with `price_` not `prod_`)
2. Check Stripe dashboard for failed payments
3. Verify publishable key matches secret key (both live or both test)

### All users redirected to waitlist

1. Check `LaunchSettings.isLaunched` in database
2. If `false`, only early-bird users can access
3. Set to `true` in `/admin/launch` to open to all users

### Early-bird pricing not applying

1. Check `LaunchSettings.earlyBirdActive` is `true`
2. Verify `STRIPE_EARLY_BIRD_PRICE_ID` is set in `.env`
3. Ensure price ID is for €5/month recurring

## Files Modified/Created

### New Files
- `/app/waitlist/page.jsx` - Pre-launch landing page
- `/app/admin/launch/page.jsx` - Admin launch control dashboard
- `/app/api/admin/launch-settings/route.ts` - Launch settings API
- `/scripts/init-launch-settings.js` - Database initialization
- `/docs/WAITLIST_SYSTEM.md` - This documentation

### Modified Files
- `/prisma/schema.prisma` - Added LaunchSettings model, User early-bird fields
- `/middleware.js` - Added launch gate logic
- `/app/api/subscription/create-checkout/route.ts` - Early-bird pricing logic
- `/app/api/webhooks/stripe/route.ts` - Mark users as early-bird on payment
- `/.env` - Added STRIPE_EARLY_BIRD_PRICE_ID

### Dependencies Added
- `lucide-react` - Icons for waitlist page

## Next Steps

1. **Create Stripe Prices** ⚠️ CRITICAL
   - Create three price entities (early-bird, searcher, lister)
   - Update `.env` with correct price IDs
   
2. **Configure Webhook** ⚠️ CRITICAL
   - Set up webhook endpoint in Stripe dashboard
   - Add webhook secret to `.env`
   
3. **Test Signup Flow**
   - Sign up as Searcher with early-bird pricing
   - Verify access during pre-launch
   - Test payment failure handling
   
4. **Launch Preparation**
   - Create marketing materials for early-bird offer
   - Set up email campaigns for waitlist signups
   - Prepare announcement for official launch
   
5. **Post-Launch**
   - Monitor webhook events and subscription activations
   - Track early-bird conversion rates
   - Decide when to disable early-bird pricing for new signups

## Support

For Stripe-related questions: https://support.stripe.com
For Next.js middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
For Prisma: https://www.prisma.io/docs

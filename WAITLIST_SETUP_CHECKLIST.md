# Waitlist & Early-Bird System - Setup Checklist

## ✅ Completed

- [x] Database schema updated with LaunchSettings model
- [x] Database schema updated with User early-bird fields (isEarlyBird, earlyBirdSignupDate, waitlistStatus)
- [x] Database migrated successfully
- [x] LaunchSettings initialized (isLaunched: false, earlyBirdActive: true)
- [x] Waitlist landing page created at `/waitlist`
- [x] Admin launch control dashboard created at `/admin/launch`
- [x] Launch settings API endpoint created (`/api/admin/launch-settings`)
- [x] Middleware updated to gate access based on launch status
- [x] Subscription checkout updated to handle early-bird pricing
- [x] Webhook handler updated to mark users as early-bird
- [x] Icons library installed (lucide-react)
- [x] Initialization script created
- [x] Documentation written (WAITLIST_SYSTEM.md)
- [x] Build verified successful

## ⚠️ CRITICAL - Action Required

### 1. Fix Stripe Price IDs

**Current Issue:** You provided PRODUCT IDs (prod_...) but Stripe checkout requires PRICE IDs (price_...).

**Steps to Fix:**
1. Go to Stripe Dashboard: https://dashboard.stripe.com/prices
2. Create THREE recurring prices:
   
   **a) Early-Bird Price** (€5/month for both tiers)
   - Click "Add a price"
   - Select "Recurring"
   - Amount: €5.00 EUR
   - Billing: Monthly
   - Copy the price ID (starts with `price_...`)
   - Update `.env`: `STRIPE_EARLY_BIRD_PRICE_ID=price_xxxxx`
   
   **b) Regular Searcher Price** (€7/month)
   - Create recurring price: €7.00 EUR / Monthly
   - Copy price ID
   - Update `.env`: `STRIPE_SEARCHER_PRICE_ID=price_xxxxx`
   
   **c) Regular Lister Price** (€12/month)
   - Create recurring price: €12.00 EUR / Monthly
   - Copy price ID
   - Update `.env`: `STRIPE_LISTER_PRICE_ID=price_xxxxx`

**Current .env values (INCORRECT):**
```
STRIPE_SEARCHER_PRICE_ID=prod_TP1QMXyIJOOlnb  ❌ This is a product ID
STRIPE_LISTER_PRICE_ID=prod_TP1RDOYiGIuMRe    ❌ This is a product ID
STRIPE_EARLY_BIRD_PRICE_ID=                   ❌ Empty
```

**Should be:**
```
STRIPE_SEARCHER_PRICE_ID=price_xxxxxxxxxxxxx  ✅ Price ID for €7/month
STRIPE_LISTER_PRICE_ID=price_xxxxxxxxxxxxx    ✅ Price ID for €12/month
STRIPE_EARLY_BIRD_PRICE_ID=price_xxxxxxxxxxxxx ✅ Price ID for €5/month
```

### 2. Configure Stripe Webhook

**Steps:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - For testing: Use ngrok or Stripe CLI
   - For production: Your live domain
4. Select these events:
   - ✅ checkout.session.completed
   - ✅ customer.subscription.created
   - ✅ customer.subscription.updated
   - ✅ customer.subscription.deleted
   - ✅ invoice.payment_succeeded
   - ✅ invoice.payment_failed
5. Save and copy the webhook signing secret (starts with `whsec_...`)
6. Update `.env`: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

**Current .env value:**
```
STRIPE_WEBHOOK_SECRET=  ❌ Empty
```

## 🧪 Testing Checklist

Once Stripe is configured:

### Test Pre-Launch Flow
- [ ] Visit homepage → should redirect to `/waitlist`
- [ ] Visit `/waitlist` → should see early-bird pricing cards
- [ ] Click "Join as Searcher" → should sign in or create checkout
- [ ] Complete Stripe payment → should activate subscription
- [ ] Check database → user should have `isEarlyBird: true`, `waitlistStatus: 'active'`
- [ ] Visit homepage again → should NOT redirect (early-bird access granted)

### Test Admin Controls
- [ ] Visit `/admin/launch` as admin → should see dashboard
- [ ] Check statistics → should show correct counts
- [ ] Toggle "Launch Site" → should update `isLaunched`
- [ ] After launch, non-early-bird users should access site
- [ ] Toggle "Early-Bird Pricing" → should update `earlyBirdActive`
- [ ] After disabling, new signups should use regular pricing

### Test Webhook Events
- [ ] Create subscription → webhook should receive `checkout.session.completed`
- [ ] User record updated with subscription details
- [ ] Cancel subscription → webhook should receive `customer.subscription.deleted`
- [ ] Payment fails → webhook should receive `invoice.payment_failed`
- [ ] Check Stripe dashboard webhook logs for errors

## 📋 Launch Day Checklist

### Pre-Launch (Current State)
- [ ] Create Stripe price IDs (early-bird, searcher, lister)
- [ ] Configure webhook endpoint
- [ ] Test full signup flow end-to-end
- [ ] Verify early-bird users can access platform
- [ ] Verify non-early-bird users redirected to waitlist
- [ ] Marketing materials prepared
- [ ] Email campaign ready for waitlist signups

### Launch Day
- [ ] Final test of all flows
- [ ] Admin dashboard shows correct statistics
- [ ] Go to `/admin/launch` as admin
- [ ] Toggle "Launch Site" to enable public access
- [ ] Verify all users can now access platform
- [ ] Monitor webhook events and subscription activations
- [ ] Send launch announcement emails

### Post-Launch
- [ ] Monitor early-bird conversion rates
- [ ] Track subscription activations
- [ ] Decide when to disable early-bird pricing for new signups
- [ ] Update marketing materials to reflect regular pricing

## 🔧 Quick Commands

```bash
# Initialize/verify launch settings
node scripts/init-launch-settings.js

# Regenerate Prisma client (after schema changes)
npx prisma generate

# Run migrations
npx prisma migrate dev

# Build and verify
npm run build

# Start development server
npm run dev

# Check database
npx prisma studio
```

## 📁 Key Files

### Configuration
- `/.env` - Stripe keys and price IDs ⚠️ NEEDS UPDATING
- `/prisma/schema.prisma` - Database models
- `/middleware.js` - Launch gate logic

### Pages
- `/app/waitlist/page.jsx` - Pre-launch landing page
- `/app/admin/launch/page.jsx` - Admin dashboard

### API Routes
- `/app/api/subscription/create-checkout/route.ts` - Stripe checkout
- `/app/api/webhooks/stripe/route.ts` - Subscription events
- `/app/api/admin/launch-settings/route.ts` - Launch controls

### Documentation
- `/docs/WAITLIST_SYSTEM.md` - Complete system documentation

## 🆘 Common Issues

**Issue:** Checkout fails with "Invalid price ID"
- **Solution:** Update `.env` with price IDs (not product IDs)

**Issue:** Webhook not receiving events
- **Solution:** Verify endpoint URL and webhook secret in Stripe dashboard

**Issue:** Users redirected to waitlist after payment
- **Solution:** Check webhook is processing successfully, verify user has `isEarlyBird: true` and `waitlistStatus: 'active'`

**Issue:** Admin can't access `/admin/launch`
- **Solution:** Ensure your user has `role: 'ADMIN'` in database

**Issue:** Site still in pre-launch mode
- **Solution:** Toggle launch in `/admin/launch` or manually update `LaunchSettings.isLaunched` to `true`

## 📞 Support Resources

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

---

**STATUS:** System fully implemented and ready for Stripe configuration.

**NEXT ACTION:** Create price IDs in Stripe dashboard and update `.env` file.

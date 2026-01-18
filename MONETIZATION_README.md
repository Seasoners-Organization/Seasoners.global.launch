# Monetization Model Update (January 2026)

## 🎉 New Freemium Pricing Model

Seasoners now uses a transparent freemium model designed to maximize platform growth while maintaining sustainability.

### What Changed

**Before:**
- Subscription required for any messaging
- SEARCHER (€7/mo) vs LISTER (€12/mo) tiers
- 90-day free trial with card required

**After:**
- **FREE forever** with 10 messages/month (no card)
- **Plus** (€9.90/mo) for unlimited messages with 7-day trial
- **Listing creation is completely free**
- **Optional boosts** for visibility (€9.90/7 days, €29.90/30 days)

### Quick Start

1. **Review the implementation:**
   - [Setup Guide](docs/MONETIZATION_SETUP.md) - Complete Stripe setup instructions
   - [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md) - Technical details
   - [Quick Reference](docs/QUICK_REFERENCE.md) - Commands and queries

2. **Activate when ready:**
   ```bash
   ./scripts/activate-monetization.sh
   ```

3. **Configure Stripe:**
   - Create products/prices in Stripe Dashboard
   - Add price IDs to environment variables
   - Set up webhook endpoint

### Key Features

✅ **Message Quota System**
- Free users: 10 outbound messages/month
- Plus users: Unlimited messages
- Server-side enforcement with UI indicators

✅ **Boost System**
- Optional featured placement for listings/jobs
- 7-day (€9.90) or 30-day (€29.90) options
- Listings/jobs creation remains free

✅ **Simplified Subscription**
- Single Plus tier (€9.90/month or €79/year)
- 7-day free trial without card
- Cancel anytime

### Files Added

**Core Logic:**
- `utils/subscription-new.js` - Business logic and constants
- `app/api/messages/quota/route.ts` - Quota status endpoint
- `app/api/boosts/create-checkout/route.ts` - Boost purchase flow

**Updated Files:**
- `app/api/messages/send/route-new.ts` - Quota enforcement
- `app/api/webhooks/stripe/route-new.ts` - Boost & subscription webhooks
- `app/api/subscription/create-checkout/route-new.ts` - Simplified checkout
- `app/subscribe/page-new.jsx` - New pricing page

**UI Components:**
- `components/MessageQuotaIndicator.jsx` - Shows "X/10 messages used"
- `components/ListingBoostButton.jsx` - Boost purchase interface

**Database:**
- `prisma/schema.prisma` - Updated with MessageUsage and ListingBoost models
- `prisma/migrations/add_message_quotas_and_boosts.sql` - Migration script

**Documentation:**
- `docs/MONETIZATION_SETUP.md` - Complete setup guide
- `docs/IMPLEMENTATION_SUMMARY.md` - Technical overview
- `docs/QUICK_REFERENCE.md` - Quick commands and queries
- `scripts/activate-monetization.sh` - One-command activation

### Important Notes

⚠️ **Files are staged but not active yet**
- All new files end with `-new.js/ts/jsx`
- Run activation script to swap them in
- Old files backed up automatically

⚠️ **Stripe configuration required**
- Create 4 price IDs in Stripe Dashboard
- Add to environment variables
- Configure webhook endpoint

⚠️ **Database migration required**
- Run `npx prisma migrate dev` before activating
- Adds MessageUsage and ListingBoost tables
- Safe to run on existing data

### Testing

Before deployment:
1. Test free user quota enforcement
2. Test Plus upgrade flow
3. Test boost purchase
4. Test webhook handling
5. Verify UI indicators

Use Stripe test mode and test cards:
- Success: `4242424242424242`
- Decline: `4000000000000002`

### Rollback

If issues occur:
```bash
# Restore from automatic backups
ls backups/pre-monetization-*/
cp backups/pre-monetization-*/subscription.js utils/subscription.js
# ... restore other files as needed
```

### Support

- **Setup Questions**: See [MONETIZATION_SETUP.md](docs/MONETIZATION_SETUP.md)
- **Technical Details**: See [IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)
- **Quick Commands**: See [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)
- **Stripe Issues**: Check Dashboard webhook logs

---

**Status**: ✅ Implementation complete, ready for activation
**Next Step**: Review docs and run `./scripts/activate-monetization.sh`

# 🚀 VERCEL & STRIPE SETUP - Quick Guide

## Part 1: Vercel Environment Variables

**Location:** Vercel Dashboard → Settings → Environment Variables  
**Environment:** Production

### 🆕 New Variables to Add (Trial System):

```bash
CRON_SECRET=AUj0Kk8JXU2hRAZ3frAzC+1/8AIgfC0yzEvBWKV2QFc=
ADMIN_SECRET=MY2G+1+3qTC3XgasR0+u5wHDcUZtJq+V7pvGghlJ9Ls=
```

### ✅ Verify These Exist (Should Already Be Set):

- `EMAIL_FROM`
- `RESEND_API_KEY`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SEARCHER_PRICE_ID`
- `STRIPE_LISTER_PRICE_ID`
- All Stripe price IDs
- Supabase credentials
- Google OAuth credentials
- reCAPTCHA keys

---

## Part 2: Stripe Configuration

### Step 1: Add 90-Day Trial to Your Prices

**Your existing Price IDs:**
- Searcher: `price_1SSDNj0shFFYeoNJScWmQQkB`
- Lister: `price_1SSDON0shFFYeoNJkDqfPAzC`
- Early Bird: `price_1SSHGZ0shFFYeoNJbCDaf6IA`

**Instructions:**
1. Go to https://dashboard.stripe.com/products
2. Find each price above
3. Click price → "⋯" menu → "Edit price"
4. Enable "Offer customers a free trial"
5. Set to **90 days**
6. Save

### Step 2: Verify Webhook

**Check:** https://dashboard.stripe.com/webhooks

**Should have:**
- Endpoint: `https://www.seasoners.eu/api/webhooks/stripe`
- Events: `customer.subscription.*`, `invoice.*`, `checkout.session.completed`
- Signing secret matches your `STRIPE_WEBHOOK_SECRET` in Vercel

### Step 3: Verify Payment Links

**Your payment links:**
- Searcher: `https://buy.stripe.com/fZudR17aPeAR5xU7my63K01`
- Lister: `https://buy.stripe.com/dRm4grdzd0K17G2dKW63K00`

**Check these have:**
- ✅ 90-day free trial enabled
- ✅ Correct pricing (€7 or €12)
- ✅ Monthly billing

---

## Part 3: Testing

### Test Trial Reminder System:
```bash
node scripts/test-trial-reminders.js --production
```

### Test Subscription Flow:
1. Go to https://www.seasoners.eu/subscribe?promo=EARLYBIRD3
2. Click "Start 3-Month Free Trial"
3. Use test card: 4242 4242 4242 4242
4. Verify trial end date is 90 days out

---

## 📊 Expected Results

- ✅ "3 MONTHS FREE" badge shows on subscribe page
- ✅ Stripe checkout displays 90-day trial
- ✅ No payment for 90 days
- ✅ Email reminders at: 60, 30, 7, 1 day before billing
- ✅ Day 91: Automatic billing begins
- ✅ Users can cancel anytime during trial

---

## 🆘 Troubleshooting

**Trial not showing:**
- Edit Price in Stripe and add 90-day trial

**Webhook errors:**
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

**Reminders not sending:**
- Check `CRON_SECRET` and `ADMIN_SECRET` in Vercel
- Check Resend dashboard for delivery logs

---

**Created:** January 4, 2026  
**Status:** Production Ready ✅

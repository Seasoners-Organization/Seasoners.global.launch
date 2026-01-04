# Stripe 3-Month Free Trial Setup Guide

## Step-by-Step Instructions for Early Bird Promotion

---

## 🎯 Overview

You'll create two subscription products with a **3-month free trial**:
- **Searcher Plan**: €7/month (free for 3 months)
- **Lister Plan**: €12/month (free for 3 months)

---

## 📋 Step 1: Create Products in Stripe Dashboard

### 1.1 Log into Stripe Dashboard
- Go to: https://dashboard.stripe.com
- Make sure you're in **Live Mode** (toggle in top right if showing "Test mode")

### 1.2 Create Searcher Product
1. Click **"Products"** in left sidebar
2. Click **"+ Add product"** button
3. Fill in:
   ```
   Name: Seasoners Searcher (Early Bird)
   Description: 3 months free, then €7/month. Contact hosts, unlimited messaging, advanced filters.
   ```
4. **Pricing:**
   - Click **"+ Add another price"** or edit the default price
   - **Billing period:** Monthly (Recurring)
   - **Price:** €7.00 EUR
   - **Currency:** EUR
5. Click **"Save product"**

### 1.3 Create Lister Product
1. Click **"+ Add product"** again
2. Fill in:
   ```
   Name: Seasoners Lister (Early Bird)
   Description: 3 months free, then €12/month. Create unlimited listings, featured badge, analytics.
   ```
3. **Pricing:**
   - **Billing period:** Monthly (Recurring)
   - **Price:** €12.00 EUR
   - **Currency:** EUR
4. Click **"Save product"**

---

## 📋 Step 2: Add Free Trial to Each Price

### 2.1 Add Trial to Searcher Price
1. Go to **Products** → Click on **"Seasoners Searcher (Early Bird)"**
2. Find the €7.00 price you created
3. Click the **"⋯"** menu → **"Edit price"**
4. Scroll to **"Free trial"** section
5. Check **"Offer customers a free trial"**
6. Enter: **90 days** (3 months)
7. Click **"Save"**

### 2.2 Add Trial to Lister Price
1. Go to **Products** → Click on **"Seasoners Lister (Early Bird)"**
2. Find the €12.00 price
3. Click **"⋯"** → **"Edit price"**
4. Check **"Offer customers a free trial"**
5. Enter: **90 days**
6. Click **"Save"**

---

## 📋 Step 3: Get Your Price IDs

### 3.1 Copy Searcher Price ID
1. Go to **Products** → **"Seasoners Searcher (Early Bird)"**
2. Click on the €7.00 price
3. Copy the **Price ID** (starts with `price_`)
   - Example: `price_1AbCdEfGhIjKlMnO`

### 3.2 Copy Lister Price ID
1. Go to **Products** → **"Seasoners Lister (Early Bird)"**
2. Click on the €12.00 price
3. Copy the **Price ID**

---

## 📋 Step 4: Update Vercel Environment Variables

### 4.1 Go to Vercel Dashboard
- URL: https://vercel.com/seasoners-projects/seasoners-starter/settings/environment-variables

### 4.2 Add/Update These Variables (Production)

**For Searcher Plan:**
```
STRIPE_EARLYBIRD_SEARCHER_PRICE_ID=price_YOUR_SEARCHER_PRICE_ID
NEXT_PUBLIC_STRIPE_EARLYBIRD_SEARCHER_PRICE_ID=price_YOUR_SEARCHER_PRICE_ID
```

**For Lister Plan:**
```
STRIPE_EARLYBIRD_LISTER_PRICE_ID=price_YOUR_LISTER_PRICE_ID
NEXT_PUBLIC_STRIPE_EARLYBIRD_LISTER_PRICE_ID=price_YOUR_LISTER_PRICE_ID
```

**Also verify these exist:**
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 4.3 Redeploy
- After adding variables, trigger a new deployment by pushing to main or clicking "Redeploy" in Vercel

---

## 📋 Step 5: Configure Stripe Webhooks (CRITICAL)

### 5.1 Create Webhook Endpoint
1. In Stripe Dashboard, go to **"Developers"** → **"Webhooks"**
2. Click **"+ Add endpoint"**
3. **Endpoint URL:** `https://www.seasoners.eu/api/webhooks/stripe`
4. **Description:** Seasoners subscription events
5. Click **"Select events"**

### 5.2 Select These Events:
```
✓ customer.subscription.created
✓ customer.subscription.updated
✓ customer.subscription.deleted
✓ customer.subscription.trial_will_end
✓ invoice.paid
✓ invoice.payment_failed
✓ checkout.session.completed
```

6. Click **"Add events"**
7. Click **"Add endpoint"**

### 5.3 Get Webhook Secret
1. After creating the endpoint, click on it
2. Click **"Reveal"** under **"Signing secret"**
3. Copy the secret (starts with `whsec_`)

### 5.4 Add Webhook Secret to Vercel
Go to Vercel environment variables and add:
```
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SIGNING_SECRET
```

---

## 📋 Step 6: Update Your Code

The code has been updated to handle the early bird promotion. The key changes:

### 6.1 Registration Flow
- Users see the Early Bird modal after viewing 2 pages
- Modal shows 3-month free trial offer
- Clicking "Claim Your 3 Months Free" redirects to `/auth/register?promo=EARLYBIRD3`

### 6.2 Subscription Selection
- The subscription page will detect the `promo=EARLYBIRD3` parameter
- It will use the Early Bird price IDs instead of regular prices
- Shows "3 MONTHS FREE" badge on pricing cards

### 6.3 Checkout Flow
- Stripe automatically handles the 90-day trial period
- No payment collected during trial
- After 90 days, automatic billing begins

---

## 📋 Step 7: Test the Complete Flow

### 7.1 Test Subscription (Use Test Mode First)
1. Switch Stripe to **Test mode**
2. Create test products with trials (same steps as above)
3. Use test price IDs in your .env.local file
4. Test card number: `4242 4242 4242 4242`
5. Verify:
   - ✓ Checkout shows "3 months free"
   - ✓ No payment collected
   - ✓ Subscription created with trial_end date 90 days away
   - ✓ User can access premium features immediately

### 7.2 Test Webhooks Locally
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Complete a test checkout
5. Verify webhook events are received and processed

### 7.3 Go Live
1. Switch Stripe to **Live mode**
2. Update Vercel with live price IDs
3. Push to main branch
4. Test with a real (but cancellable) subscription

---

## 📋 Step 8: Marketing Setup

### 8.1 Homepage Banner
The Early Bird modal will automatically show:
- After user views their 2nd page on the site
- When user clicks on subscription/payment pages
- Can be dismissed with "Remind me later" (shows again next visit)
- Can be permanently closed with X button

### 8.2 Promotional Copy Highlights
The modal emphasizes:
- **Savings:** Shows €42 saved (Searcher) or €72 saved (Lister)
- **Urgency:** "Launch Week Only" creates FOMO
- **No Risk:** "No credit card required" + "Cancel anytime"
- **Social Proof:** Trust indicators at bottom

### 8.3 Promo Code Tracking
The system uses:
- URL parameter: `?promo=EARLYBIRD3`
- LocalStorage: Tracks who has seen the modal
- Can track conversions by checking Stripe metadata

---

## 📊 Monitoring & Analytics

### Track in Stripe Dashboard:
1. **Active Trials:** Products → View subscriptions → Filter by "Trialing"
2. **Trial Conversions:** Check how many convert after 90 days
3. **Churn Rate:** Monitor cancellations before/after trial ends

### Set Up Email Reminders:
1. Configure Stripe to send email 7 days before trial ends
2. Stripe Dashboard → Settings → Emails → "Trial ending soon"

---

## 🎁 Promotion Timeline

**Recommended Launch Schedule:**

**Week 1 (Launch Week):**
- Show Early Bird modal to all new visitors
- Promote heavily: "3 Months Free - Launch Special"

**Week 2-4:**
- Continue promotion but add urgency: "Last chance for 3 months free"
- Consider extending if traction is good

**After Promotion Ends:**
- Remove Early Bird modal
- Switch to regular pricing (€7/€12)
- Can offer 1-month free trial instead

---

## 🔧 Troubleshooting

### Issue: Trial not showing in checkout
**Fix:** Verify the price ID has trial configured in Stripe Dashboard

### Issue: Payment collected during trial
**Fix:** Check if "Offer customers a free trial" is enabled on the price

### Issue: Webhook not receiving events
**Fix:** 
1. Check webhook endpoint URL is correct
2. Verify STRIPE_WEBHOOK_SECRET is set in Vercel
3. Test webhook with Stripe CLI

### Issue: Users can't access features during trial
**Fix:** Check that your subscription status logic includes "trialing" status:
```javascript
const hasActiveSubscription = ['active', 'trialing'].includes(subscription?.status);
```

---

## 📞 Support

If you encounter issues:
1. Check Stripe logs: Dashboard → Developers → Logs
2. Check Vercel function logs: Vercel Dashboard → Functions
3. Stripe support: https://support.stripe.com

---

## ✅ Final Checklist

Before going live with promotion:

- [ ] Created Searcher product with €7/month price + 90-day trial
- [ ] Created Lister product with €12/month price + 90-day trial
- [ ] Copied both price IDs
- [ ] Added price IDs to Vercel environment variables (Production)
- [ ] Created Stripe webhook endpoint
- [ ] Added webhook secret to Vercel
- [ ] Tested in Stripe test mode
- [ ] Early Bird modal showing correctly on site
- [ ] Promo code parameter working in registration flow
- [ ] Verified no payment collected during trial
- [ ] Checked trial_end date is 90 days away
- [ ] Email notifications configured for trial ending
- [ ] Redeployed site with new environment variables

---

🎉 **You're ready to launch your Early Bird promotion!**

Users will see the compelling offer, sign up risk-free, and you'll build your initial user base with a 3-month free trial incentive.

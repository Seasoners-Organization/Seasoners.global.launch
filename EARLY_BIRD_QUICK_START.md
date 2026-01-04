# 🚀 Early Bird Promotion - Quick Launch Checklist

## ⚡ IMMEDIATE ACTIONS (15 minutes)

### 1. Create Stripe Products with 90-Day Trial
**Dashboard:** https://dashboard.stripe.com/products

#### Searcher Plan (€7/month)
- [ ] Click **"+ Add product"**
- [ ] Name: `Seasoners Searcher (Early Bird)`
- [ ] Price: **€7.00 EUR** (Monthly recurring)
- [ ] Click price → **"⋯"** → **"Edit price"**
- [ ] Enable **"Offer customers a free trial"**
- [ ] Set **90 days**
- [ ] **Copy Price ID:** `price_________________`

#### Lister Plan (€12/month)
- [ ] Click **"+ Add product"**
- [ ] Name: `Seasoners Lister (Early Bird)`
- [ ] Price: **€12.00 EUR** (Monthly recurring)
- [ ] Click price → **"⋯"** → **"Edit price"**
- [ ] Enable **"Offer customers a free trial"**
- [ ] Set **90 days**
- [ ] **Copy Price ID:** `price_________________`

---

### 2. Update Vercel Environment Variables
**Dashboard:** https://vercel.com/seasoners-projects/seasoners-starter/settings/environment-variables

Add these for **Production environment:**

```bash
# Early Bird Trial Price IDs
STRIPE_EARLYBIRD_SEARCHER_PRICE_ID=price_YOUR_SEARCHER_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_EARLYBIRD_SEARCHER_PRICE_ID=price_YOUR_SEARCHER_PRICE_ID_HERE

STRIPE_EARLYBIRD_LISTER_PRICE_ID=price_YOUR_LISTER_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_EARLYBIRD_LISTER_PRICE_ID=price_YOUR_LISTER_PRICE_ID_HERE
```

**OPTIONAL:** Create Stripe Payment Links for Early Bird products
```bash
NEXT_PUBLIC_STRIPE_EARLYBIRD_SEARCHER_LINK=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_EARLYBIRD_LISTER_LINK=https://buy.stripe.com/...
```

- [ ] Variables added to Vercel
- [ ] Clicked **"Save"** on each

---

### 3. Deploy Changes
```bash
git add .
git commit -m "Add Early Bird 3-month free trial promotion"
git push origin main
```

- [ ] Pushed to main branch
- [ ] Wait 2-3 minutes for Vercel deployment
- [ ] Check deployment status: https://vercel.com/seasoners-projects/seasoners-starter

---

## ✅ VERIFY IT'S WORKING (5 minutes)

### Test on Live Site:
1. **[ ]** Visit https://www.seasoners.eu in incognito window
2. **[ ]** Click to a second page (e.g., /stays or /jobs)
3. **[ ]** Early Bird modal should appear after 1 second
4. **[ ]** Verify modal shows "3 Months FREE" messaging
5. **[ ]** Click "Claim Your 3 Months Free" button
6. **[ ]** Should redirect to `/auth/register?promo=EARLYBIRD3`
7. **[ ]** Go to `/subscribe?promo=EARLYBIRD3` directly
8. **[ ]** Should see orange banner "Early Bird Special: 3 Months FREE!"
9. **[ ]** Pricing cards show "€0 for 3 months" and "3 MONTHS FREE" badge

---

## 📊 MONITORING & OPTIMIZATION

### Track Performance:
- **Stripe Dashboard:** Check "Trialing" subscriptions count
- **Conversion Rate:** Modal views → Sign-ups
- **Trial Conversion:** Free trial → Paid subscription (after 90 days)

### Email Notifications (Highly Recommended):
1. Go to: https://dashboard.stripe.com/settings/billing/automatic
2. Enable **"Trial ending soon"** email (7 days before)
3. Customize email template with Seasoners branding

---

## 🎯 PROMOTION TIMELINE

### Launch Week (Now - Day 7):
- Show modal to all new visitors
- Promote on social media: "3 Months Free - Launch Special!"
- Monitor sign-up rate daily

### Week 2-4:
- Add urgency: "Last Chance for 3 Months Free"
- Consider extending if traction is good

### After Promotion:
- Disable modal or update to "1 Month Free"
- Switch to regular pricing strategy

---

## 🔧 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Modal not appearing | Check browser console for errors, verify EarlyBirdModal is imported |
| "3 MONTHS FREE" badge not showing | Verify URL has `?promo=EARLYBIRD3` parameter |
| Stripe checkout not showing trial | Confirm 90-day trial enabled on price in Stripe Dashboard |
| Payment collected during trial | Check price settings - trial should be enabled |

---

## 📞 QUICK SUPPORT

- **Stripe Support:** https://support.stripe.com
- **Vercel Logs:** https://vercel.com/seasoners-projects/seasoners-starter/logs
- **Check Build:** https://vercel.com/seasoners-projects/seasoners-starter/deployments

---

## ✨ EXPECTED RESULTS

After completing this checklist:
- ✅ New visitors see compelling 3-month free trial offer
- ✅ Sign-ups redirected to promo-enabled subscription page
- ✅ Stripe automatically handles 90-day trial period
- ✅ No payment collected for 3 months
- ✅ Automatic billing begins after trial (unless cancelled)
- ✅ Users can cancel anytime before trial ends

**Estimated Impact:** 
- 30-50% increase in sign-up conversion
- Build initial user base risk-free
- €21-36 perceived value per user (3 months × monthly price)

---

🎉 **You're ready to launch your Early Bird promotion!**

Users will see the offer, experience FOMO from urgency messaging, and sign up risk-free with the compelling 3-month free trial.

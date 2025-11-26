# 🚀 Quick Deployment Guide - Email Automation Phase 1

## Pre-Deployment Checklist

- [x] Email templates created (`utils/onboarding-emails.ts`)
- [x] Registration integration complete
- [x] Listing creation integration complete
- [x] Stripe webhook integration complete
- [x] TypeScript compilation successful (no errors)
- [x] All imports verified
- [x] Error handling implemented
- [x] Documentation complete

## Deploy to Production (3 steps, ~5 minutes)

### Step 1: Commit Changes
```bash
cd /Users/tremaynechivers/Desktop/seasoners-starter

git add .
git commit -m "feat: Phase 1 email automation - welcome, listing, subscription emails"
git push origin main
```

### Step 2: Verify Vercel Deployment
1. Go to https://vercel.com/dashboard
2. Find your `seasoners-starter` project
3. Wait for deployment to complete (~2 minutes)
4. Check for green checkmark ✅

### Step 3: Test Production Emails
**Option A: Register Test Account**
```
1. Go to https://www.seasoners.eu/auth/register
2. Create account with your personal email
3. Check inbox for welcome email (within 30 seconds)
```

**Option B: Google OAuth Test**
```
1. Go to https://www.seasoners.eu/auth/signin
2. Sign in with Google (new account)
3. Check inbox for welcome email
```

**Option C: Create Test Listing**
```
1. Sign in as HOST user
2. Create a new listing
3. Check inbox for "Listing Published" email
```

---

## Verify Everything Works

### Check Resend Dashboard
1. Go to https://resend.com/emails
2. Verify recent emails appear in logs
3. Check delivery status (should be "Delivered")

### Check Server Logs
```bash
# View production logs in Vercel
vercel logs --prod

# Look for these success messages:
# ✅ Welcome email sent to: user@example.com
# ✅ Listing published email sent
# ✅ Subscription confirmation sent
```

### Check Email Inbox
Confirm email received with:
- ✅ Correct sender: "Seasoners <onboarding@resend.dev>"
- ✅ Professional formatting
- ✅ Working links
- ✅ Responsive on mobile
- ✅ Not in spam folder

---

## Post-Deployment Monitoring

### First 24 Hours
- [ ] Check Resend dashboard every few hours
- [ ] Monitor delivery rate (target: >95%)
- [ ] Watch for error logs in Vercel
- [ ] Test all 3 email types at least once

### First Week
- [ ] Track email open rates
- [ ] Monitor bounce rate (<3%)
- [ ] Review user feedback
- [ ] Check spam complaints (<0.1%)

---

## Rollback (if needed)

If emails aren't working or causing issues:

```bash
# Quick rollback
git revert HEAD
git push origin main

# Wait for Vercel to redeploy (~2 min)
# Previous version will be restored
```

---

## Environment Variables (Already Set ✅)

These should already be in Vercel production:
```
RESEND_API_KEY=re_gwo3wt1E_2msmkNfsQ6YLQh3uqt5fzeqc
NEXT_PUBLIC_APP_URL=https://www.seasoners.eu
```

Verify in Vercel dashboard:
```
Settings → Environment Variables
```

---

## Success Metrics (Week 1 Goals)

| Metric | Target | How to Check |
|--------|--------|--------------|
| Delivery Rate | >95% | Resend Dashboard |
| Welcome Emails Sent | Every new user | Resend Logs |
| Listing Emails Sent | Every new listing | Resend Logs |
| No Production Errors | 0 email errors | Vercel Logs |
| User Complaints | 0 | Support tickets |

---

## Next Actions (After Deploy)

1. **Monitor for 1 week** - Ensure stable delivery
2. **Collect feedback** - Ask users about emails
3. **Review analytics** - Check open/click rates
4. **Plan Phase 2** - Custom domain setup

---

## Support & Help

### If emails aren't sending:
1. Check Vercel env vars: `RESEND_API_KEY` present?
2. Check Resend dashboard for API errors
3. Review server logs: `vercel logs --prod`
4. Test locally first: `npm run dev`

### If emails look broken:
- Check in multiple email clients (Gmail, Outlook, Apple Mail)
- Verify inline CSS is preserved
- Test on mobile device

### If delivery rate is low:
- Check Resend account status
- Verify domain reputation
- Review bounce/spam rates
- Consider email warmup strategy

---

## Documentation Reference

- **Full Implementation:** `docs/EMAIL_PHASE1_COMPLETE.md`
- **Email Strategy:** `docs/EMAIL_STRATEGY.md`
- **Custom Domain Setup:** `docs/EMAIL_CUSTOM_DOMAIN_SETUP.md`
- **Migration Checklist:** `docs/EMAIL_DOMAIN_MIGRATION_CHECKLIST.md`

---

## Estimated Timeline

- **Deploy:** 5 minutes
- **Initial verification:** 10 minutes
- **First week monitoring:** 30 min/day
- **Phase 2 planning:** 1-2 hours

---

**Status:** ✅ Ready to Deploy  
**Risk Level:** Low (non-blocking sends, easy rollback)  
**Impact:** High (improved user experience and engagement)

---

🚀 **You're ready to deploy! Push to main and go live.**

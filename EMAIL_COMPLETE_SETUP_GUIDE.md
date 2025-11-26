# Complete Email Setup Guide for Seasoners
**Last Updated:** 25 November 2025  
**Status:** DNS Verified ✅ | Awaiting Configuration Validation

---

## Current State (Verified)

### ✅ DNS Configuration
```
Nameservers: odin.ns.cloudflare.com, hadlee.ns.cloudflare.com
MX Records:  route1/2/3.mx.cloudflare.net (Cloudflare Email Routing)
SPF Record:  v=spf1 include:_spf.mx.cloudflare.net ~all
```

**Status:** Domain is correctly delegated to Cloudflare and MX records are live.

---

## Setup Checklist

### Phase 1: Inbound Email (Receiving)

#### Step 1: Verify Cloudflare Email Routing Configuration
**Dashboard:** https://dash.cloudflare.com → Select `seasoners.eu` → Email → Email Routing

##### 1.1 Check Destination Addresses
- [ ] Go to **Destinations** tab
- [ ] Verify status shows **"Verified"** (green checkmark)
- [ ] If not verified:
  - Click "Resend verification email"
  - Check inbox (including spam/promotions)
  - Click verification link
  - Wait 2 minutes and refresh

**Destination Format:**
```
Personal:   tremayne@seasoners.eu → tremaynechivers@gmail.com (example)
Support:    support@seasoners.eu → your-support-inbox@gmail.com
General:    hello@seasoners.eu   → your-main-inbox@gmail.com
```

##### 1.2 Create Routing Rules
- [ ] Go to **Routing Rules** tab
- [ ] Click "Create address" or "Edit"
- [ ] Add specific routes:

**Recommended Routes:**
```
Priority 1: hello@seasoners.eu    → [verified-destination]
Priority 2: support@seasoners.eu  → [verified-destination]
Priority 3: tremayne@seasoners.eu → [verified-destination]
```

- [ ] Optional: Add catch-all route `*@seasoners.eu` → [verified-destination]
- [ ] Ensure each route status = **ENABLED** (toggle on)

##### 1.3 Test Inbound Email
From an external email account (Gmail, Outlook, etc.):

**Test 1: Specific Address**
```
To:      hello@seasoners.eu
Subject: CF Routing Test 1
Body:    Testing Cloudflare Email Routing
```

**Test 2: Another Address**
```
To:      support@seasoners.eu
Subject: CF Routing Test 2
Body:    Testing support address
```

**Expected Result:**
- Email arrives at destination inbox within 1-5 minutes
- Check spam/promotions folders if not in primary inbox
- Original sender shows as the external sender
- Headers show `via cloudflare.net` or similar

##### 1.4 Check Activity Log
- [ ] Go to Email Routing → **Activity** tab
- [ ] Look for recent messages
- [ ] Status should show "Forwarded"
- [ ] If status shows "Rejected" or "Dropped":
  - Check destination verification
  - Check route is enabled
  - Verify no conflicting DNS records

---

### Phase 2: Outbound Email (Sending from App)

#### Step 2: Resend Domain Setup

##### 2.1 Add Domain in Resend
**Dashboard:** https://resend.com/domains

- [ ] Click "Add Domain"
- [ ] Enter: `seasoners.eu`
- [ ] Click "Add"

##### 2.2 Configure DNS Records in Cloudflare
Resend will provide 3-4 DNS records. Add each one in Cloudflare DNS:

**Dashboard:** Cloudflare → `seasoners.eu` → DNS → Records

**Records to Add:**

**SPF (Already exists - UPDATE IT):**
```
Type:  TXT
Name:  @  (or seasoners.eu)
Value: v=spf1 include:_spf.mx.cloudflare.net include:spf.resend.com ~all
TTL:   Auto
```
⚠️ **Important:** Combine both Cloudflare (`_spf.mx.cloudflare.net`) and Resend (`spf.resend.com`) in ONE record.

**DKIM Records (from Resend):**
Resend will show 2-3 CNAME records like:
```
Type:  CNAME
Name:  resend._domainkey.seasoners.eu
Value: [provided by Resend - copy exactly]
TTL:   Auto
```

Add each DKIM CNAME exactly as shown in Resend dashboard.

**DMARC (Recommended):**
```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@seasoners.eu; pct=100
TTL:   Auto
```

##### 2.3 Verify Domain in Resend
- [ ] Wait 5-30 minutes after adding DNS records
- [ ] Return to Resend dashboard → Domains
- [ ] Click "Verify" button
- [ ] Status should change to **"Verified"** (green)
- [ ] If not verified:
  - Run DNS check: `dig +short TXT resend._domainkey.seasoners.eu`
  - Ensure CNAMEs point to Resend targets
  - Wait longer (can take up to 48h but usually < 1 hour)

##### 2.4 Update Environment Variables
Add to `.env.local` (local) and Vercel (production):

```bash
# Email configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Seasoners <hello@seasoners.eu>
EMAIL_REPLY_TO_SUPPORT=support@seasoners.eu
EMAIL_REPLY_TO_FOUNDER=tremayne@seasoners.eu
```

Get `RESEND_API_KEY`:
- Resend dashboard → API Keys
- Create new key or use existing
- Copy key (starts with `re_`)

**Vercel Setup:**
```bash
# In Vercel dashboard:
Settings → Environment Variables → Add:

RESEND_API_KEY          = re_your_key_here
EMAIL_FROM              = Seasoners <hello@seasoners.eu>
EMAIL_REPLY_TO_SUPPORT  = support@seasoners.eu
EMAIL_REPLY_TO_FOUNDER  = tremayne@seasoners.eu
```

Apply to: Production, Preview, Development

---

#### Step 3: Update Application Code

##### 3.1 Create Email Configuration File
We'll centralize email configuration for easy maintenance.

##### 3.2 Update All Email Sending Functions
Replace hardcoded email addresses with environment variables in:
- `utils/onboarding-emails.ts`
- `utils/agreement-emails.ts`
- `lib/auth.ts`
- `app/api/auth/verify-email/route.ts`
- `app/api/admin/verify/route.js`

##### 3.3 Test Outbound Sending
After code updates and deployment:

**Local Test:**
```bash
npm run dev

# In another terminal, trigger a test email:
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H 'Content-Type: application/json' \
  -d '{"email":"your-test-email@gmail.com","userId":"test-123"}'
```

Check terminal logs for:
```
✅ Verification email sent: [message-id]
```

Check test email inbox (including spam).

**Production Test:**
- Sign up a new user with Google OAuth
- Should receive welcome email from `hello@seasoners.eu`
- Check reply-to addresses work

---

## Troubleshooting

### Inbound (Receiving) Issues

**Problem:** Test emails not arriving

**Check 1: DNS Propagation**
```bash
dig +short MX seasoners.eu
# Should show: route1/2/3.mx.cloudflare.net
```

**Check 2: Destination Verified**
- Cloudflare dashboard → Email Routing → Destinations
- Must show green "Verified" badge

**Check 3: Route Enabled**
- Cloudflare dashboard → Email Routing → Routing Rules
- Toggle must be ON (blue)
- Route must show "ENABLED" status

**Check 4: Activity Log**
- Cloudflare dashboard → Email Routing → Activity
- Look for your test email
- Status meanings:
  - "Forwarded": ✅ Working
  - "Rejected": ❌ Check destination/route
  - "Dropped": ❌ Check DNS/verification
  - No entry: Email never reached Cloudflare (check sender)

**Check 5: Spam/Promotions**
- Check spam folder at destination
- Check "Promotions" tab in Gmail
- Check "Social" tab in Gmail

**Check 6: Sender Issues**
- Try sending from different email provider
- Some providers delay forwarded emails
- Wait up to 15 minutes for first test

### Outbound (Sending) Issues

**Problem:** App emails not sending

**Check 1: Resend Domain Verified**
```bash
# Check Resend dashboard shows "Verified"
# Or test DNS:
dig +short TXT resend._domainkey.seasoners.eu
```

**Check 2: API Key Set**
```bash
# Local:
echo $RESEND_API_KEY

# Vercel: Check Settings → Environment Variables
```

**Check 3: SPF Record Correct**
```bash
dig +short TXT seasoners.eu
# Should include BOTH:
# include:_spf.mx.cloudflare.net
# include:spf.resend.com
```

**Check 4: Application Logs**
- Check Vercel logs or local terminal
- Look for: `✅ [email type] sent: [id]`
- Or errors: `Resend [email type] error: ...`

**Check 5: Resend Dashboard**
- Go to Resend → Emails
- View recent sends
- Check delivery status
- Look for bounce/spam reports

**Problem:** Emails go to spam

**Solutions:**
- ✅ DMARC record added (p=none initially)
- ✅ SPF includes Resend
- ✅ DKIM verified (green in Resend)
- Wait 1-2 weeks for reputation to build
- Start with small volume (< 50/day initially)
- Ensure recipients engage (open/reply)
- Add "mark as not spam" instructions in first email

---

## Validation Commands

Run these to verify everything:

```bash
# Check MX records (should be Cloudflare)
dig +short MX seasoners.eu

# Check SPF (should include both Cloudflare and Resend)
dig +short TXT seasoners.eu

# Check DKIM for Resend
dig +short CNAME resend._domainkey.seasoners.eu

# Check DMARC
dig +short TXT _dmarc.seasoners.eu

# Check nameservers (should be Cloudflare)
dig +short NS seasoners.eu

# Full diagnostic
dig seasoners.eu MX +noall +answer
```

---

## Quick Reference

### Email Addresses to Configure
```
Inbound (Cloudflare):
- hello@seasoners.eu    → Primary contact
- support@seasoners.eu  → User support
- tremayne@seasoners.eu → Founder direct

Outbound (Resend):
- From: Seasoners <hello@seasoners.eu>
- Reply-To (support): support@seasoners.eu
- Reply-To (personal): tremayne@seasoners.eu
```

### Dashboards
- **Cloudflare:** https://dash.cloudflare.com
- **Resend:** https://resend.com/domains
- **Vercel:** https://vercel.com/[your-team]/[project]/settings/environment-variables

### Support Resources
- Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/
- Resend Documentation: https://resend.com/docs
- SPF/DKIM/DMARC Guide: https://www.cloudflare.com/learning/dns/dns-records/

---

## Success Criteria

### Phase 1 Complete (Inbound) ✅
- [ ] DNS shows Cloudflare MX records
- [ ] Destination address verified in Cloudflare
- [ ] Routes created and enabled
- [ ] Test email to `hello@seasoners.eu` arrives at destination
- [ ] Activity log shows "Forwarded" status

### Phase 2 Complete (Outbound) 🔄
- [ ] Domain added and verified in Resend
- [ ] All DNS records added (SPF, DKIM, DMARC)
- [ ] Resend shows domain status = "Verified"
- [ ] Environment variables set (local + Vercel)
- [ ] Code updated to use custom domain
- [ ] Test email sends successfully from app
- [ ] Email arrives with `from: hello@seasoners.eu`
- [ ] Reply-to addresses work correctly

---

## Next Steps

1. **Complete Phase 1 validation** (inbound receiving)
2. **Set up Resend domain** (outbound sending)
3. **Update application code** with environment variables
4. **Deploy and test** end-to-end
5. **Monitor for 48 hours** to ensure stability
6. **Adjust DMARC** to `p=quarantine` after 2 weeks (optional)

Need help with any step? Check the troubleshooting section or run the validation commands.

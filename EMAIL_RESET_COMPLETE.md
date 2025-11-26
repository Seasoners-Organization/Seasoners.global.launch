# Email System Reset Complete ✅

**Date:** 25 November 2025  
**Status:** Codebase Updated | Ready for Configuration

---

## What Was Done

### ✅ DNS Verification
- Confirmed Cloudflare nameservers active
- Verified MX records pointing to Cloudflare Email Routing
- Confirmed SPF record includes Cloudflare forwarding

### ✅ Code Refactoring
Created centralized email configuration system:

**New Files:**
- `lib/email-config.ts` - Centralized email configuration
- `scripts/test-email-config.js` - Diagnostic & testing tool
- `scripts/email-setup-checklist.sh` - Interactive setup guide
- `EMAIL_COMPLETE_SETUP_GUIDE.md` - Comprehensive documentation

**Updated Files:**
- `utils/onboarding-emails.ts` - Now uses `getEmailConfig()`
- `utils/agreement-emails.ts` - Now uses `getEmailConfig()`
- `lib/auth.ts` - Now uses `getEmailConfig()`
- `app/api/auth/verify-email/route.ts` - Now uses `getEmailConfig()`
- `app/api/admin/verify/route.js` - Now uses `getEmailConfig()`

### ✅ Benefits of New System
1. **Environment-Based:** All email addresses managed via env vars
2. **Easy Updates:** Change sender domain in one place
3. **Type-Safe:** TypeScript configuration with validation
4. **Fallback Support:** Works with test domain until custom domain configured
5. **Diagnostic Tools:** Built-in testing and validation scripts

---

## Current Status

### DNS (Cloudflare) ✅
```
Nameservers: odin.ns.cloudflare.com, hadlee.ns.cloudflare.com
MX Records:  route1/2/3.mx.cloudflare.net (Cloudflare Email Routing)
SPF Record:  v=spf1 include:_spf.mx.cloudflare.net ~all
```

### Email Configuration ⚠️ (Needs Setup)
```
RESEND_API_KEY:          ❌ Not set
EMAIL_FROM:              ⚠️  Using default (onboarding@resend.dev)
EMAIL_REPLY_TO_SUPPORT:  ⚠️  Using default (support@seasoners.eu)
EMAIL_REPLY_TO_FOUNDER:  ⚠️  Using default (tremayne@seasoners.eu)
```

---

## Next Steps (In Order)

### Step 1: Configure Cloudflare Email Routing (Inbound)
**Time: 5-10 minutes**

1. Go to: https://dash.cloudflare.com → `seasoners.eu` → Email → Email Routing

2. **Add Destination:**
   - Click "Destinations" tab
   - Add your email address (e.g., your Gmail)
   - Check inbox for verification email
   - Click verification link
   - Wait for status to show "Verified" (green)

3. **Create Routing Rules:**
   - Click "Routing Rules" tab
   - Add route: `hello@seasoners.eu` → [your-verified-destination]
   - Add route: `support@seasoners.eu` → [your-verified-destination]
   - Add route: `tremayne@seasoners.eu` → [your-verified-destination]
   - Ensure each route is ENABLED (toggle ON)

4. **Test Inbound:**
   ```bash
   # From external email (Gmail, Outlook, etc.), send to:
   To: hello@seasoners.eu
   Subject: Test Inbound Routing
   ```
   - Check destination inbox (including spam/promotions)
   - Should arrive within 1-5 minutes

5. **Verify in Dashboard:**
   - Go to: Email Routing → Activity
   - Look for your test email
   - Status should show "Forwarded"

**Success Criteria:** Test email received at destination ✅

---

### Step 2: Configure Resend Domain (Outbound)
**Time: 15-30 minutes (includes DNS propagation)**

1. **Add Domain in Resend:**
   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Enter: `seasoners.eu`
   - Click "Add"

2. **Get DNS Records:**
   - Resend will display required DNS records
   - Copy them (usually 2-3 CNAME + 1 TXT update)

3. **Update DNS in Cloudflare:**
   - Go to: https://dash.cloudflare.com → `seasoners.eu` → DNS → Records
   
   **Update SPF (Important: Combine both):**
   ```
   Type:  TXT
   Name:  @  (or seasoners.eu)
   Value: v=spf1 include:_spf.mx.cloudflare.net include:spf.resend.com ~all
   TTL:   Auto
   ```
   
   **Add DKIM Records (from Resend):**
   ```
   Type:  CNAME
   Name:  resend._domainkey
   Value: [copy from Resend dashboard]
   TTL:   Auto
   ```
   Add each DKIM CNAME shown in Resend.
   
   **Add DMARC (Recommended):**
   ```
   Type:  TXT
   Name:  _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@seasoners.eu
   TTL:   Auto
   ```

4. **Verify Domain:**
   - Wait 5-30 minutes for DNS propagation
   - Return to Resend dashboard → Domains
   - Click "Verify" button
   - Status should change to "Verified" (green)

5. **Test DNS:**
   ```bash
   # Check SPF includes both Cloudflare and Resend:
   dig +short TXT seasoners.eu
   
   # Check DKIM points to Resend:
   dig +short CNAME resend._domainkey.seasoners.eu
   
   # Check DMARC exists:
   dig +short TXT _dmarc.seasoners.eu
   ```

**Success Criteria:** Resend domain shows "Verified" ✅

---

### Step 3: Configure Environment Variables
**Time: 5 minutes**

1. **Get Resend API Key:**
   - Go to: https://resend.com/api-keys
   - Create new key or copy existing
   - Copy key (starts with `re_`)

2. **Update Local Environment:**
   Create/update `.env.local`:
   ```bash
   # Email Configuration
   RESEND_API_KEY=re_your_actual_key_here
   EMAIL_FROM=Seasoners <hello@seasoners.eu>
   EMAIL_REPLY_TO_SUPPORT=support@seasoners.eu
   EMAIL_REPLY_TO_FOUNDER=tremayne@seasoners.eu
   ```

3. **Update Vercel Environment:**
   - Go to: https://vercel.com/[your-team]/[project]/settings/environment-variables
   - Add each variable above
   - Apply to: Production, Preview, Development

4. **Restart Local Dev Server:**
   ```bash
   # Stop server (Ctrl+C) and restart:
   npm run dev
   ```

**Success Criteria:** `node scripts/test-email-config.js` shows all green ✅

---

### Step 4: Test Email Sending
**Time: 5 minutes**

1. **Run Diagnostic:**
   ```bash
   node scripts/test-email-config.js
   ```
   Should show:
   ```
   ✅ RESEND_API_KEY: Set
   ✅ Custom sender: Seasoners <hello@seasoners.eu>
   ✅ Reply-to (support): support@seasoners.eu
   ✅ Reply-to (founder): tremayne@seasoners.eu
   ```

2. **Send Test Email:**
   ```bash
   node scripts/test-email-config.js --send your-email@gmail.com
   ```
   - Check inbox (and spam)
   - Email should arrive from `hello@seasoners.eu`
   - Reply-to should be `support@seasoners.eu`
   - Should arrive within 1-5 minutes

3. **Test Welcome Email (Production Flow):**
   - Clear cookies / incognito window
   - Go to your app
   - Sign up with Google OAuth (use different Google account)
   - Check inbox for welcome email
   - Should arrive from `hello@seasoners.eu`

**Success Criteria:** All test emails received and properly configured ✅

---

### Step 5: Deploy to Production
**Time: 5 minutes**

1. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Configure centralized email system with custom domain"
   git push
   ```

2. **Verify Deployment:**
   - Check Vercel dashboard for successful build
   - Monitor logs for any email-related errors

3. **Production Test:**
   - Sign up a new user
   - Trigger various emails (welcome, listing, etc.)
   - Check Resend dashboard → Emails for delivery status

**Success Criteria:** Production emails sending successfully ✅

---

## Quick Reference Commands

### Check DNS Status
```bash
# All-in-one diagnostic:
dig +short MX seasoners.eu && \
dig +short TXT seasoners.eu && \
dig +short CNAME resend._domainkey.seasoners.eu && \
dig +short TXT _dmarc.seasoners.eu
```

### Test Email Configuration
```bash
# Diagnostic only:
node scripts/test-email-config.js

# Send test email:
node scripts/test-email-config.js --send your-email@example.com
```

### Interactive Setup
```bash
# Follow step-by-step wizard:
bash scripts/email-setup-checklist.sh
```

---

## Troubleshooting

### Inbound Not Working (Cloudflare Email Routing)

**Problem:** Test emails to @seasoners.eu not arriving

**Check:**
1. Destination verified in Cloudflare? (must be green)
2. Route enabled? (toggle must be ON)
3. Activity log shows "Forwarded"? (check Cloudflare dashboard)
4. Checked spam/promotions folders at destination?
5. MX records live? `dig +short MX seasoners.eu` shows Cloudflare?

**Common Fixes:**
- Re-verify destination address
- Ensure route status = ENABLED
- Wait 5-15 minutes after creating routes
- Check spam filter at destination
- Try different sender (some providers have delays)

---

### Outbound Not Working (Resend)

**Problem:** App not sending emails or emails not arriving

**Check:**
1. Resend domain verified? (must be green in dashboard)
2. RESEND_API_KEY set? `echo $RESEND_API_KEY` (local) or check Vercel
3. SPF includes Resend? `dig +short TXT seasoners.eu` shows `spf.resend.com`?
4. DKIM configured? `dig +short CNAME resend._domainkey.seasoners.eu` points to Resend?
5. Check logs? Look for `✅ [email-type] sent: [id]` or error messages

**Common Fixes:**
- Wait longer for DNS (can take up to 1 hour, usually 5-30 mins)
- Re-verify domain in Resend dashboard
- Check API key is correct (starts with `re_`)
- Restart dev server after adding env vars
- Check Resend dashboard → Emails for bounces/errors

---

### Emails Going to Spam

**Solutions:**
1. ✅ Ensure DMARC record added (`p=none` for monitoring)
2. ✅ Ensure SPF includes Resend
3. ✅ Ensure all DKIM records verified in Resend
4. ⏳ Wait 1-2 weeks for email reputation to build
5. 📊 Start with low volume (< 50 emails/day initially)
6. 💬 Encourage recipients to mark as "Not Spam"
7. 📝 Include clear unsubscribe links (Phase 2)

---

## What Changed in the Code

### Before (Hardcoded)
```typescript
await resend.emails.send({
  from: 'Seasoners <onboarding@resend.dev>',
  replyTo: 'support@seasoners.eu',
  to: user.email,
  // ...
});
```

### After (Centralized)
```typescript
const emailConfig = getEmailConfig('welcome');
await resend.emails.send({
  from: emailConfig.from,      // From EMAIL_FROM env var
  replyTo: emailConfig.replyTo, // From EMAIL_REPLY_TO_FOUNDER env var
  to: user.email,
  // ...
});
```

**Benefits:**
- Change sender domain in one place (env var)
- Different email types can use different reply-to addresses
- Easy A/B testing of sender addresses
- Type-safe configuration
- Built-in validation and diagnostics

---

## Support Resources

- **Complete Guide:** `EMAIL_COMPLETE_SETUP_GUIDE.md`
- **Diagnostic Tool:** `scripts/test-email-config.js`
- **Setup Wizard:** `scripts/email-setup-checklist.sh`
- **Cloudflare Docs:** https://developers.cloudflare.com/email-routing/
- **Resend Docs:** https://resend.com/docs
- **SPF/DKIM/DMARC:** https://www.cloudflare.com/learning/dns/dns-records/

---

## Success Checklist

- [ ] DNS using Cloudflare nameservers
- [ ] MX records showing Cloudflare Email Routing
- [ ] Cloudflare destination verified
- [ ] Cloudflare routes created and enabled
- [ ] Test email received at destination
- [ ] Resend domain added
- [ ] All DNS records added (SPF, DKIM, DMARC)
- [ ] Resend domain verified
- [ ] Environment variables set (local + Vercel)
- [ ] Test email sent successfully from app
- [ ] Emails arriving from custom domain
- [ ] Reply-to addresses working correctly
- [ ] Production deployment successful
- [ ] Welcome email working for new users

---

**Ready to start?** Follow the steps above in order, or run:

```bash
bash scripts/email-setup-checklist.sh
```

for an interactive guided setup.

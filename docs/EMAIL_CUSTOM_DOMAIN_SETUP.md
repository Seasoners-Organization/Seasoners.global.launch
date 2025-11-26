# Custom Email Domain Setup Guide

## Overview
Configure `hello@seasoners.eu` as the sender for all automated emails instead of `onboarding@resend.dev`.

## Prerequisites
- Access to DNS settings for `seasoners.eu`
- Resend account with API key already configured
- Domain ownership verified

## Step 1: Add Domain to Resend

1. Log in to [Resend Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter: `seasoners.eu`
4. Click **"Add"**

## Step 2: Configure DNS Records

Resend will provide DNS records to add. Typical records:

### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

### DKIM Records
```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend - unique to your account]
```

### DMARC Record (optional but recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@seasoners.eu
```

## Step 3: Add DNS Records to Your Provider

### If using Cloudflare:
1. Go to DNS settings for `seasoners.eu`
2. Click **"Add record"**
3. Add each TXT record from Resend
4. Save changes

### If using other provider:
Follow their DNS management interface to add TXT records.

**Important:** DNS propagation can take 24-48 hours but usually completes in 1-2 hours.

## Step 4: Verify Domain in Resend

1. Return to Resend dashboard
2. Click **"Verify"** next to your domain
3. Wait for verification (may take a few minutes)
4. Status should change to **"Verified ✓"**

## Step 5: Update Email Templates

Replace `onboarding@resend.dev` with your custom domain in all email functions:

### File: `/utils/onboarding-emails.ts`

**Current:**
```typescript
from: 'Seasoners <onboarding@resend.dev>',
```

**Change to:**
```typescript
from: 'Seasoners <hello@seasoners.eu>',
```

### Files to Update:
1. `sendWelcomeEmail()` function
2. `sendListingPublishedEmail()` function
3. `sendMessageNotificationEmail()` function
4. `sendSubscriptionConfirmationEmail()` function

**Quick Find & Replace:**
```bash
# From project root
cd /Users/tremaynechivers/Desktop/seasoners-starter
grep -r "onboarding@resend.dev" utils/
# Replace all instances with: hello@seasoners.eu
```

## Step 6: Update Other Email Senders

Also check these files for email sender addresses:

### `/app/api/auth/verify-email/route.ts`
```typescript
from: 'Seasoners <hello@seasoners.eu>',
```

### `/utils/agreement-emails.ts`
```typescript
from: 'Seasoners <hello@seasoners.eu>',
```

### `/app/api/admin/verify/route.js`
```typescript
from: 'Seasoners <hello@seasoners.eu>',
```

### `/lib/auth.ts` (Email provider)
```typescript
from: 'Seasoners <hello@seasoners.eu>',
```

## Step 7: Test Email Delivery

Send test emails from all functions:

```bash
# Register a new account with your personal email
# Create a test listing
# Trigger a subscription (use Stripe test mode)
```

Check:
- ✅ Emails arrive (not in spam)
- ✅ Sender shows as "Seasoners <hello@seasoners.eu>"
- ✅ No authentication warnings
- ✅ Links work correctly

## Step 8: Monitor Deliverability

### Resend Dashboard
Check [Resend Analytics](https://resend.com/analytics) for:
- Delivery rate (should be >95%)
- Bounce rate (should be <5%)
- Spam complaint rate (should be <0.1%)

### Email Reputation
Use tools to check your domain reputation:
- [MXToolbox](https://mxtoolbox.com/SuperTool.aspx?action=blacklist:seasoners.eu)
- [Google Postmaster Tools](https://postmaster.google.com/)
- [Mail Tester](https://www.mail-tester.com/)

## Troubleshooting

### Domain Not Verifying
- Double-check DNS records are exactly as provided by Resend
- Wait 30-60 minutes for DNS propagation
- Use `dig` command to verify records:
  ```bash
  dig TXT resend._domainkey.seasoners.eu
  dig TXT seasoners.eu
  ```

### Emails Going to Spam
- Ensure SPF, DKIM, and DMARC records are correctly configured
- Check domain reputation with blacklist checkers
- Start with low volume and gradually increase
- Ensure unsubscribe links are present

### Authentication Failures
- Verify DKIM signature in email headers
- Check SPF alignment
- Ensure "From" address matches verified domain

## Best Practices

### Email Addresses to Create
- `hello@seasoners.eu` - Primary automated emails ✅
- `noreply@seasoners.eu` - System notifications
- `support@seasoners.eu` - User support (manual)
- `team@seasoners.eu` - Team communications
- `security@seasoners.eu` - Security alerts

### Email Warmup (Optional)
For high volume sending, gradually increase:
- Day 1-3: 50 emails/day
- Day 4-7: 100 emails/day
- Week 2: 500 emails/day
- Week 3+: Full volume

This builds domain reputation with email providers.

### Bounce Handling
Configure webhook in Resend to handle bounces:
```typescript
// /app/api/webhooks/resend/route.ts
export async function POST(req: Request) {
  const { type, data } = await req.json();
  
  if (type === 'email.bounced') {
    // Mark user email as invalid
    await prisma.user.update({
      where: { email: data.to },
      data: { emailStatus: 'bounced' }
    });
  }
}
```

## Cost Considerations

### Resend Pricing (as of Nov 2025)
- **Free:** 3,000 emails/month, 100/day
- **Pro ($20/mo):** 50,000 emails/month
- **Business ($80/mo):** 250,000 emails/month

**Recommendation:** Start with free tier, upgrade when exceeding limits.

## Security Notes

### SPF Record Implications
The SPF record `v=spf1 include:resend.com ~all` allows Resend to send emails on behalf of your domain. This is standard practice for email service providers.

### DKIM Signing
DKIM (DomainKeys Identified Mail) cryptographically signs emails to prove they came from your domain. This is critical for deliverability.

### DMARC Policy
Start with `p=none` to monitor authentication results. Once confident, upgrade to `p=quarantine` or `p=reject` for stronger protection.

---

**Estimated Time:** 30 minutes (plus DNS propagation)  
**Difficulty:** Intermediate  
**Support:** hello@seasoners.eu or Resend documentation

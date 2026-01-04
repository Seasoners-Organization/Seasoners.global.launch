# Trial Reminder Email System - Setup Guide

## 📧 Overview

Automated email notification system that sends reminders to users at key points during their 90-day free trial:

- **Day 30** (60 days remaining): Friendly first reminder
- **Day 60** (30 days remaining): Progress update with urgency
- **Day 83** (7 days remaining): Critical warning email
- **Day 89** (1 day remaining): Final urgent notice

## 🎯 Features

✅ **Automatic Daily Processing** - Runs via Vercel Cron at 10:00 AM UTC  
✅ **Beautiful HTML Emails** - Professional design with brand colors  
✅ **Clear CTAs** - Direct links to manage/cancel subscription  
✅ **Graduated Urgency** - Messaging intensity increases as trial end approaches  
✅ **Transparent Billing Info** - Shows exact price and billing date  
✅ **Legal Compliance** - Meets notification requirements to avoid disputes

---

## 📋 Setup Instructions

### Step 1: Add Environment Variables to Vercel

Go to: https://vercel.com/seasoners-projects/seasoners-starter/settings/environment-variables

Add these for **Production** environment:

```bash
# Cron Job Security (generate random string)
CRON_SECRET=your-random-secret-here-generate-with-openssl

# Admin Secret for Manual Testing
ADMIN_SECRET=your-admin-secret-here-different-from-cron

# Resend API Key (for sending emails)
RESEND_API_KEY=re_your_resend_api_key_here
```

**Generate secrets:**
```bash
# For CRON_SECRET
openssl rand -base64 32

# For ADMIN_SECRET  
openssl rand -base64 32
```

---

### Step 2: Verify Cron Job Configuration

The cron job is already configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/trial-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

**Schedule:** Runs daily at 10:00 AM UTC (11:00 AM CET / 5:00 AM EST)

---

### Step 3: Verify Resend Email Domain

1. Go to: https://resend.com/domains
2. Add and verify your domain: `seasoners.eu`
3. Add DNS records (SPF, DKIM, DMARC) as instructed
4. Wait for verification (usually 5-15 minutes)
5. Test by sending a test email from Resend dashboard

**Sending Address:** Emails will come from `hello@seasoners.eu`

---

### Step 4: Test the System

#### Manual Test (Recommended First):

```bash
# Using curl to trigger manually
curl -X POST https://www.seasoners.eu/api/cron/trial-reminders \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-admin-secret-here"}'
```

#### Expected Response:
```json
{
  "success": true,
  "manual": true,
  "timestamp": "2026-01-04T10:00:00.000Z",
  "results": {
    "day30": { "sent": 2, "failed": 0 },
    "day60": { "sent": 1, "failed": 0 },
    "day83": { "sent": 0, "failed": 0 },
    "day89": { "sent": 0, "failed": 0 }
  }
}
```

#### Test with Specific Trial Dates:

Create a test subscription in Stripe with a trial that ends soon:

1. Go to Stripe Dashboard → Customers
2. Create test customer with card `4242 4242 4242 4242`
3. Subscribe to Early Bird plan
4. Edit subscription → Set trial end date to tomorrow
5. Wait for cron to run (or trigger manually)
6. Check your email for the 1-day reminder

---

### Step 5: Monitor Cron Execution

#### View Cron Logs in Vercel:
1. Go to: https://vercel.com/seasoners-projects/seasoners-starter/logs
2. Filter by: `api/cron/trial-reminders`
3. Check for successful executions daily at 10:00 AM UTC

#### Expected Daily Log:
```
Trial reminders processed: {
  day30: { sent: 5, failed: 0 },
  day60: { sent: 3, failed: 0 },
  day83: { sent: 2, failed: 0 },
  day89: { sent: 1, failed: 0 }
}
```

---

## 📧 Email Preview

### Day 30 (60 Days Remaining)
**Subject:** Your Seasoners free trial - 60 days remaining! 🎉  
**Tone:** Friendly, informative  
**Content:**
- Congratulations on 30 days of exploring
- 60 days remaining highlighted
- Reminder of features they're enjoying
- Soft CTA to manage subscription

### Day 60 (30 Days Remaining)
**Subject:** Your free trial - 30 days left ⏰  
**Tone:** Informative with mild urgency  
**Content:**
- Trial is 2/3 complete
- 30 days until billing
- Clear explanation of what happens next
- Pricing reminder
- Links to review or cancel

### Day 83 (7 Days Remaining)
**Subject:** ⚠️ Important: Your free trial ends in 7 days  
**Tone:** Urgent, clear, important  
**Content:**
- Red warning banner
- Explicit billing date
- Two clear options: keep or cancel
- Countdown to billing
- Direct cancel link

### Day 89 (1 Day Remaining)
**Subject:** 🚨 FINAL NOTICE: Your trial ends tomorrow  
**Tone:** Very urgent, last chance  
**Content:**
- Red emergency banner
- "FINAL NOTICE" header
- Card will be charged tomorrow
- Last chance to cancel
- Summary table with all details
- Prominent cancel button

---

## 🔧 Troubleshooting

### Emails Not Sending

**Check:**
1. Verify `RESEND_API_KEY` is set in Vercel Production
2. Check Resend domain is verified
3. Check Resend dashboard for failed sends
4. Verify user email addresses are valid
5. Check spam folder

**Fix:**
```bash
# Test Resend connection
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@seasoners.eu",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

### Cron Not Running

**Check:**
1. Verify `CRON_SECRET` is set in Vercel
2. Check Vercel cron logs for errors
3. Ensure vercel.json is deployed
4. Cron jobs only work on Pro plans

**Workaround:**
Set up external cron (like cron-job.org) to call the endpoint:
```
URL: https://www.seasoners.eu/api/cron/trial-reminders
Method: GET
Header: Authorization: Bearer YOUR_CRON_SECRET
Schedule: 0 10 * * *
```

### Wrong Email Timing

**Issue:** Users receiving emails on wrong days

**Check:**
1. Verify trial start/end dates in database
2. Check timezone handling (all dates should be UTC)
3. Test with known trial end dates

**Fix:**
Update subscription trial dates in Stripe or database directly.

---

## 🎨 Customizing Email Templates

Email templates are in: `utils/trial-reminders.js`

### To Customize:
1. Edit the HTML in the `resend.emails.send()` call
2. Maintain responsive design (max-width: 600px)
3. Test in multiple email clients
4. Use inline CSS only (email clients strip `<style>` tags)

### Testing Email Design:
1. Send to yourself using manual trigger
2. Test in: Gmail, Outlook, Apple Mail, Mobile
3. Use tool: https://www.emailonacid.com or Litmus

---

## 📊 Analytics & Monitoring

### Key Metrics to Track:

1. **Email Open Rates**
   - Day 30: Expected ~40-50%
   - Day 60: Expected ~50-60%
   - Day 83: Expected ~60-70%
   - Day 89: Expected ~70-80%

2. **Cancellation Rates by Email**
   - Track in Stripe which users cancel after each email
   - Adjust messaging if cancellation spikes

3. **Trial Conversion Rate**
   - Track: Users who complete trial and start paying
   - Goal: 60-70% conversion rate

### Set Up Tracking:
- Use Resend analytics dashboard
- Add UTM parameters to links for Google Analytics
- Create Stripe webhook to track cancellations by date

---

## 📝 Legal Compliance

### Requirements Met:

✅ **Advance Notice:** Users notified 60, 30, 7, and 1 days before billing  
✅ **Clear Terms:** Subscription terms page clearly states trial period and billing  
✅ **Easy Cancellation:** One-click link to cancel in every email  
✅ **Transparent Pricing:** Shows exact amount and date of charge  
✅ **Opt-out:** Users can unsubscribe from emails (while keeping subscription)

### Best Practices:
- Keep email logs for at least 2 years
- Store "email sent" timestamps in database
- Provide easy customer support contact
- Honor cancellation requests immediately

---

## 🔄 Future Enhancements

### Phase 2 (Optional):
- [ ] SMS reminders for final 24 hours (via Twilio)
- [ ] Push notifications in app
- [ ] A/B test email subject lines
- [ ] Personalized content based on user activity
- [ ] "Pause subscription" option instead of cancel
- [ ] Loyalty rewards for keeping subscription

### Phase 3 (Advanced):
- [ ] AI-powered send time optimization
- [ ] Multi-language email templates
- [ ] Retention offers for high-value users
- [ ] Survey to users who cancel (exit interview)

---

## ✅ Post-Deployment Checklist

After deploying, verify:

- [ ] Cron job appears in Vercel dashboard
- [ ] Environment variables set (CRON_SECRET, ADMIN_SECRET, RESEND_API_KEY)
- [ ] Resend domain verified and sending
- [ ] Manual test successful (emails received)
- [ ] Subscription terms page updated with trial info
- [ ] Test subscription created with near-end trial date
- [ ] Received test email within 24 hours
- [ ] Email links work (manage subscription, cancel)
- [ ] Monitoring set up in Vercel logs
- [ ] Customer support briefed on trial reminder system

---

## 📞 Support

**Email Issues:** Check Resend dashboard or email support@resend.com  
**Cron Issues:** Check Vercel logs or contact Vercel support  
**Code Issues:** Review `/utils/trial-reminders.js` and `/app/api/cron/trial-reminders/route.ts`

---

**System Status:** ✅ Ready for Production  
**Last Updated:** January 4, 2026  
**Version:** 1.0

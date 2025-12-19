# Email Notification System

## Overview

Seasoners now has a comprehensive email notification system that keeps users informed throughout their journey. All emails feature consistent branding, founder signature, and clear calls-to-action.

## Email Types

### 1. Welcome Email ✅
**Trigger:** New user signs up  
**Subject:** Welcome to Seasoners!  
**Status:** ✅ Active  
**Purpose:** Onboard new users, explain features, encourage profile completion  

**Content:**
- Welcome message from founder
- Platform overview
- Getting started checklist
- Trust & safety information
- Links to browse stays/jobs/flatshares

**Code:** `sendWelcomeEmail(user)` in `utils/onboarding-emails.ts`

---

### 2. Subscription Confirmation 🎉
**Trigger:** Payment succeeds (Stripe webhook `invoice.payment_succeeded`)  
**Subject:** Welcome to [Plan Name] Plan! 🎉  
**Status:** ✅ Active  
**Purpose:** Confirm subscription activation, show plan benefits  

**Content:**
- Subscription details (plan, price, status)
- Full list of included features
- Billing information
- Next steps and getting started tips
- Link to manage subscription

**Code:** `sendSubscriptionConfirmationEmail(user, subscription)` in `utils/onboarding-emails.ts`  
**Webhook:** Triggered in `app/api/webhooks/stripe/route.ts` line 311

---

### 3. Subscription Cancelled 👋
**Trigger:** User cancels subscription (Stripe webhook `customer.subscription.deleted`)  
**Subject:** Subscription Cancelled - You'll Be Missed  
**Status:** ✅ Active  
**Purpose:** Confirm cancellation, explain remaining access, request feedback  

**Content:**
- Cancellation confirmation
- Access continuation until end of billing period
- What happens next (no charges, revert to free plan)
- Feedback request
- Resubscribe option

**Code:** `sendSubscriptionCancelledEmail(user, subscription)` in `utils/onboarding-emails.ts`  
**Webhook:** Triggered in `app/api/webhooks/stripe/route.ts` line 291

---

### 4. Payment Failed ⚠️
**Trigger:** Payment fails (Stripe webhook `invoice.payment_failed`)  
**Subject:** Payment Failed - Action Required  
**Status:** ✅ Active  
**Purpose:** Alert user of failed payment, explain retry schedule, provide action steps  

**Content:**
- Payment failure notification
- Common reasons (insufficient funds, expired card, etc.)
- Retry schedule (3 days, 7 days, then cancel)
- Update payment method CTA
- What happens if not resolved
- Billing support contact

**Code:** `sendPaymentFailedEmail(user, subscription)` in `utils/onboarding-emails.ts`  
**Webhook:** Triggered in `app/api/webhooks/stripe/route.ts` line 351

---

### 5. Trial Ending Soon ⏰
**Trigger:** 2 days before trial ends (needs cron job implementation)  
**Subject:** Your Free Trial Ends in 2 Days  
**Status:** 🔨 Needs cron job  
**Purpose:** Remind users of trial ending, give option to continue or cancel  

**Content:**
- Trial ending notice
- Days remaining
- What happens if they do nothing (auto-subscribe)
- Plan benefits reminder
- Pricing reminder (€7/month)
- Continue subscription CTA
- Cancel subscription link

**Code:** `sendTrialEndingEmail(user, daysLeft)` in `utils/onboarding-emails.ts`  
**Implementation needed:** Cron job or scheduled function to check trial expiry dates

---

### 6. Listing Published ✅
**Trigger:** User creates a new listing  
**Subject:** Your Listing is Live!  
**Status:** ✅ Active  
**Purpose:** Confirm listing is published, provide tips for success  

**Content:**
- Listing details (title, location, price)
- View listing link
- Success tips (respond quickly, add photos, be detailed)
- What happens next (notification on interest)
- Dashboard link

**Code:** `sendListingPublishedEmail(listing, user)` in `utils/onboarding-emails.ts`

---

### 7. Verification Completed 🎉
**Trigger:** User completes verification (email/phone/ID)  
**Subject:** [Type] Verified!  
**Status:** 🔨 Needs integration with verification flow  
**Purpose:** Celebrate verification, show trust score increase, encourage more verification  

**Content:**
- Verification confirmation
- Trust score increase (+10 email, +15 phone, +25 ID)
- Benefits of higher trust score
- Next verification step suggestion
- Profile link

**Code:** `sendVerificationCompletedEmail(user, verificationType)` in `utils/onboarding-emails.ts`  
**Implementation needed:** Integration with verification endpoints

---

### 8. Message Notification 💬
**Trigger:** User receives a new message (planned)  
**Subject:** New Message  
**Status:** 📝 Template exists, needs integration  
**Purpose:** Alert users of new messages, encourage quick responses  

**Content:**
- Sender name and photo
- Message preview
- Reply CTA
- Response time importance
- Notification preferences link

**Code:** `generateMessageNotificationEmail(recipient, sender, messagePreview, conversationUrl)` in `utils/onboarding-emails.ts`  
**Implementation needed:** Integration with messaging system

---

## Email Infrastructure

### Configuration
- **Provider:** Resend API
- **From Address:** Configured per email type in `lib/email-config.ts`
- **Reply-To:** Context-specific (support, billing, hello, etc.)

### Branding Elements
All emails include:
- **Logo Header:** Seasoners logo with link to homepage
- **Founder Signature:** Personal touch from Tremayne with photo and contact
- **Consistent Colors:**
  - Primary: #0369a1 (Blue)
  - Success: #10b981 (Green)
  - Warning: #f59e0b (Amber)
  - Error: #dc2626 (Red)

### Email Structure
```typescript
// Standard email structure
1. Logo header
2. Icon + Title
3. Main message
4. Key information (highlighted box)
5. Call-to-action button
6. Additional details
7. Founder signature
8. Footer (help links, copyright)
```

## Implementation Status

### ✅ Currently Working
1. Welcome email (on signup)
2. Subscription confirmation (on payment success)
3. Subscription cancelled (on cancellation)
4. Payment failed (on failed payment)
5. Listing published (on listing creation)

### 🔨 Needs Integration
1. **Trial ending reminder** - Requires cron job to check `subscriptionExpiresAt` dates
2. **Verification completed** - Needs integration with verification endpoints
3. **Message notification** - Needs integration with messaging system

### 📝 Potential Future Emails
1. **Listing approved** (after moderation)
2. **Listing rejected** (after moderation with reason)
3. **Profile views milestone** (100, 500, 1000 views)
4. **First successful booking** (celebration)
5. **Review reminder** (after stay completion)
6. **Inactive account** (re-engagement campaign)
7. **Newsletter** (monthly platform updates)
8. **Referral invitation** (invite friends bonus)

## Testing

### Test Each Email
```bash
# In development, all emails log to console
# Check logs after triggering each event:

# 1. Welcome email
- Sign up new user

# 2. Subscription confirmation
- Complete checkout with test card (4242 4242 4242 4242)

# 3. Subscription cancelled
- Cancel subscription in settings

# 4. Payment failed
- Use test card 4000 0000 0000 0341 (declined)

# 5. Listing published
- Create a new listing
```

### Verify Delivery
1. Check Vercel logs for "✅ [Email type] sent"
2. Check Resend dashboard for delivery status
3. Check recipient inbox (and spam folder)

## Email Settings

### User Preferences (Future)
Allow users to control which emails they receive:
- [ ] Subscription updates (required)
- [ ] Payment notifications (required)
- [ ] New message notifications
- [ ] Listing activity updates
- [ ] Marketing emails
- [ ] Platform news

### Unsubscribe
All marketing emails should include unsubscribe link. Transactional emails (payments, account changes) cannot be unsubscribed.

## Performance

### Non-Blocking
All emails are wrapped in `.catch()` to prevent blocking main operations:
```typescript
sendWelcomeEmail(user).catch(err => {
  console.error('❌ Failed to send welcome email:', err);
});
```

### Error Handling
- Failed emails log errors but don't break user flows
- Stripe webhook always returns success even if email fails
- Resend API errors are logged with IDs for tracking

## Best Practices

### Email Content
- ✅ Clear subject lines
- ✅ Personal greeting (Hi [Name])
- ✅ Single clear CTA per email
- ✅ Mobile-responsive design
- ✅ Plain text alternative (handled by Resend)
- ✅ Accessible colors and contrast
- ✅ Professional tone with personality

### Technical
- ✅ All emails use HTML templates
- ✅ Inline CSS for compatibility
- ✅ Tested across email clients
- ✅ Proper error handling
- ✅ Logging for debugging
- ✅ Non-blocking execution

## Monitoring

### Key Metrics to Track
1. **Delivery rate** - % of emails successfully delivered
2. **Open rate** - % of emails opened
3. **Click-through rate** - % clicking CTAs
4. **Bounce rate** - % of failed deliveries
5. **Unsubscribe rate** - % unsubscribing

### Resend Dashboard
Monitor in Resend dashboard:
- Recent deliveries
- Failed sends
- Bounce reasons
- API usage

## Troubleshooting

### Email Not Sending
1. Check `RESEND_API_KEY` environment variable
2. Check Vercel logs for errors
3. Verify sender domain is verified in Resend
4. Check rate limits

### Email in Spam
1. Ensure SPF/DKIM/DMARC records configured
2. Avoid spam trigger words
3. Include unsubscribe link
4. Use verified sender domain
5. Maintain consistent sending patterns

### Wrong Email Content
1. Check user data in database
2. Verify template variables
3. Test with different scenarios
4. Check for missing fallbacks

## Next Steps

### Priority Implementations

1. **Add Cron Job for Trial Reminders**
   ```typescript
   // app/api/cron/trial-reminders/route.ts
   // Run daily, find users with trials ending in 2 days
   // Send trial ending email
   ```

2. **Integrate Verification Emails**
   ```typescript
   // When verification completes
   sendVerificationCompletedEmail(user, 'phone').catch(err => {
     console.error('Failed to send verification email:', err);
   });
   ```

3. **Add Message Notifications**
   ```typescript
   // When new message received
   sendMessageNotificationEmail(recipient, sender, preview, url).catch(err => {
     console.error('Failed to send message notification:', err);
   });
   ```

4. **User Email Preferences UI**
   - Add settings page for email preferences
   - Store preferences in database
   - Check preferences before sending non-critical emails

---

## Summary

Seasoners now has a robust email system covering all critical user touchpoints:
- ✅ **Onboarding** - Welcome new users
- ✅ **Subscriptions** - Confirm, cancel, payment issues
- ✅ **Listings** - Confirm publication
- 🔨 **Engagement** - Trial reminders, verifications, messages

All emails maintain consistent branding, provide clear actions, and enhance the user experience without being intrusive.

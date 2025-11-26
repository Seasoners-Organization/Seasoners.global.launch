# Seasoners Automated Email Strategy with Resend

## ✅ Currently Implemented

### Agreement Emails (Already Working)
- ✅ **Agreement Created** - When host creates agreement for guest
- ✅ **Agreement Request** - When guest requests agreement from host
- ✅ **Partially Signed** - When one party signs, notify the other
- ✅ **Fully Signed** - When both parties sign, celebrate!

### Authentication Emails (Already Working via NextAuth)
- ✅ **Magic Link Sign-in** - Email-based passwordless authentication
- ✅ **Email Verification** - Verify email address

---

## 🎯 Recommended Email Automations to Add

### 1. Welcome & Onboarding Series

#### A. Welcome Email (Priority: HIGH)
**Trigger:** New user signs up
**Send:** Immediately after registration
**Purpose:** Welcome, explain platform, guide next steps

**Content:**
- Welcome message
- "What is Seasoners?" explanation
- Quick start guide (complete profile, browse listings, etc.)
- Links to key pages (listings, profile, help)
- Trust & safety highlights

#### B. Profile Completion Reminder (Priority: MEDIUM)
**Trigger:** User signed up but profile <50% complete
**Send:** 24 hours after signup (if profile incomplete)
**Purpose:** Encourage profile completion for better matches

**Content:**
- Friendly reminder
- Benefits of complete profile
- Quick links to add: photo, bio, skills, availability
- Social proof (e.g., "Complete profiles get 3x more responses")

---

### 2. Listing Activity Emails

#### A. New Listing Published (Priority: HIGH)
**Trigger:** User successfully creates & publishes a listing
**Send:** Immediately after listing is verified
**Purpose:** Confirm listing is live, provide tips

**Content:**
- "Your listing is now live!"
- Link to view listing
- Tips for getting more views
- How to respond to inquiries
- Expected response time

#### B. Listing Received Interest (Priority: HIGH)
**Trigger:** Someone views/favorites a listing or sends message
**Send:** Immediately (or digest once per day)
**Purpose:** Drive host response, increase engagement

**Content:**
- "Someone is interested in your listing!"
- Viewer details (if available)
- Quick action buttons (respond, view profile)
- Response time stats ("Hosts who respond within 24h get 80% more bookings")

#### C. Listing Expiring Soon (Priority: MEDIUM)
**Trigger:** Listing hasn't been updated in 60 days
**Send:** 7 days before automatic de-listing
**Purpose:** Keep listings fresh and active

**Content:**
- "Is your listing still available?"
- One-click to confirm/refresh
- Edit listing button
- Archive if no longer available

---

### 3. Search & Discovery Emails

#### A. New Listings Match Your Profile (Priority: HIGH)
**Trigger:** New listing matches user's preferences/location
**Send:** Weekly digest or immediately (user preference)
**Purpose:** Re-engage searchers, increase applications

**Content:**
- "New opportunities in [Vienna]!"
- 3-5 curated listing cards
- Personalization: "Based on your ski instructor experience"
- CTA: "View all matches"

#### B. Saved Listing Update (Priority: MEDIUM)
**Trigger:** User saved/favorited listing that gets updated
**Send:** When listing price drops or availability changes
**Purpose:** Convert interest to action

**Content:**
- "Good news about [Listing]!"
- What changed (price, dates, etc.)
- Quick apply/contact button

---

### 4. Subscription & Billing Emails

#### A. Welcome to Early Bird (Priority: HIGH)
**Trigger:** User subscribes to Early Bird ($5)
**Send:** Immediately after payment
**Purpose:** Confirm subscription, explain benefits

**Content:**
- "Welcome to Seasoners Early Bird!"
- What's included
- Your price is locked forever
- Next steps
- Invoice/receipt

#### B. Subscription Confirmation (Priority: HIGH)
**Trigger:** User upgrades to Searcher ($7) or Lister ($12)
**Send:** Immediately after payment
**Purpose:** Confirm subscription, explain new features

**Content:**
- "Your subscription is active!"
- Plan details & features unlocked
- Billing cycle info
- How to manage subscription
- Invoice/receipt

#### C. Payment Failed (Priority: HIGH)
**Trigger:** Subscription payment fails
**Send:** Immediately, then 3 days later, then 7 days later
**Purpose:** Recover failed payments

**Content:**
- "Payment update needed"
- Why it matters (lose access in X days)
- Update payment method button
- Support contact

#### D. Subscription Expiring (Priority: MEDIUM)
**Trigger:** 7 days before subscription ends
**Send:** 7 days, 3 days, 1 day before expiry
**Purpose:** Retain subscribers

**Content:**
- "Your subscription ends soon"
- What you'll lose access to
- Renew now button
- Special offer (if applicable)

---

### 5. Trust & Safety Emails

#### A. Identity Verification Complete (Priority: MEDIUM)
**Trigger:** User completes ID verification
**Send:** Immediately after approval
**Purpose:** Celebrate milestone, encourage next step

**Content:**
- "You're verified! ✓"
- Trust score increased
- What this means (more visibility, trust)
- Next step: business verification (for hosts)

#### B. Trust Score Milestone (Priority: LOW)
**Trigger:** User reaches 50, 75, 100 trust score
**Send:** When milestone reached
**Purpose:** Gamification, encourage positive behavior

**Content:**
- "Congrats! You reached [X] trust score"
- What this unlocks
- How to increase further
- Share achievement

---

### 6. Communication & Response Emails

#### A. Message Received (Priority: HIGH)
**Trigger:** User receives message about listing/agreement
**Send:** Immediately (with throttling - max 1 per hour)
**Purpose:** Drive fast responses

**Content:**
- "New message from [Name]"
- Message preview
- Quick reply button
- "Respond within 24h for best results"

#### B. Unresponsive Warning (Priority: MEDIUM)
**Trigger:** User has pending messages >48h old
**Send:** 48 hours after message received
**Purpose:** Improve response rates

**Content:**
- "You have unread messages"
- Why response time matters
- List of pending conversations
- "Your reputation depends on it"

---

### 7. Re-engagement Emails

#### A. We Miss You (Priority: MEDIUM)
**Trigger:** User hasn't logged in for 30 days
**Send:** Day 30, then day 60
**Purpose:** Re-engage dormant users

**Content:**
- "What's new at Seasoners"
- New features
- New listings in their area
- Success stories
- Special offer (if applicable)

#### B. Complete Your Application (Priority: HIGH)
**Trigger:** User started listing application but didn't finish
**Send:** 24 hours after abandonment
**Purpose:** Recover abandoned actions

**Content:**
- "Finish your listing in 2 minutes"
- What's left to complete
- Why it's worth it
- Quick resume button

---

### 8. Community & Content Emails

#### A. Monthly Newsletter (Priority: LOW)
**Trigger:** Monthly schedule
**Send:** First Monday of each month
**Purpose:** Engagement, brand building

**Content:**
- Success stories
- New features
- Popular destinations
- Seasonal tips
- Platform updates

#### B. Seasonal Opportunities (Priority: MEDIUM)
**Trigger:** Seasonal (Winter, Summer)
**Send:** 2 months before season starts
**Purpose:** Drive seasonal activity

**Content:**
- "Winter season is coming!"
- Top ski resorts hiring
- Featured listings
- Early bird discounts
- How to prepare

---

## 🛠️ Implementation Priority

### Phase 1: Critical (Week 1-2)
1. ✅ Agreement emails (DONE)
2. Welcome email
3. Listing published confirmation
4. Message received notification
5. Subscription confirmation

### Phase 2: High Value (Week 3-4)
6. Listing interest notifications
7. New listings match profile
8. Payment failed recovery
9. Profile completion reminder

### Phase 3: Engagement (Week 5-6)
10. Trust score milestones
11. Re-engagement emails
12. Listing expiring warnings

### Phase 4: Polish (Week 7-8)
13. Seasonal campaigns
14. Newsletter
15. Saved listing updates

---

## 📧 Email Design Guidelines

### Sender Address
```
from: 'Seasoners <hello@seasoners.eu>'
```

### Tone & Voice
- **Friendly** - Human, not corporate
- **Trust-first** - Emphasize safety and transparency
- **Action-oriented** - Clear CTAs
- **Seasonal** - Reflect the community's vibe

### Template Structure
```html
<div style="max-width: 560px; margin: 0 auto;">
  <!-- Logo/Header -->
  <header>
    <!-- Seasoners logo -->
  </header>
  
  <!-- Main Content -->
  <main>
    <!-- Headline -->
    <!-- Body copy -->
    <!-- CTA Button -->
  </main>
  
  <!-- Footer -->
  <footer>
    <!-- Unsubscribe link -->
    <!-- Settings link -->
    <!-- Social links -->
  </footer>
</div>
```

### Color Palette
- **Primary:** `#0369a1` (Sky blue)
- **Success:** `#10b981` (Emerald)
- **Warning:** `#f59e0b` (Amber)
- **Danger:** `#ef4444` (Red)
- **Neutral:** `#64748b` (Slate)

---

## 🔧 Technical Setup

### Email Preferences
Add user preferences for email frequency:
```typescript
// Add to User model
emailPreferences: {
  marketing: boolean     // Newsletter, tips
  transactional: boolean // Always on (receipts, etc.)
  listings: boolean      // New matches
  messages: boolean      // New messages
  agreements: boolean    // Agreement updates
  frequency: 'immediate' | 'daily' | 'weekly'
}
```

### Unsubscribe Links
Every email must include:
```html
<a href="{{app_url}}/settings/email-preferences?token={{token}}">
  Manage email preferences
</a>
```

### Email Testing
Create dev API route for testing emails:
```
POST /api/dev/send-test-email
{
  "template": "welcome",
  "to": "your@email.com"
}
```

---

## 📊 Success Metrics

Track these metrics for each email type:
- **Open rate** (target: >25%)
- **Click-through rate** (target: >3%)
- **Conversion rate** (depends on goal)
- **Unsubscribe rate** (target: <0.5%)

---

## 🚀 Next Steps

1. **Set up custom domain for emails** (hello@seasoners.eu)
2. **Create email templates library**
3. **Implement user email preferences**
4. **Build Phase 1 emails**
5. **Add tracking & analytics**
6. **Test with real users**
7. **Iterate based on metrics**

Would you like me to start implementing any of these emails? I recommend starting with:
1. **Welcome email** (high impact, every user sees it)
2. **Listing published** (drives host engagement)
3. **Message received** (increases response rates)

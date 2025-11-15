# Trust Metrics System

## Overview
Seasoners' trust system is designed to reward genuine, human engagement—not just verification checkboxes. The system balances identity verification, behavioral consistency, and community contribution.

## Philosophy
> "Trust is earned through consistent, human actions—not just checkboxes."

Trust scores range from 0-100 and reflect a user's reliability, engagement, and reputation within the community.

## Trust Levels

| Score | Level | Icon | Description |
|-------|-------|------|-------------|
| 80-100 | Exceptional | 🌟 | Outstanding track record and community member |
| 60-79 | Trusted | ✓ | Reliable and verified community member |
| 30-59 | Establishing | → | Building reliability and trust |
| 0-29 | New | ○ | Getting started in the community |

## Trust Factors & Weights

### Verification (30% total)
- **Email Verified** (10 points) - Basic requirement for participation
- **Phone Verified** (10 points) - Additional security layer
- **Identity Verified** (10 points) - Government ID check via admin review

### Behavior & Engagement (40% total)
- **Response Rate** (15 points) - Percentage of inquiries answered within 24 hours
- **Profile Completeness** (10 points) - Bio (50+ chars), photo, phone, region, language
- **Agreement Completion** (15 points) - Signed agreements where both parties completed the stay (max at 5 agreements)

### Community Reputation (30% total)
- **Completed Stays** (12 points) - Successful stays without disputes (max at 10 stays)
- **Mutual Reviews** (10 points) - Reviews given AND received (encourages reciprocity)
- **Community Contribution** (8 points) - Stories shared, cultural notes added, helpful flags

## Implementation

### Core Files
- **`/utils/trust-metrics.js`** - Calculation engine, level mapping, suggestions
- **`/app/api/user/trust-score/route.ts`** - API endpoint for fetching/calculating score
- **`/components/TrustScoreDisplay.jsx`** - React component for profile display
- **Prisma schema** - Extended User model with trust metric fields

### Database Fields (User model)
```prisma
completedAgreements     Int      @default(0)
completedStays          Int      @default(0)
reviewsGivenCount       Int      @default(0)
reviewsReceivedCount    Int      @default(0)
storiesShared           Int      @default(0)
culturalNotesAdded      Int      @default(0)
helpfulFlags            Int      @default(0)
bio                     String?
preferredLanguage       String?
lastActivity            DateTime @default(now())
trustScoreLastCalculated DateTime?
```

### API Usage
**GET `/api/user/trust-score`**
- Requires authentication
- Returns current score, level, factor breakdown, and top 3 improvement suggestions
- Automatically updates `trustScore` field in database

**Response structure:**
```json
{
  "score": 67,
  "level": {
    "name": "Trusted",
    "color": "sky",
    "icon": "✓",
    "description": "Reliable and verified community member"
  },
  "factors": {
    "emailVerified": { "earned": 10, "max": 10 },
    "responseRate": { "earned": 12, "max": 15, "percentage": 80 },
    ...
  },
  "suggestions": [
    {
      "action": "Verify your phone number",
      "impact": 10,
      "priority": "high",
      "link": "/auth/verify"
    }
  ]
}
```

## Future Enhancements

### Scheduled Recalculation
- Run nightly job to recalculate scores for active users
- Apply inactivity decay (2 points/month after 6 months inactive)
- Update `lastActivity` on meaningful actions (listings, messages, reviews)

### Public Display
- Show simplified trust badge on listing cards
- Display full breakdown only on profile page
- Consider trust score in search ranking

### Gamification
- Achievement badges for milestones (first verified stay, 10 reviews, etc.)
- Progress notifications ("You're 8 points away from Trusted!")
- Community leaderboard (opt-in)

### Advanced Features
- ML-based fraud detection integrated into score
- Reputation recovery program for users with past issues
- Trust score "insurance" - verified hosts can offer guarantee backed by community fund

## Human-First Design Principles

1. **Transparency** - Users always know how their score is calculated
2. **Attainability** - New users can reach "Trusted" level through consistent action
3. **Fairness** - Balanced between verification (things you have) and behavior (what you do)
4. **Redemption** - Scores can improve; past mistakes don't define forever
5. **Community** - Rewards active participation and helping others

## Testing Recommendations

### Unit Tests
- Factor calculation accuracy
- Level threshold boundaries
- Suggestion priority sorting
- Inactivity decay edge cases

### Integration Tests
- API authentication & authorization
- Database update verification
- Edge cases (new user, max score user)

### Manual Testing
1. New user (score 0) → verify email → check score jumps to 10
2. Complete profile fields → verify incremental increases
3. Mock completed stays → verify score progression
4. Check suggestions update based on missing factors
5. Verify circular progress display renders correctly

## Maintenance

### When to Update Weights
- After 3 months of production data, analyze:
  - Which factors best predict successful stays
  - Whether weights align with community values
  - If any factor is too easy/hard to achieve

### Monitoring
Track:
- Distribution of scores across user base (aim for normal distribution)
- Correlation between trust score and successful transactions
- Time to reach each trust level
- Most common improvement suggestions clicked

---

**Created:** November 2025  
**Status:** Production Ready  
**Next Step:** Implement scheduled recalculation job

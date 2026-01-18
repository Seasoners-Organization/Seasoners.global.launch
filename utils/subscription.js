// Updated subscription tier pricing and features

export const SUBSCRIPTION_PLANS = {
  FREE: {
    tier: 'FREE',
    name: 'Free',
    price: 0,
    currency: 'EUR',
    features: [
      'Browse stays and jobs',
      'View listing details',
      'Create profile',
      '10 messages per month',
      '1 saved search',
      'Email verification badge',
    ],
    limitations: [
      'Limited to 10 outbound messages/month',
      'No instant alerts',
      'Limited saved searches (1)',
    ],
  },
  PLUS: {
    tier: 'PLUS',
    name: 'Searcher Plus',
    price: 9.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID,
    annualPrice: 79.00,
    annualPriceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_ANNUAL_PRICE_ID,
    currency: 'EUR',
    interval: 'month',
    features: [
      'All Free features',
      'Unlimited outbound messages',
      'Unlimited saved searches',
      'Instant email alerts',
      'Priority message indicator',
    ],
    cta: 'Upgrade to Plus',
  },
};

export const BOOST_PLANS = {
  BOOST_7: {
    name: '7-Day Featured Boost',
    price: 9.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_BOOST_7_PRICE_ID,
    currency: 'EUR',
    durationDays: 7,
    features: [
      'Featured at top of listings',
      'Increased visibility',
      '7 days duration',
    ],
  },
  BOOST_30: {
    name: '30-Day Featured Boost',
    price: 29.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_BOOST_30_PRICE_ID,
    currency: 'EUR',
    durationDays: 30,
    features: [
      'Featured at top of listings',
      'Maximum visibility',
      '30 days duration',
      'Best value',
    ],
  },
};

// Message quota for free users
export const FREE_MESSAGE_QUOTA = 10;

// Check if user has an active subscription
export function hasActiveSubscription(user) {
  if (!user) return false;
  
  // Early-bird one-time payment grants lifetime full access
  if (user.isEarlyBird && user.waitlistStatus === 'active') return true;

  return (
    user.subscriptionStatus === 'ACTIVE' &&
    user.subscriptionTier === 'PLUS' &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );
}

// Check if user can send messages (considering quota)
export function canSendMessages(user, currentMonthUsage = 0) {
  if (!user) return { allowed: false, reason: 'Not authenticated' };
  
  // Plus subscribers have unlimited messages
  if (hasActiveSubscription(user)) {
    return { allowed: true, unlimited: true };
  }
  
  // Free users have quota
  if (currentMonthUsage >= FREE_MESSAGE_QUOTA) {
    return { 
      allowed: false, 
      reason: 'Monthly message quota exceeded',
      quota: FREE_MESSAGE_QUOTA,
      used: currentMonthUsage,
    };
  }
  
  return { 
    allowed: true, 
    unlimited: false,
    quota: FREE_MESSAGE_QUOTA,
    used: currentMonthUsage,
    remaining: FREE_MESSAGE_QUOTA - currentMonthUsage,
  };
}

// Check if listing has active boost
export function hasActiveBoost(listing) {
  if (!listing) return false;
  
  return (
    listing.isFeatured &&
    listing.featuredUntil &&
    new Date(listing.featuredUntil) > new Date()
  );
}

// Get required tier for an action
export function getRequiredTier(action) {
  // For new model, all users can do everything (listings are free)
  // Only messages have quota for free users
  return 'FREE';
}

// Get plan details by tier
export function getPlanDetails(tier) {
  return SUBSCRIPTION_PLANS[tier] || SUBSCRIPTION_PLANS.FREE;
}

// Calculate month period start (first day of current month in UTC)
export function getCurrentPeriodStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

// Format period for display
export function formatPeriod(date) {
  return date.toISOString().substring(0, 7); // YYYY-MM
}

// BACKWARDS COMPATIBILITY FUNCTIONS
// These maintain compatibility with old code that checks subscription tiers

// Check if user can contact sellers (deprecated - kept for compatibility)
// In new model, FREE users can contact (with quota), so this returns true
export function canContactSellers(user) {
  // Everyone can contact, free users just have quota
  return true;
}

// Check if user can create listings (deprecated - kept for compatibility)
// In new model, listing creation is FREE for everyone
export function canCreateListings(user) {
  // Listing creation is free for everyone
  return true;
}

// Format subscription status (deprecated - kept for compatibility)
export function formatSubscriptionStatus(status) {
  const statusMap = {
    'ACTIVE': 'Active',
    'CANCELLED': 'Cancelled',
    'EXPIRED': 'Expired',
    'PAST_DUE': 'Past Due',
  };
  return statusMap[status] || status;
}

// Format expiry date (deprecated - kept for compatibility)
export function formatExpiryDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

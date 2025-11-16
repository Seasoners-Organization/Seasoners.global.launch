// Subscription tier pricing and features

export const SUBSCRIPTION_PLANS = {
  FREE: {
    tier: 'FREE',
    name: 'Free',
    price: 0,
    currency: 'EUR',
    features: [
      'Browse jobs and stays',
      'View listings',
      'Basic search and filters',
    ],
    limitations: [
      'Cannot contact sellers',
      'Cannot create listings',
    ],
  },
  SEARCHER: {
    tier: 'SEARCHER',
    name: 'Searcher',
    price: 7,
    priceId: process.env.NEXT_PUBLIC_STRIPE_SEARCHER_PRICE_ID,
    currency: 'EUR',
    interval: 'month',
    features: [
      'All Free features',
      'Contact sellers and employers',
      'Direct messaging',
      'Save favorites',
      'Email notifications',
    ],
    cta: 'Upgrade to contact sellers',
  },
  LISTER: {
    tier: 'LISTER',
    name: 'Lister',
    price: 12,
    priceId: process.env.NEXT_PUBLIC_STRIPE_LISTER_PRICE_ID,
    currency: 'EUR',
    interval: 'month',
    features: [
      'All Searcher features',
      'Create unlimited listings',
      'Post jobs and stays',
      'Receive applications',
      'Priority support',
      'Analytics dashboard',
    ],
    cta: 'Upgrade to create listings',
  },
};

// Check if user has an active subscription
export function hasActiveSubscription(user) {
  if (!user) return false;
  // Early-bird one-time payment grants lifetime full access independent of subscription fields.
  if (user.isEarlyBird && user.waitlistStatus === 'active') return true;

  return (
    user.subscriptionStatus === 'ACTIVE' &&
    user.subscriptionTier !== 'FREE' &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );
}

// Check if user can contact sellers (SEARCHER or LISTER tier)
export function canContactSellers(user) {
  if (!user) return false;
  // Early-bird users have full platform access.
  if (user.isEarlyBird && user.waitlistStatus === 'active') return true;

  return (
    hasActiveSubscription(user) &&
    (user.subscriptionTier === 'SEARCHER' || user.subscriptionTier === 'LISTER')
  );
}

// Check if user can create listings (LISTER tier only)
export function canCreateListings(user) {
  if (!user) return false;
  // Early-bird grants creation capability.
  if (user.isEarlyBird && user.waitlistStatus === 'active') return true;

  return (
    hasActiveSubscription(user) &&
    user.subscriptionTier === 'LISTER'
  );
}

// Get required tier for an action
export function getRequiredTier(action) {
  const tierMap = {
    'contact': 'SEARCHER',
    'create_listing': 'LISTER',
    'message': 'SEARCHER',
    'apply': 'SEARCHER',
  };
  
  return tierMap[action] || 'FREE';
}

// Get subscription plan details by tier
export function getPlanByTier(tier) {
  return SUBSCRIPTION_PLANS[tier] || SUBSCRIPTION_PLANS.FREE;
}

// Check if subscription is expiring soon (within 7 days)
export function isSubscriptionExpiringSoon(user) {
  if (!user?.subscriptionExpiresAt) return false;
  
  const expiryDate = new Date(user.subscriptionExpiresAt);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
}

// Format subscription status for display
export function formatSubscriptionStatus(status) {
  const statusMap = {
    'ACTIVE': 'Active',
    'CANCELLED': 'Cancelled',
    'EXPIRED': 'Expired',
    'PAST_DUE': 'Past Due',
  };
  
  return statusMap[status] || status;
}

// Format subscription expiry date
export function formatExpiryDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Trust Metrics System
 * 
 * Philosophy: Trust is earned through consistent, human actions—not just checkboxes.
 * This system rewards quality interactions, responsiveness, and community contribution.
 * 
 * Trust Score Range: 0-100
 * - 0-29: New / Building Trust
 * - 30-59: Establishing Reliability  
 * - 60-79: Trusted Community Member
 * - 80-100: Exceptional Track Record
 */

/**
 * Trust Factor Weights (total = 100)
 * Simplified to easily achievable metrics
 */
export const TRUST_WEIGHTS = {
  // Identity & Verification (50% total)
  emailVerified: 15,           // Basic requirement
  phoneVerified: 15,           // Security layer
  identityVerified: 20,        // Government ID check
  
  // Profile & Listings (40% total)
  profileCompleteness: 15,     // Full bio, photo, details
  hasStayListing: 10,          // Posted at least 1 stay listing
  hasJobListing: 15,           // Posted at least 1 job listing
  
  // Engagement (10% total)
  responseRate: 10,            // How quickly/consistently they respond
};

/**
 * Calculate trust score for a user
 * @param {Object} user - User object with relevant fields
 * @returns {number} Trust score (0-100)
 */
export function calculateTrustScore(user) {
  let score = 0;
  const factors = {};

  // === VERIFICATION FACTORS (50 points max) ===
  
  // Email verified (15 points)
  if (user.emailVerified) {
    score += TRUST_WEIGHTS.emailVerified;
    factors.emailVerified = { earned: TRUST_WEIGHTS.emailVerified, max: TRUST_WEIGHTS.emailVerified };
  } else {
    factors.emailVerified = { earned: 0, max: TRUST_WEIGHTS.emailVerified };
  }

  // Phone verified (15 points)
  if (user.phoneVerified) {
    score += TRUST_WEIGHTS.phoneVerified;
    factors.phoneVerified = { earned: TRUST_WEIGHTS.phoneVerified, max: TRUST_WEIGHTS.phoneVerified };
  } else {
    factors.phoneVerified = { earned: 0, max: TRUST_WEIGHTS.phoneVerified };
  }

  // Identity verified (20 points)
  if (user.identityVerified) {
    score += TRUST_WEIGHTS.identityVerified;
    factors.identityVerified = { earned: TRUST_WEIGHTS.identityVerified, max: TRUST_WEIGHTS.identityVerified };
  } else {
    factors.identityVerified = { earned: 0, max: TRUST_WEIGHTS.identityVerified };
  }

  // === PROFILE & LISTING FACTORS (40 points max) ===

  // Profile completeness (15 points)
  // 1 point per field: name, bio, photo, phone, region, language
  const completenessFields = [
    user.name,
    user.bio && user.bio.length > 50,
    user.image,
    user.phone,
    user.region,
    user.preferredLanguage
  ];
  const completenessRatio = completenessFields.filter(Boolean).length / completenessFields.length;
  const completenessPoints = Math.round(completenessRatio * TRUST_WEIGHTS.profileCompleteness);
  score += completenessPoints;
  factors.profileCompleteness = {
    earned: completenessPoints,
    max: TRUST_WEIGHTS.profileCompleteness,
    percentage: Math.round(completenessRatio * 100)
  };

  // Has stay listing (10 points)
  const hasStayListing = user.hasStayListing ?? false;
  if (hasStayListing) {
    score += TRUST_WEIGHTS.hasStayListing;
    factors.hasStayListing = { earned: TRUST_WEIGHTS.hasStayListing, max: TRUST_WEIGHTS.hasStayListing };
  } else {
    factors.hasStayListing = { earned: 0, max: TRUST_WEIGHTS.hasStayListing };
  }

  // Has job listing (15 points)
  const hasJobListing = user.hasJobListing ?? false;
  if (hasJobListing) {
    score += TRUST_WEIGHTS.hasJobListing;
    factors.hasJobListing = { earned: TRUST_WEIGHTS.hasJobListing, max: TRUST_WEIGHTS.hasJobListing };
  } else {
    factors.hasJobListing = { earned: 0, max: TRUST_WEIGHTS.hasJobListing };
  }

  // === ENGAGEMENT FACTORS (10 points max) ===

  // Response rate (10 points)
  const responseRate = user.responseRate ?? 0;
  const responsePoints = Math.round(responseRate * TRUST_WEIGHTS.responseRate);
  score += responsePoints;
  factors.responseRate = { 
    earned: responsePoints, 
    max: TRUST_WEIGHTS.responseRate,
    percentage: Math.round(responseRate * 100)
  };
  // === FINAL SCORE ===
  
  // Cap score at 100
  score = Math.min(score, 100);

  return {
    score: Math.round(score),
    level: getTrustLevel(score),
    factors,
    lastCalculated: new Date().toISOString()
  };
}

/**
 * Get human-readable trust level
 * @param {number} score - Trust score (0-100)
 * @returns {Object} Level info
 */
export function getTrustLevel(score) {
  if (score >= 80) {
    return {
      name: 'Exceptional',
      color: 'emerald',
      icon: '🌟',
      description: 'Outstanding track record and community member'
    };
  }
  if (score >= 60) {
    return {
      name: 'Trusted',
      color: 'sky',
      icon: '✓',
      description: 'Reliable and verified community member'
    };
  }
  if (score >= 30) {
    return {
      name: 'Establishing',
      color: 'amber',
      icon: '→',
      description: 'Building reliability and trust'
    };
  }
  return {
    name: 'New',
    color: 'slate',
    icon: '○',
    description: 'Getting started in the community'
  };
}

/**
 * Get suggestions for improving trust score
 * @param {Object} factors - Trust factors from calculateTrustScore
 * @returns {Array} Suggestions sorted by impact
 */
export function getTrustSuggestions(factors) {
  const suggestions = [];

  // Verification suggestions (highest impact)
  if (factors.emailVerified.earned === 0) {
    suggestions.push({
      action: 'Verify your email address',
      impact: factors.emailVerified.max,
      priority: 'high',
      link: '/auth/verify'
    });
  }
  if (factors.phoneVerified.earned === 0) {
    suggestions.push({
      action: 'Verify your phone number',
      impact: factors.phoneVerified.max,
      priority: 'high',
      link: '/auth/verify'
    });
  }
  if (factors.identityVerified.earned === 0) {
    suggestions.push({
      action: 'Submit government ID for verification',
      impact: factors.identityVerified.max,
      priority: 'high',
      link: '/auth/verify'
    });
  }

  // Profile completeness
  if (factors.profileCompleteness.earned < factors.profileCompleteness.max) {
    const missing = factors.profileCompleteness.max - factors.profileCompleteness.earned;
    suggestions.push({
      action: 'Complete your profile (bio, photo, details)',
      impact: missing,
      priority: 'medium',
      link: '/profile'
    });
  }

  // Listing suggestions
  if (factors.hasStayListing && factors.hasStayListing.earned === 0) {
    suggestions.push({
      action: 'List at least one stay',
      impact: factors.hasStayListing.max,
      priority: 'medium',
      link: '/list'
    });
  }

  if (factors.hasJobListing && factors.hasJobListing.earned === 0) {
    suggestions.push({
      action: 'List at least one job',
      impact: factors.hasJobListing.max,
      priority: 'medium',
      link: '/list'
    });
  }

  // Response rate
  if (factors.responseRate && factors.responseRate.percentage < 80) {
    suggestions.push({
      action: 'Respond to inquiries within 24 hours',
      impact: factors.responseRate.max - factors.responseRate.earned,
      priority: 'low',
      link: null
    });
  }

  // Sort by priority then impact
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return suggestions.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.impact - a.impact;
  });
}

/**
 * Decay trust score over time for inactivity
 * Applied in scheduled jobs - reduces score if no activity in 6+ months
 * @param {number} currentScore - Current trust score
 * @param {Date} lastActivity - Last meaningful activity date
 * @returns {number} Adjusted score
 */
export function applyInactivityDecay(currentScore, lastActivity) {
  const monthsInactive = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsInactive < 6) return currentScore;
  
  // Decay 2 points per month after 6 months, min 30% of original
  const decayPoints = Math.floor((monthsInactive - 6) * 2);
  const minScore = Math.floor(currentScore * 0.3);
  
  return Math.max(currentScore - decayPoints, minScore);
}

/**
 * Export all utilities
 */
export default {
  calculateTrustScore,
  getTrustLevel,
  getTrustSuggestions,
  applyInactivityDecay,
  TRUST_WEIGHTS
};

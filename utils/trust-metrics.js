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
 * Balanced to reward both verification AND active community participation
 */
export const TRUST_WEIGHTS = {
  // Identity & Verification (30% total)
  emailVerified: 10,           // Basic requirement
  phoneVerified: 10,           // Security layer
  identityVerified: 10,        // Government ID check
  
  // Behavioral & Engagement (40% total)
  responseRate: 15,            // How quickly/consistently they respond
  profileCompleteness: 10,     // Full bio, photo, details
  agreementCompletion: 15,     // Signed agreements with fair terms
  
  // Community Reputation (30% total)
  completedStays: 12,          // Successful stays without issues
  mutualReviews: 10,           // Two-way reviews (both gave & received)
  communityContribution: 8,    // Stories shared, cultural notes, helpful engagement
};

/**
 * Calculate trust score for a user
 * @param {Object} user - User object with relevant fields
 * @returns {number} Trust score (0-100)
 */
export function calculateTrustScore(user) {
  let score = 0;
  const factors = {};

  // === VERIFICATION FACTORS (30 points max) ===
  
  // Email verified (10 points)
  if (user.emailVerified) {
    score += TRUST_WEIGHTS.emailVerified;
    factors.emailVerified = { earned: TRUST_WEIGHTS.emailVerified, max: TRUST_WEIGHTS.emailVerified };
  } else {
    factors.emailVerified = { earned: 0, max: TRUST_WEIGHTS.emailVerified };
  }

  // Phone verified (10 points)
  if (user.phoneVerified) {
    score += TRUST_WEIGHTS.phoneVerified;
    factors.phoneVerified = { earned: TRUST_WEIGHTS.phoneVerified, max: TRUST_WEIGHTS.phoneVerified };
  } else {
    factors.phoneVerified = { earned: 0, max: TRUST_WEIGHTS.phoneVerified };
  }

  // Identity verified (10 points)
  if (user.identityVerified) {
    score += TRUST_WEIGHTS.identityVerified;
    factors.identityVerified = { earned: TRUST_WEIGHTS.identityVerified, max: TRUST_WEIGHTS.identityVerified };
  } else {
    factors.identityVerified = { earned: 0, max: TRUST_WEIGHTS.identityVerified };
  }

  // === BEHAVIORAL FACTORS (40 points max) ===

  // Response rate (15 points)
  // Calculated as: (responses within 24h / total inquiries received) * weight
  const responseRate = user.responseRate ?? 0; // 0-1 decimal
  const responsePoints = Math.round(responseRate * TRUST_WEIGHTS.responseRate);
  score += responsePoints;
  factors.responseRate = { 
    earned: responsePoints, 
    max: TRUST_WEIGHTS.responseRate,
    percentage: Math.round(responseRate * 100)
  };

  // Profile completeness (10 points)
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

  // Agreement completion (15 points)
  // Signed agreements with both parties completing the stay
  const agreementCount = user.completedAgreements ?? 0;
  const agreementPoints = Math.min(
    Math.round((agreementCount / 5) * TRUST_WEIGHTS.agreementCompletion), // Full points at 5 agreements
    TRUST_WEIGHTS.agreementCompletion
  );
  score += agreementPoints;
  factors.agreementCompletion = {
    earned: agreementPoints,
    max: TRUST_WEIGHTS.agreementCompletion,
    count: agreementCount
  };

  // === REPUTATION FACTORS (30 points max) ===

  // Completed stays (12 points)
  // Stays where both parties marked as successful, no disputes
  const stayCount = user.completedStays ?? 0;
  const stayPoints = Math.min(
    Math.round((stayCount / 10) * TRUST_WEIGHTS.completedStays), // Full points at 10 stays
    TRUST_WEIGHTS.completedStays
  );
  score += stayPoints;
  factors.completedStays = {
    earned: stayPoints,
    max: TRUST_WEIGHTS.completedStays,
    count: stayCount
  };

  // Mutual reviews (10 points)
  // Reviews given AND received (both directions matter)
  const reviewsGiven = user.reviewsGiven ?? 0;
  const reviewsReceived = user.reviewsReceived ?? 0;
  const mutualReviewRatio = reviewsReceived > 0 
    ? Math.min(reviewsGiven / reviewsReceived, 1) 
    : 0;
  const reviewPoints = Math.round(mutualReviewRatio * TRUST_WEIGHTS.mutualReviews);
  score += reviewPoints;
  factors.mutualReviews = {
    earned: reviewPoints,
    max: TRUST_WEIGHTS.mutualReviews,
    given: reviewsGiven,
    received: reviewsReceived
  };

  // Community contribution (8 points)
  // Stories shared, cultural notes added, helpful flags
  const storiesShared = user.storiesShared ?? 0;
  const culturalNotes = user.culturalNotesAdded ?? 0;
  const helpfulFlags = user.helpfulFlags ?? 0;
  const contributionScore = Math.min(storiesShared + culturalNotes + (helpfulFlags / 5), 5);
  const contributionPoints = Math.round((contributionScore / 5) * TRUST_WEIGHTS.communityContribution);
  score += contributionPoints;
  factors.communityContribution = {
    earned: contributionPoints,
    max: TRUST_WEIGHTS.communityContribution,
    stories: storiesShared,
    notes: culturalNotes,
    helpful: helpfulFlags
  };

  return {
    score: Math.min(Math.round(score), 100), // Cap at 100
    factors,
    level: getTrustLevel(score),
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

  // Engagement suggestions
  if (factors.responseRate.percentage < 80) {
    suggestions.push({
      action: 'Respond to inquiries within 24 hours',
      impact: factors.responseRate.max - factors.responseRate.earned,
      priority: 'medium',
      link: null
    });
  }

  // Agreement & stays
  if (factors.agreementCompletion.count < 5) {
    suggestions.push({
      action: 'Complete stays with signed agreements',
      impact: factors.agreementCompletion.max - factors.agreementCompletion.earned,
      priority: 'medium',
      link: '/agreement'
    });
  }

  // Reviews
  if (factors.mutualReviews.given < factors.mutualReviews.received) {
    suggestions.push({
      action: 'Leave reviews for your past stays',
      impact: factors.mutualReviews.max - factors.mutualReviews.earned,
      priority: 'low',
      link: null
    });
  }

  // Community contribution
  if (factors.communityContribution.earned < factors.communityContribution.max) {
    suggestions.push({
      action: 'Share your story or add cultural notes',
      impact: factors.communityContribution.max - factors.communityContribution.earned,
      priority: 'low',
      link: '/about'
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

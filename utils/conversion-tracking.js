// Conversion tracking utility
// Tracks user journey through registration, email verification, listing creation

export function trackConversionEvent(eventName, data = {}) {
  try {
    // Send to analytics endpoint
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data);
    }

    // Also store in localStorage for backend analysis
    const events = JSON.parse(localStorage.getItem('conversionEvents') || '[]');
    events.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...data,
    });
    localStorage.setItem('conversionEvents', JSON.stringify(events.slice(-50))); // Keep last 50
  } catch (error) {
    console.error('Failed to track conversion event:', error);
  }
}

export const ConversionEvents = {
  // Registration funnel
  REGISTRATION_STARTED: 'registration_started',
  REGISTRATION_STEP_1_COMPLETED: 'registration_step_1_completed',
  REGISTRATION_STEP_2_COMPLETED: 'registration_step_2_completed',
  REGISTRATION_COMPLETED: 'registration_completed',
  
  // Email verification
  EMAIL_VERIFICATION_SENT: 'email_verification_sent',
  EMAIL_VERIFIED: 'email_verified',
  EMAIL_VERIFICATION_SKIPPED: 'email_verification_skipped',

  // Listing creation
  LISTING_CREATION_STARTED: 'listing_creation_started',
  LISTING_PUBLISHED: 'listing_published',
  PHONE_VERIFICATION_PROMPTED: 'phone_verification_prompted',
  PHONE_VERIFIED: 'phone_verified',

  // Engagement
  LISTING_BROWSED: 'listing_browsed',
  MESSAGE_SENT: 'message_sent',
  PROFILE_VIEWED: 'profile_viewed',

  // Subscription
  UPGRADE_PROMPTED: 'upgrade_prompted',
  UPGRADE_COMPLETED: 'upgrade_completed',

  // Exit intent
  EXIT_INTENT_SHOWN: 'exit_intent_shown',
  EXIT_INTENT_CLICKED: 'exit_intent_clicked',
};

export function getConversionFunnel() {
  try {
    const events = JSON.parse(localStorage.getItem('conversionEvents') || '[]');
    return events;
  } catch {
    return [];
  }
}

export function clearConversionEvents() {
  try {
    localStorage.removeItem('conversionEvents');
  } catch {
    // Ignore
  }
}

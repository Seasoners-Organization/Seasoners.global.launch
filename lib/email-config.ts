/**
 * Centralized Email Configuration
 * 
 * All email addresses and settings are managed here for easy updates.
 * Uses environment variables with sensible fallbacks.
 */

export const EMAIL_CONFIG = {
  // Sender configuration
  from: {
    default: process.env.EMAIL_FROM || 'Seasoners <noreply@seasoners.eu>',
    support: process.env.EMAIL_FROM_SUPPORT || 'Seasoners Support <support@seasoners.eu>',
    founder: process.env.EMAIL_FROM_FOUNDER || 'Tremayne Chivers <tremayne@seasoners.eu>',
  },

  // Reply-to addresses
  replyTo: {
    support: process.env.EMAIL_REPLY_TO_SUPPORT || 'support@seasoners.eu',
    founder: process.env.EMAIL_REPLY_TO_FOUNDER || 'tremayne@seasoners.eu',
  },

  // Email types mapping
  types: {
    welcome: {
      from: 'default',
      replyTo: 'founder',
    },
    listingPublished: {
      from: 'default',
      replyTo: 'support',
    },
    messageNotification: {
      from: 'default',
      replyTo: 'support',
    },
    subscription: {
      from: 'default',
      replyTo: 'support',
    },
    agreement: {
      from: 'default',
      replyTo: 'support',
    },
    verification: {
      from: 'default',
      replyTo: 'support',
    },
    admin: {
      from: 'default',
      replyTo: 'support',
    },
  },
} as const;

/**
 * Get email configuration for a specific email type
 */
export function getEmailConfig(type: keyof typeof EMAIL_CONFIG.types) {
  const config = EMAIL_CONFIG.types[type];
  return {
    from: EMAIL_CONFIG.from[config.from],
    replyTo: EMAIL_CONFIG.replyTo[config.replyTo],
  };
}

/**
 * Validate email configuration
 */
export function validateEmailConfig() {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check if using custom domain
  if (EMAIL_CONFIG.from.default.includes('onboarding@resend.dev')) {
    warnings.push('Using Resend test domain. Configure EMAIL_FROM env var for production.');
  }

  // Check reply-to addresses
  if (!process.env.EMAIL_REPLY_TO_SUPPORT) {
    warnings.push('EMAIL_REPLY_TO_SUPPORT not set. Using default: support@seasoners.eu');
  }

  if (!process.env.EMAIL_REPLY_TO_FOUNDER) {
    warnings.push('EMAIL_REPLY_TO_FOUNDER not set. Using default: tremayne@seasoners.eu');
  }

  // Check Resend API key
  if (!process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY not set. Email sending will fail.');
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

import { getResend } from '@/lib/resend';
import { getEmailConfig } from '@/lib/email-config';

// ============================================================================
// SHARED EMAIL COMPONENTS
// ============================================================================

/**
 * Generate founder signature for personal touch in all emails
 */
function generateFounderSignature() {
  return `
    <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 32px 0;">
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        If you have any questions or need help getting started, don't hesitate to reach out. 
        I read every message personally.
      </p>
      <p style="margin: 0 0 4px 0; font-size: 15px; color: #334155;">
        <strong>Warm regards,</strong>
      </p>
      <p style="margin: 0 0 2px 0; font-size: 16px; font-weight: 600; color: #0369a1;">
        Tremayne Chivers
      </p>
      <p style="margin: 0; font-size: 14px; color: #64748b;">
        Founder, Seasoners<br>
        <a href="mailto:tremayne@seasoners.eu" style="color: #0369a1; text-decoration: none;">tremayne@seasoners.eu</a>
      </p>
    </div>
  `;
}

/**
 * Generate email logo header
 */
function generateLogoHeader(appUrl) {
  return `
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="${appUrl}/Seasoners_logo.png" 
           alt="Seasoners Logo" 
           style="max-width: 200px; height: auto; margin-bottom: 16px;"
           width="200" />
    </div>
  `;
}

// ============================================================================
// EMAIL SENDING FUNCTIONS
// ============================================================================

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(user) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendWelcomeEmail');
      return;
    }

    const emailConfig = getEmailConfig('welcome');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: user.email,
      subject: 'Welcome to Seasoners! 🏔️',
      html: generateWelcomeEmail(user, appUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend welcome email error:', (result as any).error);
    } else {
      console.log('✅ Welcome email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

/**
 * Send listing published confirmation email
 */
export async function sendListingPublishedEmail(listing, user) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const listingUrl = `${appUrl}/listings/${listing.id}`;

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendListingPublishedEmail');
      return;
    }

    const emailConfig = getEmailConfig('listingPublished');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: user.email,
      subject: `Your listing is now live: ${listing.title}`,
      html: generateListingPublishedEmail(listing, user, listingUrl, appUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend listing published email error:', (result as any).error);
    } else {
      console.log('✅ Listing published email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send listing published email:', error);
  }
}

/**
 * Send message notification email
 */
export async function sendMessageNotificationEmail(recipient, sender, messagePreview, conversationUrl) {
  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendMessageNotificationEmail');
      return;
    }

    const emailConfig = getEmailConfig('messageNotification');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: recipient.email,
      subject: `New message from ${sender.name || 'a Seasoner'}`,
      html: generateMessageNotificationEmail(recipient, sender, messagePreview, conversationUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend message notification email error:', (result as any).error);
    } else {
      console.log('✅ Message notification email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send message notification email:', error);
  }
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(user, subscription) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendSubscriptionConfirmationEmail');
      return;
    }

    const emailConfig = getEmailConfig('subscription');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: user.email,
      subject: `Welcome to ${subscription.tier} Plan! 🎉`,
      html: generateSubscriptionConfirmationEmail(user, subscription, appUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend subscription confirmation email error:', (result as any).error);
    } else {
      console.log('✅ Subscription confirmation email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Generate welcome email HTML
 */
function generateWelcomeEmail(user, appUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0369a1; font-size: 32px; font-weight: 700; margin: 0 0 8px 0;">
            Welcome to Seasoners!
          </h1>
          <p style="color: #64748b; font-size: 16px; margin: 0;">
            We're excited to have you join our community
          </p>
        </div>

        <!-- Main Content -->
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Hi ${user.name || 'there'} 👋
          </p>
          
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Welcome to <strong>Seasoners</strong> — the platform connecting seasonal workers with opportunities 
            in Europe's most beautiful locations. Whether you're looking for your next adventure or seeking 
            reliable seasonal staff, you're in the right place.
          </p>

          <div style="background: #f0f9ff; border-left: 4px solid #0369a1; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #0369a1;">
              🎯 Getting Started
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
              <li><strong>Complete your profile</strong> — Add a photo, bio, and skills to stand out</li>
              <li><strong>Browse opportunities</strong> — Find jobs, accommodation, and flatshares</li>
              <li><strong>Build trust</strong> — Verify your identity for better visibility</li>
              <li><strong>Connect safely</strong> — Use our Smart Stay Agreements for peace of mind</li>
            </ul>
          </div>

          <p style="margin: 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            <strong>What makes Seasoners different?</strong>
          </p>
          <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
            <li><strong>Trust-first approach</strong> — Identity verification, trust scores, and transparent agreements</li>
            <li><strong>Built for seasonals</strong> — We understand the unique needs of seasonal work</li>
            <li><strong>Community-driven</strong> — Real people, real experiences, real opportunities</li>
          </ul>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${appUrl}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
                      color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px;
                      font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3); margin-bottom: 12px;">
              Complete Your Profile
            </a>
            <br />
            <a href="${appUrl}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                      color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px;
                      font-weight: 600; font-size: 15px; margin-top: 12px;">
              Verify your phone number
            </a>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}/stays" style="color: #0369a1; text-decoration: none; font-weight: 500; margin: 0 12px;">Browse Stays</a>
            <span style="color: #cbd5e1;">•</span>
            <a href="${appUrl}/jobs" style="color: #0369a1; text-decoration: none; font-weight: 500; margin: 0 12px;">Browse Jobs</a>
            <span style="color: #cbd5e1;">•</span>
            <a href="${appUrl}/flatshares" style="color: #0369a1; text-decoration: none; font-weight: 500; margin: 0 12px;">Find Flatshares</a>
          </div>
        </div>

        <!-- Trust & Safety -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #334155;">
            🛡️ Your Safety Matters
          </h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
            We've built Seasoners with trust and safety at the core. All users can verify their identity, 
            listings are reviewed, and our Smart Stay Agreements provide legal clarity. If something doesn't 
            feel right, trust your instincts and reach out to our support team.
          </p>
        </div>

        <!-- Founder Signature -->
        ${generateFounderSignature()}

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
            Need help? We're here for you.
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px;">
            <a href="${appUrl}/about" style="color: #0369a1; text-decoration: none; margin: 0 8px;">About Us</a>
            <span style="color: #cbd5e1;">•</span>
            <a href="${appUrl}/help" style="color: #0369a1; text-decoration: none; margin: 0 8px;">Help Center</a>
            <span style="color: #cbd5e1;">•</span>
            <a href="${appUrl}/settings" style="color: #0369a1; text-decoration: none; margin: 0 8px;">Settings</a>
          </p>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners. Building trust across borders.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate listing published email HTML
 */
function generateListingPublishedEmail(listing, user, listingUrl, appUrl) {
  const listingType = listing.type === 'JOB' ? 'Job' : listing.type === 'STAY' ? 'Stay' : 'Flatshare';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
          <h1 style="color: #10b981; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
            Your Listing is Live!
          </h1>
          <p style="color: #64748b; font-size: 15px; margin: 0;">
            ${listingType} listing published successfully
          </p>
        </div>

        <!-- Listing Card -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #10b981;">
              ${listing.title}
            </h2>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">
              📍 ${listing.city ? `${listing.city}, ${listing.region}` : listing.location}
            </p>
            <p style="margin: 0; font-size: 14px; color: #475569;">
              💰 €${listing.price}${listing.type === 'JOB' ? '/month' : listing.type === 'STAY' ? '/night' : '/month'}
            </p>
          </div>

          <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Hi ${user.name || 'there'},
          </p>
          
          <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Great news! Your listing <strong>"${listing.title}"</strong> is now live on Seasoners. 
            People searching for ${listingType.toLowerCase()}s in ${listing.city || listing.location} can now see it.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${listingUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                      color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px;
                      font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              View Your Listing
            </a>
          </div>
        </div>

        <!-- Tips Section -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #334155;">
            💡 Tips for Success
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
            <li><strong>Respond quickly</strong> — Listings with fast response times get 3x more interest</li>
            <li><strong>Add great photos</strong> — Listings with photos get 5x more views</li>
            <li><strong>Be detailed</strong> — Clear descriptions reduce back-and-forth questions</li>
            <li><strong>Stay active</strong> — Update your listing regularly to stay at the top</li>
          </ul>
        </div>

        <!-- Next Steps -->
        <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #f59e0b;">
            📬 What Happens Next?
          </h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #78350f;">
            We'll notify you by email when someone shows interest in your listing. You can also check 
            your <a href="${appUrl}/listings" style="color: #f59e0b; text-decoration: underline;">dashboard</a> 
            anytime to see views and messages.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">
            Questions? Reply to this email or visit our 
            <a href="${appUrl}/help" style="color: #0369a1; text-decoration: none;">Help Center</a>
          </p>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners. Connecting seasonal workers worldwide.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate message notification email HTML
 */
function generateMessageNotificationEmail(recipient, sender, messagePreview, conversationUrl) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">💬</div>
          <h1 style="color: #0369a1; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
            New Message
          </h1>
          <p style="color: #64748b; font-size: 15px; margin: 0;">
            ${sender.name || 'Someone'} sent you a message
          </p>
        </div>

        <!-- Message Card -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            ${sender.image 
              ? `<img src="${sender.image}" alt="${sender.name}" style="width: 48px; height: 48px; border-radius: 50%; margin-right: 12px;">` 
              : `<div style="width: 48px; height: 48px; border-radius: 50%; background: #e0f2fe; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 20px;">👤</div>`
            }
            <div>
              <p style="margin: 0; font-weight: 600; font-size: 16px; color: #334155;">
                ${sender.name || 'A Seasoner'}
              </p>
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                Just now
              </p>
            </div>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
              "${messagePreview}"
            </p>
          </div>

          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
            💡 <strong>Quick responses matter!</strong> Reply within 24 hours to keep the conversation going 
            and build trust with ${sender.name || 'them'}.
          </p>

          <div style="text-align: center;">
            <a href="${conversationUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
                      color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px;
                      font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);">
              Reply Now
            </a>
          </div>
        </div>

        <!-- Tip -->
        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #64748b; text-align: center;">
            📧 You can adjust your email notification preferences in 
            <a href="${conversationUrl.split('/messages')[0]}/settings" style="color: #0369a1; text-decoration: none;">Settings</a>
          </p>
        </div>

        <!-- Founder Signature -->
        ${generateFounderSignature()}

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Send subscription cancelled email
 */
export async function sendSubscriptionCancelledEmail(user, subscription) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendSubscriptionCancelledEmail');
      return;
    }

    const emailConfig = getEmailConfig('subscription');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: user.email,
      subject: `Subscription Cancelled - You'll Be Missed`,
      html: generateSubscriptionCancelledEmail(user, subscription, appUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend subscription cancelled email error:', (result as any).error);
    } else {
      console.log('✅ Subscription cancelled email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send subscription cancelled email:', error);
  }
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(user, subscription) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendPaymentFailedEmail');
      return;
    }

    const emailConfig = getEmailConfig('billing');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: user.email,
      subject: `Payment Failed - Action Required`,
      html: generatePaymentFailedEmail(user, subscription, appUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend payment failed email error:', (result as any).error);
    } else {
      console.log('✅ Payment failed email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send payment failed email:', error);
  }
}

/**
 * Send trial ending soon email
 */
export async function sendTrialEndingEmail(user, daysLeft = 2) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendTrialEndingEmail');
      return;
    }

    const emailConfig = getEmailConfig('subscription');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: user.email,
      subject: `Your Free Trial Ends in ${daysLeft} Days`,
      html: generateTrialEndingEmail(user, daysLeft, appUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend trial ending email error:', (result as any).error);
    } else {
      console.log('✅ Trial ending email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send trial ending email:', error);
  }
}

/**
 * Send verification completed email
 */
export async function sendVerificationCompletedEmail(user, verificationType = 'email') {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendVerificationCompletedEmail');
      return;
    }

    const emailConfig = getEmailConfig('account');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: user.email,
      subject: `${verificationType === 'phone' ? '📱' : verificationType === 'id' ? '🆔' : '✅'} ${verificationType.charAt(0).toUpperCase() + verificationType.slice(1)} Verified!`,
      html: generateVerificationCompletedEmail(user, verificationType, appUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend verification completed email error:', (result as any).error);
    } else {
      console.log('✅ Verification completed email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send verification completed email:', error);
  }
}

/**
 * Generate subscription confirmation email HTML
 */
function generateSubscriptionConfirmationEmail(user, subscription, appUrl) {
  const tierDetails = {
    EARLY_BIRD: {
      name: 'Early Bird',
      price: '€5',
      icon: '🐦',
      color: '#f59e0b',
      features: [
        'Lock in €5/month forever',
        'Full access to all listings',
        'Contact hosts and employers',
        'Create unlimited listings',
        'Priority support',
        'Early access to new features'
      ]
    },
    SEARCHER: {
      name: 'Searcher',
      price: '€7',
      icon: '🔍',
      color: '#0369a1',
      features: [
        'Browse all listings',
        'Contact hosts and employers',
        'Save favorite listings',
        'View contact details',
        'Trust score visible to hosts',
        'Email support'
      ]
    },
    LISTER: {
      name: 'Lister',
      price: '€12',
      icon: '📝',
      color: '#10b981',
      features: [
        'Everything in Searcher',
        'Create unlimited listings',
        'Featured listing placement',
        'Analytics & insights',
        'Smart Stay Agreements',
        'Priority support'
      ]
    }
  };

  const details = tierDetails[subscription.tier] || tierDetails.SEARCHER;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 64px; margin-bottom: 16px;">${details.icon}</div>
          <h1 style="color: ${details.color}; font-size: 32px; font-weight: 700; margin: 0 0 8px 0;">
            Welcome to ${details.name}!
          </h1>
          <p style="color: #64748b; font-size: 16px; margin: 0;">
            Your subscription is now active
          </p>
        </div>

        <!-- Subscription Details -->
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Hi ${user.name || 'there'} 🎉
          </p>
          
          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Thank you for subscribing! Your <strong>${details.name}</strong> plan is now active, 
            and you have full access to all the features below.
          </p>

          <div style="background: linear-gradient(135deg, ${details.color}15 0%, ${details.color}05 100%); 
                      border-left: 4px solid ${details.color}; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 20px; color: ${details.color};">
              What's Included
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 2;">
              ${details.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Plan:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #334155; font-weight: 600; text-align: right;">
                  ${details.name}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Price:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #334155; font-weight: 600; text-align: right;">
                  ${details.price}/month
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Status:</td>
                <td style="padding: 8px 0; font-size: 14px; text-align: right;">
                  <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Billing:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #334155; font-weight: 600; text-align: right;">
                  Monthly
                </td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, ${details.color} 0%, ${details.color}dd 100%);
                      color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px;
                      font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px ${details.color}40;">
              Start Exploring
            </a>
          </div>
        </div>

        <!-- Next Steps -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #334155;">
            🚀 Get Started
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
            <li>Complete your profile to increase visibility</li>
            <li>${subscription.tier === 'LISTER' || subscription.tier === 'EARLY_BIRD' ? 'Create your first listing' : 'Browse listings and reach out to hosts'}</li>
            <li>Verify your identity for higher trust score</li>
            <li>Join our community and start your seasonal adventure</li>
          </ul>
        </div>

        <!-- Manage Subscription -->
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
            Need to update your billing details or manage your subscription?
          </p>
          <a href="${appUrl}/settings/subscription" style="color: #0369a1; text-decoration: none; font-weight: 500;">
            Manage Subscription →
          </a>
        </div>

        <!-- Founder Signature -->
        ${generateFounderSignature()}

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
            Questions about your subscription?
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px;">
            <a href="${appUrl}/help" style="color: #0369a1; text-decoration: none;">Help Center</a>
            <span style="color: #cbd5e1; margin: 0 8px;">•</span>
            <a href="mailto:support@seasoners.eu" style="color: #0369a1; text-decoration: none;">Contact Support</a>
          </p>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners. Your next adventure awaits.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate subscription cancelled email HTML
 */
function generateSubscriptionCancelledEmail(user, subscription, appUrl) {
  const endDate = subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }) : 'the end of your billing period';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">👋</div>
          <h1 style="color: #64748b; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
            Subscription Cancelled
          </h1>
          <p style="color: #64748b; font-size: 15px; margin: 0;">
            We're sorry to see you go
          </p>
        </div>

        <!-- Cancellation Confirmed -->
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Hi ${user.name || 'there'},
          </p>
          
          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Your subscription has been successfully cancelled. You'll still have full access to your 
            ${subscription.tier || 'subscription'} features until <strong>${endDate}</strong>.
          </p>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #f59e0b;">
              ⏰ Access Until ${endDate}
            </h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #78350f;">
              You won't be charged again. Your current access continues until the end of your 
              billing period. After that, your account will revert to the free plan.
            </p>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #334155;">
              What Happens Next?
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
              <li>No more charges to your payment method</li>
              <li>Full access until ${endDate}</li>
              <li>After that, you'll switch to the free plan</li>
              <li>Your data and listings remain safe</li>
              <li>You can resubscribe anytime</li>
            </ul>
          </div>
        </div>

        <!-- Feedback Request -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #334155;">
            💬 We'd Love Your Feedback
          </h3>
          <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
            Your input helps us improve Seasoners for everyone. Would you mind sharing why you cancelled?
          </p>
          <div style="text-align: center;">
            <a href="mailto:tremayne@seasoners.eu?subject=Cancellation Feedback" 
               style="display: inline-block; background: #0369a1; color: white; text-decoration: none; 
                      padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px;">
              Share Feedback
            </a>
          </div>
        </div>

        <!-- Resubscribe CTA -->
        <div style="background: #e0f2fe; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
            Changed your mind? You can reactivate anytime.
          </p>
          <a href="${appUrl}/subscribe" 
             style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
                    color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px;
                    font-weight: 600; font-size: 14px;">
            Resubscribe
          </a>
        </div>

        <!-- Founder Signature -->
        ${generateFounderSignature()}

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b;">
            Questions? <a href="mailto:billing@seasoners.eu" style="color: #0369a1; text-decoration: none;">Contact Billing Support</a>
          </p>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate payment failed email HTML
 */
function generatePaymentFailedEmail(user, subscription, appUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <h1 style="color: #dc2626; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
            Payment Failed
          </h1>
          <p style="color: #64748b; font-size: 15px; margin: 0;">
            We couldn't process your subscription payment
          </p>
        </div>

        <!-- Issue Details -->
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Hi ${user.name || 'there'},
          </p>
          
          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            We tried to charge your payment method for your ${subscription.tier || 'subscription'} plan, 
            but the payment failed. This could be due to:
          </p>

          <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
            <li>Insufficient funds</li>
            <li>Expired card</li>
            <li>Card blocked by your bank</li>
            <li>Incorrect billing address</li>
          </ul>

          <div style="background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #dc2626;">
              🚨 Action Required
            </h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
              Please update your payment method within the next 7 days to avoid losing access to your subscription.
              We'll automatically retry charging your card in 3 days.
            </p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}/settings/subscription" 
               style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                      color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px;
                      font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);">
              Update Payment Method
            </a>
          </div>
        </div>

        <!-- What Happens -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #334155;">
            What Happens If I Don't Act?
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
            <li>We'll retry charging your card automatically in 3 days</li>
            <li>If it fails again, we'll try one more time after 7 days</li>
            <li>If all attempts fail, your subscription will be cancelled</li>
            <li>You'll lose access to premium features</li>
            <li>Your account will revert to the free plan</li>
          </ul>
        </div>

        <!-- Help Section -->
        <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #334155;">
            Having trouble? Our billing team is here to help.
          </p>
          <a href="mailto:billing@seasoners.eu" style="color: #0369a1; text-decoration: none; font-weight: 500;">
            Contact Billing Support →
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate trial ending email HTML
 */
function generateTrialEndingEmail(user, daysLeft, appUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">⏰</div>
          <h1 style="color: #f59e0b; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
            Your Trial Ends in ${daysLeft} Days
          </h1>
          <p style="color: #64748b; font-size: 15px; margin: 0;">
            Time to decide: Subscribe or cancel
          </p>
        </div>

        <!-- Trial Info -->
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Hi ${user.name || 'there'} 👋
          </p>
          
          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Your 7-day free trial is almost over! In <strong>${daysLeft} days</strong>, your subscription 
            will automatically begin, and we'll charge your payment method.
          </p>

          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #f59e0b;">
              ⚡ What Happens Next?
            </h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #78350f;">
              If you do nothing, your subscription will start automatically in ${daysLeft} days. 
              Don't want to subscribe? Cancel anytime before then — no questions asked, no charges.
            </p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}/subscribe" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                      color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px;
                      font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); margin-bottom: 12px;">
              Keep My Subscription
            </a>
            <br />
            <a href="${appUrl}/settings/subscription" 
               style="display: inline-block; color: #64748b; text-decoration: none; 
                      padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px;">
              Cancel Subscription
            </a>
          </div>
        </div>

        <!-- Benefits Reminder -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #334155;">
            💎 What You're Getting
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
            <li>Browse unlimited listings across Europe</li>
            <li>Contact hosts and employers directly</li>
            <li>Create your own listings</li>
            <li>Build your trust score</li>
            <li>Smart Stay Agreements for safety</li>
            <li>Priority customer support</li>
          </ul>
        </div>

        <!-- Pricing Reminder -->
        <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
            Just €7/month • Cancel anytime
          </p>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            No contracts. No hassle. Cancel with one click.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
            Questions? <a href="${appUrl}/help" style="color: #0369a1; text-decoration: none;">Visit Help Center</a>
          </p>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generate verification completed email HTML
 */
function generateVerificationCompletedEmail(user, verificationType, appUrl) {
  const verificationDetails = {
    email: {
      title: 'Email Verified!',
      icon: '✉️',
      color: '#10b981',
      message: 'Your email address has been successfully verified.',
      trustBoost: '+10 Trust Score',
    },
    phone: {
      title: 'Phone Verified!',
      icon: '📱',
      color: '#0369a1',
      message: 'Your phone number has been successfully verified.',
      trustBoost: '+15 Trust Score',
    },
    id: {
      title: 'ID Verified!',
      icon: '🆔',
      color: '#f59e0b',
      message: 'Your identity has been successfully verified.',
      trustBoost: '+25 Trust Score',
    },
  };

  const details = verificationDetails[verificationType] || verificationDetails.email;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        ${generateLogoHeader(appUrl)}
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 64px; margin-bottom: 16px;">${details.icon}</div>
          <h1 style="color: ${details.color}; font-size: 32px; font-weight: 700; margin: 0 0 8px 0;">
            ${details.title}
          </h1>
          <p style="color: #64748b; font-size: 16px; margin: 0;">
            Your trust score just increased!
          </p>
        </div>

        <!-- Verification Confirmed -->
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Hi ${user.name || 'there'} 🎉
          </p>
          
          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
            ${details.message} This helps build trust with other Seasoners and increases your 
            visibility on the platform.
          </p>

          <div style="background: linear-gradient(135deg, ${details.color}15 0%, ${details.color}05 100%); 
                      border-left: 4px solid ${details.color}; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 12px;">🏆</div>
              <h3 style="margin: 0 0 8px 0; font-size: 24px; color: ${details.color};">
                ${details.trustBoost}
              </h3>
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                Your trust score increased
              </p>
            </div>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, ${details.color} 0%, ${details.color}dd 100%);
                      color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px;
                      font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px ${details.color}40;">
              View Your Profile
            </a>
          </div>
        </div>

        <!-- Next Steps -->
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #334155;">
            🚀 Keep Building Trust
          </h3>
          <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
            Higher trust scores lead to:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
            <li><strong>More visibility</strong> — Appear higher in search results</li>
            <li><strong>Better responses</strong> — People are more likely to contact verified users</li>
            <li><strong>Faster connections</strong> — Hosts and employers prefer verified profiles</li>
            <li><strong>Safer interactions</strong> — Build confidence with the community</li>
          </ul>

          ${verificationType !== 'id' ? `
          <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; color: #334155; text-align: center;">
              💡 Want to boost your score even more? 
              <a href="${appUrl}/profile/verify" style="color: #0369a1; text-decoration: none; font-weight: 500;">
                ${verificationType === 'email' ? 'Verify your phone number' : 'Complete ID verification'}
              </a>
            </p>
          </div>
          ` : ''}
        </div>

        <!-- Founder Signature -->
        ${generateFounderSignature()}

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">
            © ${new Date().getFullYear()} Seasoners. Building trust across borders.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

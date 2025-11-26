/**
 * Cloudflare Email Worker - Auto-Reply Handler
 * 
 * This worker intercepts incoming emails to Cloudflare Email Routing
 * and sends automated responses via Resend API.
 * 
 * Setup Instructions:
 * 1. Go to Cloudflare Dashboard → Workers & Pages
 * 2. Create new Worker
 * 3. Paste this code
 * 4. Add Environment Variables:
 *    - RESEND_API_KEY: Your Resend API key
 * 5. Deploy
 * 6. Go to Email Routing → Email Workers
 * 7. Create rule to route specific addresses through this worker
 */

export default {
  async email(message, env, ctx) {
    const to = message.to;
    const subject = message.headers.get('subject');
    
    // Get the raw email content to extract original sender
    const rawEmail = await new Response(message.raw).text();
    
    // Extract Return-Path which contains the actual original sender
    const returnPathMatch = rawEmail.match(/Return-Path:\s*<?([^>\s]+@[^>\s]+)>?/i);
    const xOriginalFromMatch = rawEmail.match(/X-Original-From:\s*<?([^>\s]+@[^>\s]+)>?/i);
    
    // Try multiple headers to find the real sender (before SRS rewriting)
    let originalFrom = null;
    
    // Check X-Original-From header (some systems add this)
    if (xOriginalFromMatch) {
      originalFrom = xOriginalFromMatch[1];
    }
    // Check if Return-Path doesn't contain SRS
    else if (returnPathMatch && !returnPathMatch[1].includes('SRS')) {
      originalFrom = returnPathMatch[1];
    }
    // Parse from the From header
    else {
      const fromHeader = message.headers.get('from') || '';
      const emailMatch = fromHeader.match(/<([^>]+)>/) || fromHeader.match(/([^\s]+@[^\s]+)/);
      if (emailMatch) {
        const email = emailMatch[1];
        // Only use if it doesn't contain SRS
        if (!email.includes('SRS') && !email.includes('@seasoners.eu')) {
          originalFrom = email;
        }
      }
    }
    
    // Fallback to message.from if we still don't have a valid email
    if (!originalFrom) {
      originalFrom = message.from;
    }

    // Log incoming email
    console.log(`Received email from ${originalFrom} to ${to}`);
    console.log(`Raw From header: ${message.headers.get('from')}`);

    // Forward to destination (normal routing)
    await message.forward('seasoners.global@gmail.com'); // Forward to your main inbox

    // Send auto-reply via Resend
    try {
      const autoReplySubject = `Re: ${subject}`;
      const autoReplyBody = generateAutoReply(to, subject);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Seasoners <${to}>`, // Reply from the same address
          to: originalFrom,
          subject: autoReplySubject,
          html: autoReplyBody,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send auto-reply:', await response.text());
      } else {
        console.log(`Auto-reply sent to ${originalFrom}`);
      }
    } catch (error) {
      console.error('Error sending auto-reply:', error);
    }
  },
};

/**
 * Generate auto-reply based on recipient address
 */
function generateAutoReply(toAddress, originalSubject) {
  const isHello = toAddress.includes('hello@');
  const isSupport = toAddress.includes('support@');
  const isTremayne = toAddress.includes('tremayne@');

  if (isHello) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                  max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0369a1; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
            Thanks for reaching out to Seasoners!
          </h1>
        </div>

        <div style="background: #f0f9ff; border-left: 4px solid #0369a1; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Hi there! 👋
          </p>
          <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            We've received your message about: <strong>"${originalSubject}"</strong>
          </p>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Our team will review your email and respond within 24-48 hours. If your inquiry is urgent, 
            please mention that in your message.
          </p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
            <strong>In the meantime:</strong>
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #64748b; line-height: 1.8;">
            <li>Check out our <a href="https://seasoners.eu/help" style="color: #0369a1;">Help Center</a></li>
            <li>Browse <a href="https://seasoners.eu/stays" style="color: #0369a1;">seasonal opportunities</a></li>
            <li>Join our <a href="https://seasoners.eu/community" style="color: #0369a1;">community</a></li>
          </ul>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #475569;">
            <strong>Warm regards,</strong><br>
            The Seasoners Team<br>
            <a href="mailto:hello@seasoners.eu" style="color: #0369a1; text-decoration: none;">hello@seasoners.eu</a>
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;
  }

  if (isSupport) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                  max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #10b981; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
            🛟 Seasoners Support
          </h1>
          <p style="color: #64748b; font-size: 15px; margin: 0;">
            We're here to help!
          </p>
        </div>

        <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Hi! Thanks for contacting Seasoners Support.
          </p>
          <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Your support request regarding: <strong>"${originalSubject}"</strong> has been received 
            and assigned a ticket.
          </p>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Our support team typically responds within 12-24 hours on business days.
          </p>
        </div>

        <div style="background: #fffbeb; border-left: 3px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #78350f;">
            <strong>⚡ Need faster help?</strong>
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #92400e; line-height: 1.6;">
            <li>Check our <a href="https://seasoners.eu/help" style="color: #f59e0b;">FAQ</a> for instant answers</li>
            <li>Search our <a href="https://seasoners.eu/docs" style="color: #f59e0b;">documentation</a></li>
            <li>Visit our <a href="https://seasoners.eu/community" style="color: #f59e0b;">community forum</a></li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
            <strong>Common Support Topics:</strong>
          </p>
          <div style="display: inline-block; text-align: left;">
            <p style="margin: 4px 0; font-size: 13px;">
              • <a href="https://seasoners.eu/help/account" style="color: #0369a1;">Account & Verification</a>
            </p>
            <p style="margin: 4px 0; font-size: 13px;">
              • <a href="https://seasoners.eu/help/listings" style="color: #0369a1;">Listing Issues</a>
            </p>
            <p style="margin: 4px 0; font-size: 13px;">
              • <a href="https://seasoners.eu/help/payments" style="color: #0369a1;">Payments & Subscriptions</a>
            </p>
            <p style="margin: 4px 0; font-size: 13px;">
              • <a href="https://seasoners.eu/help/safety" style="color: #0369a1;">Trust & Safety</a>
            </p>
          </div>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #475569;">
            <strong>Best regards,</strong><br>
            Seasoners Support Team<br>
            <a href="mailto:support@seasoners.eu" style="color: #0369a1; text-decoration: none;">support@seasoners.eu</a>
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            This is an automated response. A team member will follow up soon.
          </p>
        </div>
      </div>
    `;
  }

  if (isTremayne) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                  max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #0369a1; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
            Thanks for reaching out!
          </h1>
        </div>

        <div style="background: #f0f9ff; border-left: 4px solid #0369a1; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Hi there,
          </p>
          <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
            Thank you for your message about: <strong>"${originalSubject}"</strong>
          </p>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
            I read every message personally and will respond as soon as possible. For urgent matters, 
            please include "URGENT" in the subject line.
          </p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
            While you wait, you might be interested in:
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #64748b; line-height: 1.8;">
            <li><a href="https://seasoners.eu/about" style="color: #0369a1;">Our story and mission</a></li>
            <li><a href="https://seasoners.eu/blog" style="color: #0369a1;">Latest updates from the team</a></li>
            <li><a href="https://seasoners.eu/community" style="color: #0369a1;">Join our community</a></li>
          </ul>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #475569;">
            <strong>Warm regards,</strong><br>
            Tremayne Chivers<br>
            Founder, Seasoners<br>
            <a href="mailto:tremayne@seasoners.eu" style="color: #0369a1; text-decoration: none;">tremayne@seasoners.eu</a>
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            This is an automated response. You'll receive a personal reply soon.
          </p>
        </div>
      </div>
    `;
  }

  // Default fallback
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px;">
      <p>Thank you for your email. We've received your message and will respond within 24-48 hours.</p>
      <p><strong>The Seasoners Team</strong><br>
      <a href="https://seasoners.eu">seasoners.eu</a></p>
    </div>
  `;
}

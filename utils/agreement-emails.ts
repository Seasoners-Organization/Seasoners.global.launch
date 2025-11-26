import { getResend } from '@/lib/resend';
import { getEmailConfig } from '@/lib/email-config';

/**
 * Send email notification when an agreement is created
 */
export async function sendAgreementCreatedEmail(agreement, guest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const agreementUrl = `${appUrl}/agreements`;

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendAgreementCreatedEmail');
      return;
    }
    const emailConfig = getEmailConfig('agreement');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: guest.email,
      subject: `New Agreement: ${agreement.listing.title}`,
      html: generateAgreementCreatedEmail(agreement, guest, agreementUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend agreement created email error:', (result as any).error);
    } else {
      console.log('✅ Agreement created email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send agreement created email:', error);
  }
}

/**
 * Send email notification when an agreement is signed
 */
export async function sendAgreementSignedEmail(agreement, recipient, signerName) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const agreementUrl = `${appUrl}/agreements`;

  const isFullySigned = agreement.status === 'FULLY_SIGNED';

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendAgreementSignedEmail');
      return;
    }
    const emailConfig = getEmailConfig('agreement');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: recipient.email,
      subject: isFullySigned
        ? `✓ Agreement Fully Signed: ${agreement.listing.title}`
        : `${signerName} signed: ${agreement.listing.title}`,
      html: isFullySigned
        ? generateFullySignedEmail(agreement, recipient, agreementUrl)
        : generatePartiallySignedEmail(agreement, recipient, signerName, agreementUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend agreement signed email error:', (result as any).error);
    } else {
      console.log('✅ Agreement signed email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send agreement signed email:', error);
  }
}

/**
 * Send email notification when a guest requests an agreement (host is notified)
 */
export async function sendAgreementRequestEmail(agreement, host) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const agreementUrl = `${appUrl}/agreements`;

  try {
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping sendAgreementRequestEmail');
      return;
    }
    const emailConfig = getEmailConfig('agreement');
    const result = await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: host.email,
      subject: `Agreement Request: ${agreement.listing.title}`,
      html: generateAgreementRequestEmail(agreement, host, agreementUrl),
    });
    if ((result as any)?.error) {
      console.error('Resend agreement request email error:', (result as any).error);
    } else {
      console.log('✅ Agreement request email sent:', (result as any)?.data?.id);
    }
  } catch (error) {
    console.error('Failed to send agreement request email:', error);
  }
}

function generateAgreementRequestEmail(agreement, host, agreementUrl) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width:560px; margin:0 auto; padding:40px 20px; color:#334155;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#0369a1;font-size:22px;margin:0 0 8px 0;">Agreement Request Received</h1>
        <p style="color:#64748b;margin:0;">A guest has requested an agreement for your listing.</p>
      </div>
      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:16px;">
        <h2 style="margin:0 0 8px 0;color:#0369a1;">${agreement.listing.title}</h2>
        <p style="margin:0;color:#475569;">Requested by: ${agreement.guest.name || 'Guest'}</p>
      </div>
      <div style="text-align:center;margin-top:20px;">
        <a href="${agreementUrl}" style="display:inline-block;background:#10b981;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;">Review Request</a>
      </div>
    </div>
  `;
}

/**
 * HTML template for agreement created notification
 */
function generateAgreementCreatedEmail(agreement, guest, agreementUrl) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
      
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #0369a1; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
          New Agreement Awaiting Your Review
        </h1>
        <p style="color: #64748b; font-size: 15px; margin: 0;">
          ${agreement.host.name} has prepared an agreement for you
        </p>
      </div>

      <div style="background: #f0f9ff; border-left: 4px solid #0369a1; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0369a1;">
          ${agreement.listing.title}
        </h2>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">
          📍 ${agreement.listing.city ? `${agreement.listing.city}, ${agreement.listing.region}` : agreement.listing.location}
        </p>
        ${agreement.startDate ? `
        <p style="margin: 0; font-size: 14px; color: #475569;">
          📅 ${new Date(agreement.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${agreement.endDate ? new Date(agreement.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}
        </p>
        ` : ''}
      </div>

      <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          Hi ${guest.name || 'there'},
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          ${agreement.host.name} has created a Smart Stay Agreement for <strong>${agreement.listing.title}</strong>. 
          This agreement is designed to build trust from day one with clear expectations and plain language.
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          Please review the terms carefully. If everything looks good, you can sign the agreement to move forward.
        </p>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #64748b; font-style: italic;">
          "Seasoners helps people build trust across borders — one honest agreement at a time."
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${agreementUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                  color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px;
                  font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          Review & Sign Agreement
        </a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">
          Questions? Reach out to ${agreement.host.name} directly or contact Seasoners support.
        </p>
        <p style="margin: 0; font-size: 13px; color: #94a3b8;">
          This is a notification email. No legal advice is provided.
        </p>
      </div>
    </div>
  `;
}

/**
 * HTML template for partially signed agreement notification
 */
function generatePartiallySignedEmail(agreement, recipient, signerName, agreementUrl) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
      
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #f59e0b; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
          Agreement Awaiting Your Signature
        </h1>
        <p style="color: #64748b; font-size: 15px; margin: 0;">
          ${signerName} has signed — you're next
        </p>
      </div>

      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #f59e0b;">
          ${agreement.listing.title}
        </h2>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">
          📍 ${agreement.listing.city ? `${agreement.listing.city}, ${agreement.listing.region}` : agreement.listing.location}
        </p>
        <p style="margin: 0; font-size: 14px; color: #475569;">
          ✓ Signed by: ${signerName}
        </p>
      </div>

      <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          Hi ${recipient.name || 'there'},
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          Good news! ${signerName} has signed the Smart Stay Agreement for <strong>${agreement.listing.title}</strong>.
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          Now we just need your signature to make it official. Once both parties sign, the agreement 
          becomes binding and you can move forward with confidence.
        </p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
          📝 <strong>Tip:</strong> Review all clauses carefully before signing. If anything is unclear, 
          reach out to ${signerName} first.
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${agreementUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                  color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px;
                  font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
          Review & Sign Now
        </a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">
          Once you sign, both parties will receive a confirmation email.
        </p>
        <p style="margin: 0; font-size: 13px; color: #94a3b8;">
          Questions? Contact the other party or Seasoners support.
        </p>
      </div>
    </div>
  `;
}

/**
 * HTML template for fully signed agreement notification
 */
function generateFullySignedEmail(agreement, recipient, agreementUrl) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
      
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
        <h1 style="color: #10b981; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
          Agreement Fully Signed!
        </h1>
        <p style="color: #64748b; font-size: 15px; margin: 0;">
          Both parties have signed — you're all set
        </p>
      </div>

      <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #10b981;">
          ${agreement.listing.title}
        </h2>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">
          📍 ${agreement.listing.city ? `${agreement.listing.city}, ${agreement.listing.region}` : agreement.listing.location}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">
          ✓ Host: ${agreement.host.name}
        </p>
        <p style="margin: 0; font-size: 14px; color: #475569;">
          ✓ Guest: ${agreement.guest.name}
        </p>
      </div>

      <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          Hi ${recipient.name || 'there'},
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          Congratulations! Both you and ${agreement.host.id === recipient.id ? agreement.guest.name : agreement.host.name} 
          have signed the Smart Stay Agreement for <strong>${agreement.listing.title}</strong>.
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
          This agreement is now binding and immutable. A cryptographic hash has been generated to 
          ensure the terms cannot be altered.
        </p>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 12px; color: #64748b; font-family: monospace;">
            Hash: ${agreement.hash ? agreement.hash.substring(0, 40) + '...' : 'Pending'}
          </p>
        </div>
        <p style="margin: 0; font-size: 15px; line-height: 1.6;">
          <strong>Next steps:</strong> Keep this email for your records. If you need to reference the 
          agreement later, you can always find it in your Seasoners dashboard.
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${agreementUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                  color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px;
                  font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          View Agreement
        </a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;">
          <strong>Remember:</strong> This agreement is built on trust and mutual respect. 
          If issues arise, start with a conversation. Good faith communication resolves most problems.
        </p>
        <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
          Have a great season together! 🏔️
        </p>
      </div>
    </div>
  `;
}

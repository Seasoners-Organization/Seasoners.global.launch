#!/usr/bin/env node

/**
 * Email Configuration Test & Diagnostic Script
 * 
 * Usage:
 *   node scripts/test-email-config.js
 *   node scripts/test-email-config.js --send test@example.com
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const args = process.argv.slice(2);
const sendTest = args.includes('--send');
const testEmail = args[args.indexOf('--send') + 1] || null;

console.log('\n🔍 EMAIL CONFIGURATION DIAGNOSTIC\n');
console.log('=' .repeat(60));

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('-'.repeat(60));

const hasResendKey = !!process.env.RESEND_API_KEY;
console.log(`RESEND_API_KEY:          ${hasResendKey ? '✅ Set' : '❌ Missing'}`);
console.log(`EMAIL_FROM:              ${process.env.EMAIL_FROM || '⚠️  Not set (will use default)'}`);
console.log(`EMAIL_REPLY_TO_SUPPORT:  ${process.env.EMAIL_REPLY_TO_SUPPORT || '⚠️  Not set (will use default)'}`);
console.log(`EMAIL_REPLY_TO_FOUNDER:  ${process.env.EMAIL_REPLY_TO_FOUNDER || '⚠️  Not set (will use default)'}`);

// Validate configuration
console.log('\n🔧 Configuration Validation:');
console.log('-'.repeat(60));

const emailFrom = process.env.EMAIL_FROM || 'Seasoners <onboarding@resend.dev>';
const usingTestDomain = emailFrom.includes('onboarding@resend.dev');

if (usingTestDomain) {
  console.log('⚠️  WARNING: Using Resend test domain');
  console.log('   For production, set EMAIL_FROM=Seasoners <hello@seasoners.eu>');
} else {
  console.log(`✅ Custom sender: ${emailFrom}`);
}

const replyToSupport = process.env.EMAIL_REPLY_TO_SUPPORT || 'support@seasoners.eu';
const replyToFounder = process.env.EMAIL_REPLY_TO_FOUNDER || 'tremayne@seasoners.eu';

console.log(`✅ Reply-to (support): ${replyToSupport}`);
console.log(`✅ Reply-to (founder): ${replyToFounder}`);

// Check DNS if using custom domain
if (!usingTestDomain) {
  console.log('\n🌐 DNS Status (Custom Domain):');
  console.log('-'.repeat(60));
  console.log('Run these commands to verify DNS:');
  console.log('');
  console.log('  dig +short MX seasoners.eu');
  console.log('  dig +short TXT seasoners.eu');
  console.log('  dig +short CNAME resend._domainkey.seasoners.eu');
  console.log('  dig +short TXT _dmarc.seasoners.eu');
  console.log('');
  console.log('Expected results:');
  console.log('  MX:   route1/2/3.mx.cloudflare.net');
  console.log('  SPF:  v=spf1 include:_spf.mx.cloudflare.net include:spf.resend.com ~all');
  console.log('  DKIM: Should point to Resend target');
  console.log('  DMARC: v=DMARC1; p=none; ...');
}

// Test sending if requested
if (sendTest && testEmail) {
  console.log('\n📧 Sending Test Email:');
  console.log('-'.repeat(60));
  
  if (!hasResendKey) {
    console.log('❌ Cannot send: RESEND_API_KEY not set');
    process.exit(1);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  console.log(`To: ${testEmail}`);
  console.log(`From: ${emailFrom}`);
  console.log(`Reply-To: ${replyToSupport}`);
  console.log('');
  console.log('Sending...');

  (async () => {
    try {
      const result = await resend.emails.send({
        from: emailFrom,
        replyTo: replyToSupport,
        to: testEmail,
        subject: 'Seasoners Email Configuration Test',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                      max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #0369a1; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
                ✅ Email Configuration Test
              </h1>
              <p style="color: #64748b; font-size: 15px; margin: 0;">
                Your email setup is working correctly!
              </p>
            </div>

            <div style="background: #f0f9ff; border-left: 4px solid #0369a1; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #0369a1;">
                Configuration Details
              </h3>
              <table style="width: 100%; font-size: 14px; color: #475569;">
                <tr>
                  <td style="padding: 4px 0;"><strong>From:</strong></td>
                  <td style="padding: 4px 0;">${emailFrom}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Reply-To:</strong></td>
                  <td style="padding: 4px 0;">${replyToSupport}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Date:</strong></td>
                  <td style="padding: 4px 0;">${new Date().toISOString()}</td>
                </tr>
              </table>
            </div>

            <div style="background: #f8fafc; border-radius: 8px; padding: 20px;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">
                <strong>What to check:</strong>
              </p>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #64748b; line-height: 1.6;">
                <li>Email appears in inbox (not spam)</li>
                <li>"From" address shows: ${emailFrom}</li>
                <li>Reply button uses: ${replyToSupport}</li>
                <li>No security warnings</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                Seasoners Email System Test · ${new Date().getFullYear()}
              </p>
            </div>
          </div>
        `,
      });

      if (result.error) {
        console.log('❌ Send failed:', result.error);
        process.exit(1);
      }

      console.log('✅ Email sent successfully!');
      console.log(`   Message ID: ${result.data?.id}`);
      console.log('');
      console.log('📬 Check your inbox (and spam folder)');
      console.log('   It may take 1-5 minutes to arrive.');
      
    } catch (error) {
      console.log('❌ Error sending email:', error.message);
      process.exit(1);
    }
  })();

} else if (sendTest && !testEmail) {
  console.log('\n❌ Error: No test email address provided');
  console.log('Usage: node scripts/test-email-config.js --send your-email@example.com');
  process.exit(1);
}

// Summary
if (!sendTest) {
  console.log('\n📝 Summary:');
  console.log('-'.repeat(60));
  
  const issues = [];
  if (!hasResendKey) issues.push('Missing RESEND_API_KEY');
  if (usingTestDomain) issues.push('Using test domain (ok for dev, not for prod)');
  
  if (issues.length === 0) {
    console.log('✅ Configuration looks good!');
    console.log('');
    console.log('To send a test email, run:');
    console.log('  node scripts/test-email-config.js --send your-email@example.com');
  } else {
    console.log('⚠️  Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('');
    console.log('Fix these issues before deploying to production.');
  }
}

console.log('\n' + '='.repeat(60) + '\n');

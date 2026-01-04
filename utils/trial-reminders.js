/**
 * Trial Reminder Email System
 * 
 * This utility sends automated emails to users at key points during their 90-day free trial:
 * - Day 30: 60 days remaining
 * - Day 60: 30 days remaining  
 * - Day 83: 7 days until billing (critical)
 * - Day 89: 1 day until billing (final warning)
 */

import { getResend } from '../lib/resend';
import { prisma } from '../lib/prisma';

/**
 * Calculate days remaining in trial
 */
export function getDaysRemaining(trialEndDate) {
  const now = new Date();
  const end = new Date(trialEndDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format date for email display
 */
export function formatTrialEndDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get plan price and name
 */
export function getPlanDetails(tier) {
  const plans = {
    SEARCHER: { name: 'Searcher', price: '€7', features: ['Contact unlimited hosts', 'Unlimited messaging', 'Advanced filters', 'Priority support'] },
    LISTER: { name: 'Lister', price: '€12', features: ['Everything in Searcher', 'Create unlimited listings', 'Featured badge', 'Analytics dashboard', 'Early access to features'] }
  };
  return plans[tier] || plans.SEARCHER;
}

/**
 * Send 60 days remaining email (Day 30 of trial)
 */
export async function send60DaysRemainingEmail(user, subscription) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Resend not configured' };

  const plan = getPlanDetails(subscription.tier);
  const trialEndDate = formatTrialEndDate(subscription.trialEnd);

  try {
    await resend.emails.send({
      from: 'Seasoners <hello@seasoners.eu>',
      to: user.email,
      subject: 'Your Seasoners free trial - 60 days remaining! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0369a1; font-size: 28px; margin-bottom: 8px;">Seasoners</h1>
            <p style="color: #64748b; font-size: 14px; margin: 0;">Your seasonal work & housing community</p>
          </div>

          <!-- Main Content -->
          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 24px;">
            <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">Hi ${user.name || 'there'}! 👋</h2>
            
            <p style="font-size: 16px; color: #475569;">
              We hope you're enjoying your <strong>3-month free trial</strong> of the ${plan.name} plan! You've been exploring for 30 days now, and we wanted to give you a friendly update.
            </p>

            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
              <div style="font-size: 48px; font-weight: bold; margin-bottom: 8px;">60 days</div>
              <div style="font-size: 18px; opacity: 0.9;">remaining in your free trial</div>
              <div style="margin-top: 12px; font-size: 14px; opacity: 0.8;">Trial ends on ${trialEndDate}</div>
            </div>

            <p style="font-size: 16px; color: #475569;">
              After your trial ends, you'll be automatically charged <strong>${plan.price} per month</strong> to continue enjoying full access. Of course, you can cancel anytime before then with no charges.
            </p>
          </div>

          <!-- Features Reminder -->
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #0f172a; font-size: 18px; margin-top: 0;">You're currently enjoying:</h3>
            <ul style="padding-left: 20px; margin: 16px 0;">
              ${plan.features.map(feature => `<li style="margin-bottom: 8px; color: #475569;">${feature}</li>`).join('')}
            </ul>
          </div>

          <!-- CTA Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.seasoners.eu/profile?tab=subscription" 
               style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 12px;">
              Manage Subscription
            </a>
            <p style="font-size: 14px; color: #64748b; margin-top: 16px;">
              Want to cancel? No problem! Just click above and cancel anytime.
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              Need help? Reply to this email or contact us at <a href="mailto:support@seasoners.eu" style="color: #0ea5e9;">support@seasoners.eu</a>
            </p>
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              © ${new Date().getFullYear()} Seasoners. All rights reserved.
            </p>
          </div>

        </body>
        </html>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send 60-day reminder:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send 30 days remaining email (Day 60 of trial)
 */
export async function send30DaysRemainingEmail(user, subscription) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Resend not configured' };

  const plan = getPlanDetails(subscription.tier);
  const trialEndDate = formatTrialEndDate(subscription.trialEnd);

  try {
    await resend.emails.send({
      from: 'Seasoners <hello@seasoners.eu>',
      to: user.email,
      subject: 'Your free trial - 30 days left ⏰',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0369a1; font-size: 28px; margin-bottom: 8px;">Seasoners</h1>
          </div>

          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 24px; margin-bottom: 24px; border-radius: 8px;">
            <h2 style="color: #92400e; font-size: 20px; margin-top: 0;">⏰ Trial Status Update</h2>
            <p style="color: #78350f; font-size: 16px; margin-bottom: 0;">
              Your 3-month free trial is now two-thirds complete. You have <strong>30 days remaining</strong> before billing begins.
            </p>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 24px;">
            <h3 style="color: #0f172a; font-size: 18px;">Hi ${user.name || 'there'},</h3>
            
            <p style="font-size: 16px; color: #475569;">
              Time flies when you're having fun! Your free trial of the ${plan.name} plan ends on <strong>${trialEndDate}</strong>.
            </p>

            <div style="background: white; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <div style="font-size: 42px; font-weight: bold; color: #f59e0b; margin-bottom: 8px;">30 days</div>
              <div style="font-size: 16px; color: #64748b;">until automatic billing begins</div>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Monthly price after trial:</div>
                <div style="font-size: 32px; font-weight: bold; color: #0ea5e9;">${plan.price}</div>
              </div>
            </div>

            <p style="font-size: 16px; color: #475569;">
              <strong>What happens next?</strong>
            </p>
            <ul style="padding-left: 20px; color: #475569;">
              <li style="margin-bottom: 8px;">In 23 days, we'll send you another reminder (7 days before billing)</li>
              <li style="margin-bottom: 8px;">On day 90, if you haven't cancelled, we'll charge ${plan.price} to your card</li>
              <li style="margin-bottom: 8px;">You'll continue to enjoy full access at this monthly rate</li>
              <li style="margin-bottom: 8px;">Cancel anytime with no penalties or fees</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.seasoners.eu/profile?tab=subscription" 
               style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px;">
              Review Subscription
            </a>
            <br/>
            <a href="https://www.seasoners.eu/profile?tab=subscription" 
               style="display: inline-block; color: #64748b; padding: 12px 24px; text-decoration: underline; font-size: 14px;">
              Cancel Subscription (No Charge)
            </a>
          </div>

          <div style="background: #ecfdf5; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="font-size: 14px; color: #065f46; margin: 0;">
              💚 <strong>Loving Seasoners?</strong> Keep enjoying all premium features for just ${plan.price}/month after your trial.
            </p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              Questions? Contact <a href="mailto:support@seasoners.eu" style="color: #0ea5e9;">support@seasoners.eu</a>
            </p>
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              © ${new Date().getFullYear()} Seasoners
            </p>
          </div>

        </body>
        </html>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send 30-day reminder:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send 7 days remaining email (Day 83 of trial) - CRITICAL
 */
export async function send7DaysRemainingEmail(user, subscription) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Resend not configured' };

  const plan = getPlanDetails(subscription.tier);
  const trialEndDate = formatTrialEndDate(subscription.trialEnd);

  try {
    await resend.emails.send({
      from: 'Seasoners <hello@seasoners.eu>',
      to: user.email,
      subject: '⚠️ Important: Your free trial ends in 7 days',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0369a1; font-size: 28px; margin-bottom: 8px;">Seasoners</h1>
          </div>

          <!-- URGENT BANNER -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 24px; margin-bottom: 24px; border-radius: 12px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">⚠️ IMPORTANT NOTICE</div>
            <div style="font-size: 18px; opacity: 0.95;">Your free trial ends in 7 days</div>
          </div>

          <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #991b1b; font-size: 20px; margin-top: 0;">Billing Starts Soon</h2>
            <p style="color: #7f1d1d; font-size: 16px; line-height: 1.8;">
              <strong>Hi ${user.name || 'there'},</strong><br/><br/>
              
              Your 90-day free trial of the ${plan.name} plan ends on <strong>${trialEndDate}</strong> — that's just <strong>7 days away</strong>.<br/><br/>
              
              On that date, unless you cancel, your payment method will be automatically charged <strong>${plan.price}</strong> for your first month of continued access.
            </p>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 24px;">
            <h3 style="color: #0f172a; font-size: 18px; margin-top: 0;">Your Options:</h3>
            
            <div style="background: white; border-left: 4px solid #22c55e; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <p style="color: #065f46; font-weight: 600; margin: 0 0 8px 0;">✓ Keep Your Subscription (Do Nothing)</p>
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                Your card will be charged ${plan.price} on ${trialEndDate}, and you'll continue enjoying all premium features.
              </p>
            </div>

            <div style="background: white; border-left: 4px solid #ef4444; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <p style="color: #991b1b; font-weight: 600; margin: 0 0 8px 0;">✕ Cancel Before Billing (No Charge)</p>
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                Cancel anytime in the next 7 days and you won't be charged. You'll keep access until ${trialEndDate}.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.seasoners.eu/profile?tab=subscription" 
               style="display: inline-block; background: #0ea5e9; color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin-bottom: 12px;">
              Manage My Subscription
            </a>
            <p style="font-size: 14px; color: #64748b; margin-top: 16px;">
              <a href="https://www.seasoners.eu/profile?tab=subscription" style="color: #64748b; text-decoration: underline;">
                Click here to cancel (takes 30 seconds)
              </a>
            </p>
          </div>

          <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #0369a1; font-size: 16px; margin-top: 0;">What you'll keep with paid subscription:</h4>
            <ul style="padding-left: 20px; color: #0c4a6e; margin: 12px 0;">
              ${plan.features.map(feature => `<li style="margin-bottom: 6px;">${feature}</li>`).join('')}
            </ul>
            <p style="color: #0369a1; font-size: 14px; margin-bottom: 0;">
              <strong>Price: ${plan.price}/month</strong> (cancel anytime, no contracts)
            </p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              Questions about billing? Email <a href="mailto:support@seasoners.eu" style="color: #0ea5e9;">support@seasoners.eu</a>
            </p>
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              © ${new Date().getFullYear()} Seasoners
            </p>
          </div>

        </body>
        </html>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send 7-day reminder:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send 1 day remaining email (Day 89 of trial) - FINAL WARNING
 */
export async function send1DayRemainingEmail(user, subscription) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Resend not configured' };

  const plan = getPlanDetails(subscription.tier);
  const trialEndDate = formatTrialEndDate(subscription.trialEnd);

  try {
    await resend.emails.send({
      from: 'Seasoners <hello@seasoners.eu>',
      to: user.email,
      subject: '🚨 FINAL NOTICE: Your trial ends tomorrow',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0369a1; font-size: 28px; margin-bottom: 8px;">Seasoners</h1>
          </div>

          <!-- FINAL WARNING BANNER -->
          <div style="background: linear-gradient(135deg, #7c2d12 0%, #431407 100%); color: white; padding: 30px; margin-bottom: 24px; border-radius: 12px; text-align: center; border: 3px solid #dc2626;">
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 12px;">🚨 FINAL NOTICE 🚨</div>
            <div style="font-size: 20px; margin-bottom: 8px;">Your free trial ends TOMORROW</div>
            <div style="font-size: 16px; opacity: 0.9;">${trialEndDate}</div>
          </div>

          <div style="background: #fef2f2; border: 3px solid #dc2626; border-radius: 12px; padding: 30px; margin-bottom: 24px;">
            <h2 style="color: #991b1b; font-size: 22px; margin-top: 0;">This is your last reminder!</h2>
            <p style="color: #7f1d1d; font-size: 17px; line-height: 1.8;">
              <strong>Hi ${user.name || 'there'},</strong><br/><br/>
              
              Your 90-day free trial of the ${plan.name} plan ends <strong>tomorrow, ${trialEndDate}</strong>.<br/><br/>
              
              <strong style="font-size: 18px; color: #991b1b;">Tomorrow, your card will be charged ${plan.price} unless you cancel today.</strong>
            </p>
          </div>

          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #78350f; font-size: 15px; margin: 0;">
              <strong>⏰ You have less than 24 hours to cancel if you don't want to be charged.</strong>
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.seasoners.eu/profile?tab=subscription" 
               style="display: block; background: #dc2626; color: white; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 18px; margin-bottom: 16px;">
              CANCEL NOW (Avoid Charge)
            </a>
            <p style="font-size: 13px; color: #64748b; margin: 12px 0;">
              or
            </p>
            <a href="https://www.seasoners.eu/profile?tab=subscription" 
               style="display: block; background: #0ea5e9; color: white; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 18px;">
              Keep Subscription (${plan.price}/month)
            </a>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #0f172a; font-size: 16px; margin-top: 0;">Quick Summary:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Plan:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${plan.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Monthly Price:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #0ea5e9; font-weight: 600;">${plan.price}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Billing Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #dc2626; font-weight: 600;">Tomorrow (${trialEndDate})</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Cancel Deadline:</strong></td>
                <td style="padding: 8px; color: #dc2626; font-weight: 600;">TODAY</td>
              </tr>
            </table>
          </div>

          <div style="background: #ecfdf5; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="font-size: 14px; color: #065f46; margin: 0;">
              💚 <strong>Want to keep using Seasoners?</strong> You don't need to do anything. Your subscription will continue automatically.
            </p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              Urgent questions? Email <a href="mailto:support@seasoners.eu" style="color: #0ea5e9;">support@seasoners.eu</a> immediately
            </p>
            <p style="font-size: 13px; color: #94a3b8; margin: 8px 0;">
              © ${new Date().getFullYear()} Seasoners
            </p>
          </div>

        </body>
        </html>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send 1-day reminder:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Process trial reminders for all active trials
 * This should be run as a daily cron job
 */
export async function processTrialReminders() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'trialing',
        trialEnd: {
          not: null
        }
      },
      include: {
        user: true
      }
    });

    const results = {
      day30: { sent: 0, failed: 0 },
      day60: { sent: 0, failed: 0 },
      day83: { sent: 0, failed: 0 },
      day89: { sent: 0, failed: 0 }
    };

    for (const subscription of subscriptions) {
      const daysRemaining = getDaysRemaining(subscription.trialEnd);
      
      // Day 30: 60 days remaining
      if (daysRemaining === 60) {
        const result = await send60DaysRemainingEmail(subscription.user, subscription);
        if (result.success) results.day30.sent++;
        else results.day30.failed++;
      }
      
      // Day 60: 30 days remaining
      if (daysRemaining === 30) {
        const result = await send30DaysRemainingEmail(subscription.user, subscription);
        if (result.success) results.day60.sent++;
        else results.day60.failed++;
      }
      
      // Day 83: 7 days remaining (CRITICAL)
      if (daysRemaining === 7) {
        const result = await send7DaysRemainingEmail(subscription.user, subscription);
        if (result.success) results.day83.sent++;
        else results.day83.failed++;
      }
      
      // Day 89: 1 day remaining (FINAL)
      if (daysRemaining === 1) {
        const result = await send1DayRemainingEmail(subscription.user, subscription);
        if (result.success) results.day89.sent++;
        else results.day89.failed++;
      }
    }

    console.log('Trial reminders processed:', results);
    return results;
    
  } catch (error) {
    console.error('Failed to process trial reminders:', error);
    throw error;
  }
}

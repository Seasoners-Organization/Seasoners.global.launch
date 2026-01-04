/**
 * API Endpoint: Send Trial Reminder Emails
 * 
 * This endpoint processes all active trials and sends reminder emails
 * at the appropriate intervals. It should be called daily via cron job.
 * 
 * Vercel Cron Configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/trial-reminders",
 *     "schedule": "0 10 * * *"
 *   }]
 * }
 * 
 * This runs daily at 10:00 AM UTC
 */

import { NextResponse } from 'next/server';
import { processTrialReminders } from '@/utils/trial-reminders';

export async function GET(request) {
  try {
    // Verify the request is from Vercel Cron (security)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process all trial reminders
    const results = await processTrialReminders();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Trial reminder cron failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process trial reminders',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Allow manual triggering via POST (for testing)
export async function POST(request) {
  try {
    // Check for admin authentication or secret key
    const { secret } = await request.json();
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = await processTrialReminders();

    return NextResponse.json({
      success: true,
      manual: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Manual trial reminder failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process trial reminders',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

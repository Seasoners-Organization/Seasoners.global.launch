import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
) {
  const now = Date.now();
  const key = identifier;

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + windowMs };
    return { success: true, remaining: limit - 1 };
  }

  const record = store[key];

  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { success: true, remaining: limit - 1 };
  }

  // Increment counter
  record.count++;

  if (record.count > limit) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  return { success: true, remaining: limit - record.count };
}

export function createRateLimitMiddleware(
  limit: number = 10,
  windowMs: number = 60000
) {
  return (request: NextRequest, identifier?: string) => {
    // Use IP address or custom identifier
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';
    
    const key = identifier ? `${identifier}-${ip}` : ip;
    const result = rateLimit(key, limit, windowMs);

    if (!result.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
        },
      });
    }

    return null; // Continue to next middleware
  };
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

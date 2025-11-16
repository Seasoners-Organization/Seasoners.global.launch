import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  // Allow bypassing the launch gate entirely in CI/E2E environments
  if (process.env.DISABLE_LAUNCH_GATE === 'true' || process.env.CI === 'true') {
    return NextResponse.next();
  }
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Exempt paths from launch gate
  const exemptPaths = [
    '/waitlist',
    '/api/waitlist',
    '/api/dev',
    '/api/auth',
    '/api/launch-status',
    '/api/webhooks',
    '/api/subscription',
    '/api/user',
    '/api/listings',
    '/auth',
    '/_next',
    '/favicon',
    '/manifest',
    '/public',
  ];

  const isExempt = exemptPaths.some(exemptPath => path.startsWith(exemptPath));

  // Check launch status for all non-exempt routes
  if (!isExempt) {
    try {
      // Fetch launch status via an API route (Node runtime), avoid Prisma in Edge
      const res = await fetch(new URL('/api/launch-status', request.url), {
        headers: { 'accept': 'application/json' },
        cache: 'no-store',
      });
      const launchSettings = res.ok ? await res.json() : { isLaunched: true };

      // If site is not launched, only allow early-bird users
      if (!launchSettings?.isLaunched) {
        if (!token?.isEarlyBird || token?.waitlistStatus !== 'active') {
          return NextResponse.redirect(new URL('/waitlist', request.url));
        }
      }
    } catch (error) {
      // On error, allow access to prevent site lockout
      console.error('Middleware launch status fetch failed:', error);
    }
  }

  // Check if this is an admin route
  if (path.startsWith('/admin')) {
    // Check if user is authenticated and is an admin
    if (!token || token.role !== 'ADMIN') {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Check other protected routes
  if (
    path.startsWith('/profile') ||
    path.startsWith('/list') ||
    path.includes('/inquire')
  ) {
    // Check if user is authenticated
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
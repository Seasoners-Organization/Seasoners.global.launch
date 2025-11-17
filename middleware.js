import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  // Allow bypassing the launch gate entirely in CI/E2E environments
  if (process.env.DISABLE_LAUNCH_GATE === 'true' || process.env.CI === 'true') {
    return NextResponse.next();
  }

  // Be resilient to missing NEXTAUTH_SECRET or token parsing issues
  let token = null;
  try {
    token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  } catch (err) {
    // On any token decode error in middleware, proceed unauthenticated
    console.warn('middleware getToken failed, proceeding unauthenticated');
  }

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

  // Launch gate permanently bypassed for production launch; rely only on auth below

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
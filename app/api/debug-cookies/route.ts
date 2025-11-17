import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  
  const nextAuthCookies = allCookies.filter(cookie => 
    cookie.name.includes('next-auth') || 
    cookie.name.includes('__Secure-next-auth') ||
    cookie.name.includes('__Host-next-auth')
  );
  
  return NextResponse.json({
    hasNextAuthCookies: nextAuthCookies.length > 0,
    cookieNames: nextAuthCookies.map(c => c.name),
    allCookieNames: allCookies.map(c => c.name),
  });
}

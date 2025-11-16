import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

export async function POST(req: NextRequest) {
  console.log('=== Waitlist Signup API Called ===');
  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    const { email } = body;
    if (!email || !isValidEmail(email)) {
      console.log('Invalid email:', email);
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    console.log('Checking for existing signup:', email);
    // Upsert waitlist signup
    const existing = await (prisma as any).waitlistSignup.findUnique({ where: { email } });
    if (existing) {
      console.log('Email already on waitlist');
      return NextResponse.json({ ok: true, already: true });
    }

    console.log('Creating new waitlist signup');
    await (prisma as any).waitlistSignup.create({ data: { email } });
    console.log('Successfully created waitlist signup');
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('=== Waitlist signup error ===');
    console.error('Error type:', e?.constructor?.name);
    console.error('Error message:', e?.message);
    console.error('Full error:', e);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}

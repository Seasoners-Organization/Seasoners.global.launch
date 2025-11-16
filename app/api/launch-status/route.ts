import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Launch gate retired during production; always return launched
    return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
  } catch (e) {
    console.error('Error fetching launch status', e);
    return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
  }
}

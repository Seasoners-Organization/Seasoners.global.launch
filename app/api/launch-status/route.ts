import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Launch gate retired during production; always return launched
    return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
  } catch (e) {
    console.error('Error fetching launch status', e);
    return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
  }
}

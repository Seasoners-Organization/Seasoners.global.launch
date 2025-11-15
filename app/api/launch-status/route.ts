import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await (prisma as any).launchSettings.findFirst();
    return NextResponse.json({
      isLaunched: settings?.isLaunched ?? false,
      earlyBirdActive: settings?.earlyBirdActive ?? true,
    });
  } catch (e) {
    console.error('Error fetching launch status', e);
    return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
  }
}

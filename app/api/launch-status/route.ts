import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // If explicitly disabled via env var, consider site launched
    if (process.env.DISABLE_LAUNCH_GATE === 'true') {
      return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
    }

    // If no database configured, default to launched and avoid Prisma access during builds
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
    }

    const settings = await (prisma as any).launchSettings.findFirst();
    return NextResponse.json({
      // Default to launched when no settings exist to avoid unintended gating in prod
      isLaunched: settings?.isLaunched ?? true,
      // Be conservative on early-bird when no settings exist
      earlyBirdActive: settings?.earlyBirdActive ?? false,
    });
  } catch (e) {
    console.error('Error fetching launch status', e);
    return NextResponse.json({ isLaunched: true, earlyBirdActive: false });
  }
}

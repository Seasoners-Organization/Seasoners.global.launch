import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get or create launch settings
  let settings = await (prisma as any).launchSettings.findFirst();
    
    if (!settings) {
  settings = await (prisma as any).launchSettings.create({
        data: {
          isLaunched: false,
          earlyBirdActive: true,
          earlyBirdPrice: 5.0,
          regularSearcherPrice: 7.0,
          regularListerPrice: 12.0,
        },
      });
    }

    // Get statistics
    const earlyBirdCount = await (prisma as any).user.count({ where: { isEarlyBird: true } });

    const totalSubscribers = await (prisma as any).user.count({ where: { subscriptionStatus: 'ACTIVE' } });

    const pendingWaitlist = await (prisma as any).user.count({ where: { waitlistStatus: 'pending' } });

    const waitlistSignups = await (prisma as any).waitlistSignup.count({});
    const earlyBirdLocked = await (prisma as any).waitlistSignup.count({ where: { earlyBirdLocked: true } });

    return NextResponse.json({
      ...settings,
      stats: {
        earlyBirdCount,
        totalSubscribers,
        pendingWaitlist,
        waitlistSignups,
        earlyBirdLocked,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching launch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const updates = await req.json();

    // Get or create settings
  let settings = await (prisma as any).launchSettings.findFirst();
    
    if (!settings) {
  settings = await (prisma as any).launchSettings.create({
        data: {
          isLaunched: false,
          earlyBirdActive: true,
          earlyBirdPrice: 5.0,
          regularSearcherPrice: 7.0,
          regularListerPrice: 12.0,
        },
      });
    }

    // Update settings
  const updated = await (prisma as any).launchSettings.update({
      where: { id: settings.id },
      data: {
        ...updates,
        updatedBy: (session.user as any).id,
        launchDate: updates.isLaunched && !settings.isLaunched 
          ? new Date() 
          : settings.launchDate,
      },
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error('Error updating launch settings:', error);
    return NextResponse.json(
      { error: 'Failed to update launch settings' },
      { status: 500 }
    );
  }
}

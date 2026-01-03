import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { listingId, reason, details } = await req.json();

    if (!listingId || !reason || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Store report (you'll need to create this model in schema.prisma later)
    // For now, just log it and send email notification
    console.log('📢 Listing Report:', {
      listingId,
      reportedBy: user.email,
      reason,
      details,
      timestamp: new Date().toISOString()
    });

    // TODO: Add to moderation queue or send admin email notification
    
    return NextResponse.json(
      { message: 'Report submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user's data in order (due to foreign key constraints)
    // 1. Delete reviews given by user
    await prisma.review.deleteMany({
      where: { reviewerId: user.id },
    });

    // 2. Delete reviews received by user
    await prisma.review.deleteMany({
      where: { targetId: user.id },
    });

    // 3. Delete agreements where user is host
    await (prisma as any).agreement.deleteMany({
      where: { hostId: user.id },
    });

    // 4. Delete agreements where user is guest
    await (prisma as any).agreement.deleteMany({
      where: { guestId: user.id },
    });

    // 5. Delete user's listings (reviews are already deleted)
    await prisma.listing.deleteMany({
      where: { userId: user.id },
    });

    // 6. Delete verification attempts
    await (prisma as any).verificationAttempt.deleteMany({
      where: { userId: user.id },
    });

    // 7. Delete waitlist signups
    await (prisma as any).waitlistSignup.deleteMany({
      where: { userId: user.id },
    });

    // 8. Delete accounts (OAuth)
    await prisma.account.deleteMany({
      where: { userId: user.id },
    });

    // 9. Delete sessions
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    // 10. Finally, delete the user
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      message: 'Account deleted successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../../lib/auth';
import crypto from 'crypto';
import { sendAgreementSignedEmail } from '../../../../utils/agreement-emails';

const prisma = new PrismaClient();

/**
 * GET /api/agreements/[id]
 * Fetch a single agreement by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const agreement = await prisma.agreement.findUnique({
      where: { id: params.id },
      include: {
        listing: true,
        host: {
          select: { id: true, name: true, email: true, image: true, trustScore: true },
        },
        guest: {
          select: { id: true, name: true, email: true, image: true, trustScore: true },
        },
      },
    });

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    // Verify user is party to agreement
    if (
      agreement.hostId !== currentUser.id &&
      agreement.guestId !== currentUser.id
    ) {
      return NextResponse.json(
        { error: 'Not authorized to view this agreement' },
        { status: 403 }
      );
    }

    return NextResponse.json(agreement);
  } catch (error) {
    console.error('Error fetching agreement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agreement' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agreements/[id]
 * Update agreement (add signature, update status)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const agreement = await prisma.agreement.findUnique({
      where: { id: params.id },
    });

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    // Verify user is party to agreement
    if (
      agreement.hostId !== currentUser.id &&
      agreement.guestId !== currentUser.id
    ) {
      return NextResponse.json(
        { error: 'Not authorized to modify this agreement' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, status: newStatus } = body;

    // Handle signature action
    if (action === 'sign') {
      const signatures = (agreement.signatures as any[]) || [];

      // Check if user already signed
      const alreadySigned = signatures.some(
        (sig: any) => sig.userId === currentUser.id
      );

      if (alreadySigned) {
        return NextResponse.json(
          { error: 'You have already signed this agreement' },
          { status: 400 }
        );
      }

      // Add signature
      const newSignature = {
        userId: currentUser.id,
        name: currentUser.name || 'Anonymous',
        signedAt: new Date().toISOString(),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      };

      signatures.push(newSignature);

      // Determine new status based on signatures
      let updatedStatus = agreement.status;
      const hostSigned = signatures.some((sig: any) => sig.userId === agreement.hostId);
      const guestSigned = signatures.some((sig: any) => sig.userId === agreement.guestId);

      if (hostSigned && guestSigned) {
        updatedStatus = 'FULLY_SIGNED';
      } else if (currentUser.id === agreement.hostId) {
        updatedStatus = 'PENDING_GUEST';
      } else if (currentUser.id === agreement.guestId) {
        updatedStatus = 'PENDING_HOST';
      }

      // Generate hash when fully signed
      let hash = agreement.hash;
      let finalizedAt = agreement.finalizedAt;
      if (updatedStatus === 'FULLY_SIGNED' && !hash) {
        const agreementContent = JSON.stringify({
          preamble: agreement.preamble,
          clauses: agreement.clauses,
          countryCode: agreement.countryCode,
          hostId: agreement.hostId,
          guestId: agreement.guestId,
          listingId: agreement.listingId,
          startDate: agreement.startDate,
          endDate: agreement.endDate,
        });
        hash = crypto.createHash('sha256').update(agreementContent).digest('hex');
        finalizedAt = new Date();

        // Update trust metrics for both parties
        await prisma.user.update({
          where: { id: agreement.hostId },
          data: { completedAgreements: { increment: 1 } },
        });
        await prisma.user.update({
          where: { id: agreement.guestId },
          data: { completedAgreements: { increment: 1 } },
        });
      }

      const updatedAgreement = await prisma.agreement.update({
        where: { id: params.id },
        data: {
          signatures,
          status: updatedStatus,
          hash,
          finalizedAt,
        },
        include: {
          listing: true,
          host: {
            select: { id: true, name: true, email: true, image: true },
          },
          guest: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });

      // Send email notifications
      try {
        // Notify the other party
        const otherPartyId = currentUser.id === updatedAgreement.hostId 
          ? updatedAgreement.guestId 
          : updatedAgreement.hostId;
        const otherParty = currentUser.id === updatedAgreement.hostId 
          ? updatedAgreement.guest 
          : updatedAgreement.host;

        await sendAgreementSignedEmail(
          updatedAgreement,
          otherParty,
          currentUser.name || 'A party'
        );

        // If fully signed, also notify the current user
        if (updatedStatus === 'FULLY_SIGNED') {
          await sendAgreementSignedEmail(
            updatedAgreement,
            currentUser,
            otherParty.name || 'The other party'
          );
        }
      } catch (emailError) {
        console.error('Failed to send agreement signed emails:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json(updatedAgreement);
    }

    // Handle status update action
    if (newStatus) {
      // Only allow certain status transitions
      const allowedTransitions: { [key: string]: string[] } = {
        DRAFT: ['PENDING_HOST', 'PENDING_GUEST', 'CANCELLED'],
        PENDING_HOST: ['FULLY_SIGNED', 'CANCELLED'],
        PENDING_GUEST: ['FULLY_SIGNED', 'CANCELLED'],
        FULLY_SIGNED: ['ACTIVE', 'CANCELLED'],
        ACTIVE: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
        DISPUTED: ['ACTIVE', 'CANCELLED'],
      };

      if (!allowedTransitions[agreement.status]?.includes(newStatus)) {
        return NextResponse.json(
          { error: `Cannot transition from ${agreement.status} to ${newStatus}` },
          { status: 400 }
        );
      }

      const updatedAgreement = await prisma.agreement.update({
        where: { id: params.id },
        data: { status: newStatus },
        include: {
          listing: true,
          host: {
            select: { id: true, name: true, email: true, image: true },
          },
          guest: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });

      // Update completed stays metric when agreement completes
      if (newStatus === 'COMPLETED') {
        await prisma.user.update({
          where: { id: agreement.hostId },
          data: { completedStays: { increment: 1 } },
        });
        await prisma.user.update({
          where: { id: agreement.guestId },
          data: { completedStays: { increment: 1 } },
        });
      }

      return NextResponse.json(updatedAgreement);
    }

    return NextResponse.json(
      { error: 'No valid action specified' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating agreement:', error);
    return NextResponse.json(
      { error: 'Failed to update agreement' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agreements/[id]
 * Delete an agreement (only in DRAFT status)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const agreement = await prisma.agreement.findUnique({
      where: { id: params.id },
    });

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    // Only host can delete, and only in DRAFT status
    if (agreement.hostId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only the host can delete agreements' },
        { status: 403 }
      );
    }

    if (agreement.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Can only delete agreements in DRAFT status' },
        { status: 400 }
      );
    }

    await prisma.agreement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agreement:', error);
    return NextResponse.json(
      { error: 'Failed to delete agreement' },
      { status: 500 }
    );
  }
}

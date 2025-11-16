import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import { authOptions } from '../../../../lib/auth';

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check admin authorization
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { verificationId, action } = await req.json();

    // Get verification details
    const verification = await prisma.verificationAttempt.findUnique({
      where: { id: verificationId },
      include: { user: true },
    });

    if (!verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    const newStatus = action === 'approve' ? 'VERIFIED' : 'REJECTED';

    // Update verification status
    await prisma.verificationAttempt.update({
      where: { id: verificationId },
      data: { status: newStatus },
    });

    // Update user verification status based on type
    const updateData = {};
    switch (verification.type) {
      case 'ID':
        updateData.identityVerified = newStatus;
        break;
      case 'BUSINESS':
        updateData.businessVerified = newStatus;
        break;
      case 'ADDRESS':
        updateData.addressVerified = newStatus;
        break;
    }

    await prisma.user.update({
      where: { id: verification.userId },
      data: updateData,
    });

    // Send email notification to user
    const emailTemplate = {
      to: verification.user.email,
      from: 'verification@seasoners.eu',
      subject: `Verification ${action === 'approve' ? 'Approved' : 'Rejected'} - Seasoners`,
      html: `
        <h1>Verification ${action === 'approve' ? 'Approved' : 'Rejected'}</h1>
        <p>Hello ${verification.user.name},</p>
        <p>Your ${verification.type.toLowerCase()} verification has been ${
          action === 'approve' ? 'approved' : 'rejected'
        }.</p>
        ${
          action === 'reject'
            ? '<p>Please submit new documents or contact support if you believe this was a mistake.</p>'
            : '<p>You can now access all features related to your account type.</p>'
        }
        <p>Best regards,<br>The Seasoners Team</p>
      `,
    };

    await sgMail.send(emailTemplate);

    return NextResponse.json({
      message: `Verification ${action}d successfully`,
      status: newStatus,
    });

  } catch (error) {
    console.error('Verification action error:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    );
  }
}
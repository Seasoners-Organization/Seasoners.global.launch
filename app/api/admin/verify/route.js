import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../_lib/auth';
import { getResend } from '../../../_lib/resend';

const prisma = new PrismaClient();

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

    // Send email notification to user via Resend (if configured)
    const resend = getResend();
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping admin verification email');
    } else {
      await resend.emails.send({
        from: 'Seasoners <onboarding@resend.dev>',
        to: verification.user.email,
        subject: `Verification ${action === 'approve' ? 'Approved' : 'Rejected'} - Seasoners`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width:560px; margin:0 auto; padding:32px 20px; color:#334155;">
            <h1 style="color:#0369a1; font-size:22px; margin:0 0 12px 0;">Verification ${action === 'approve' ? 'Approved' : 'Rejected'}</h1>
            <p style="margin:0 0 12px 0;">Hello ${verification.user.name || 'there'},</p>
            <p style="margin:0 0 12px 0;">Your ${verification.type.toLowerCase()} verification has been ${action === 'approve' ? 'approved' : 'rejected'}.</p>
            ${action === 'reject'
              ? '<p style="margin:0 0 12px 0;">Please submit new documents or contact support if you believe this was a mistake.</p>'
              : '<p style="margin:0 0 12px 0;">You can now access all features related to your account type.</p>'}
            <p style="margin:16px 0 0 0;">Best regards,<br/>The Seasoners Team</p>
          </div>
        `,
      });
    }

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
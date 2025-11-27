import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function VerifyEmailPage({ searchParams }) {
  const { token } = searchParams;
  if (!token) {
    // No token, redirect to error page
    redirect('/auth/verify?error=missing_token');
  }

  // Find the verification token
  const verification = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verification || verification.expires < new Date()) {
    // Token not found or expired
    redirect('/auth/verify?error=invalid_or_expired');
  }

  // Mark user as verified
  await prisma.user.update({
    where: { email: verification.identifier },
    data: { emailVerified: new Date() },
  });

  // Delete the token
  await prisma.verificationToken.delete({
    where: { token },
  });

  // Redirect to success page
  redirect('/auth/verify?success=email_verified');
}

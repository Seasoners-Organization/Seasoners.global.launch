const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUser() {
  const email = 'tremaynechivers@gmail.com';
  
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
        waitlistSignups: true,
      }
    });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    console.log(`User details:`, {
      isEarlyBird: user.isEarlyBird,
      waitlistStatus: user.waitlistStatus,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
    });

    // Check for waitlist signup
    const waitlistSignup = await prisma.waitlistSignup.findFirst({
      where: { email }
    });

    if (waitlistSignup) {
      console.log(`Found waitlist signup for: ${email}`);
      await prisma.waitlistSignup.delete({
        where: { id: waitlistSignup.id }
      });
      console.log('✓ Deleted waitlist signup');
    }

    // Delete related records
    if (user.accounts.length > 0) {
      await prisma.account.deleteMany({
        where: { userId: user.id }
      });
      console.log(`✓ Deleted ${user.accounts.length} account(s)`);
    }

    if (user.sessions.length > 0) {
      await prisma.session.deleteMany({
        where: { userId: user.id }
      });
      console.log(`✓ Deleted ${user.sessions.length} session(s)`);
    }

    // Delete verification tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });
    console.log('✓ Deleted verification token(s)');

    // Finally, delete the user
    await prisma.user.delete({
      where: { id: user.id }
    });

    console.log(`✅ Successfully deleted user: ${email}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkGoogleAccount() {
  const email = 'tremayne.chivers@gmail.com';
  
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    console.log(`Current accounts:`, user.accounts);
    console.log(`User details:`, {
      isEarlyBird: user.isEarlyBird,
      waitlistStatus: user.waitlistStatus,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
    });

    // Check if Google account is already linked
    const googleAccount = user.accounts.find(acc => acc.provider === 'google');
    if (googleAccount) {
      console.log('Google account already linked!');
      return;
    }

    console.log('\n✅ User is ready. You can now sign in with Google.');
    console.log('The Google account will be automatically linked on first sign-in.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkGoogleAccount();

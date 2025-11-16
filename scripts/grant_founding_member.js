const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function grantFoundingMember() {
  const email = 'tremaynechivers@gmail.com'; // Note: no dot between tremayne and chivers in DB
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        isEarlyBird: true,
        waitlistStatus: 'active',
        subscriptionTier: 'LISTER',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date('2100-01-01'),
      },
    });

    console.log('✅ Successfully granted founding member status!');
    console.log('User:', user.email);
    console.log('Early Bird:', user.isEarlyBird);
    console.log('Waitlist Status:', user.waitlistStatus);
    console.log('Subscription:', user.subscriptionTier, user.subscriptionStatus);
    console.log('Expires:', user.subscriptionExpiresAt);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

grantFoundingMember();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isEarlyBird: true,
        waitlistStatus: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log('\n---');
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name || 'N/A'}`);
      console.log(`Early Bird: ${user.isEarlyBird}`);
      console.log(`Waitlist Status: ${user.waitlistStatus}`);
      console.log(`Subscription: ${user.subscriptionTier} (${user.subscriptionStatus})`);
      console.log(`Created: ${user.createdAt}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();

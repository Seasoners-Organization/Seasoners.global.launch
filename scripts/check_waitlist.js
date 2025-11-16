const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkWaitlist() {
  const email = 'tremayne.chivers@gmail.com';
  
  try {
    const waitlistSignup = await prisma.waitlistSignup.findFirst({
      where: { email }
    });

    if (waitlistSignup) {
      console.log(`Found waitlist signup:`, waitlistSignup);
      
      // Delete it
      await prisma.waitlistSignup.delete({
        where: { id: waitlistSignup.id }
      });
      console.log(`✅ Deleted waitlist signup for: ${email}`);
    } else {
      console.log(`No waitlist signup found for: ${email}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWaitlist();

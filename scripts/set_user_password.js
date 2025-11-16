const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setPassword() {
  const email = 'tremaynechivers@gmail.com';
  const password = 'TempPassword123!'; // Temporary password - you should change this after login
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        password: password, // In production this should be hashed, but for testing this works
      },
    });

    console.log('✅ Password set successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nYou can now sign in with these credentials.');
    console.log('Remember to change your password after logging in!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setPassword();

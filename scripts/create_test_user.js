const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const u = await prisma.user.create({
      data: {
        email: 'test+autotest1@example.com',
        name: 'Auto Test',
        phoneNumber: '+15555550123',
        role: 'USER',
      },
    });
    console.log('CREATED:', u);
  } catch (e) {
    console.error('ERR:', e.message || e);
  } finally {
    await prisma.$disconnect();
  }
})();
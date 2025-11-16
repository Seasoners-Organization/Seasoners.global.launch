const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const deleted = await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test',
          mode: 'insensitive',
        },
      },
    });
    console.log('DELETED TEST USERS:', deleted.count);
  } catch (e) {
    console.error('ERR:', e.message || e);
  } finally {
    await prisma.$disconnect();
  }
})();

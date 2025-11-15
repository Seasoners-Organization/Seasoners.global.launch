const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async () => {
  const prisma = new PrismaClient();
  const email = `smoke+${Date.now()}@example.com`;
  try {
    const hashed = await bcrypt.hash('P@ssw0rd123', 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: 'Smoke Test',
      },
      select: { id: true, email: true, password: true, createdAt: true },
    });
    console.log('CREATED USER OK:', user);

    // Clean up
    await prisma.user.delete({ where: { id: user.id } });
    console.log('DELETED USER OK:', user.id);
  } catch (e) {
    console.error('SMOKE TEST FAILED:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();

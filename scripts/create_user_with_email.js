const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node scripts/create_user_with_email.js <email>');
      process.exit(1);
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: 'CI User', role: 'USER' },
      });
      console.log(JSON.stringify({ id: user.id, email: user.email }));
    } else {
      console.log(JSON.stringify({ id: user.id, email: user.email }));
    }
  } catch (e) {
    console.error('ERR:', e.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

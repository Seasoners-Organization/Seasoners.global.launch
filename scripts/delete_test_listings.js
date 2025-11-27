const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    // Delete listings with test/demo titles or locations
    const deleteResult = await prisma.listing.deleteMany({
      where: {
        OR: [
          { title: { contains: 'Test', mode: 'insensitive' } },
          { title: { contains: 'Smoke', mode: 'insensitive' } },
          { location: { contains: 'Test', mode: 'insensitive' } },
          { description: { contains: 'test', mode: 'insensitive' } },
        ],
      },
    });
    console.log(`Deleted ${deleteResult.count} test/demo listings.`);
  } catch (e) {
    console.error('Error deleting test listings:', e.message || e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();

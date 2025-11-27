const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const deleteResult = await prisma.listing.deleteMany({});
    console.log(`Deleted ${deleteResult.count} listings (all listings removed).`);
  } catch (e) {
    console.error('Error deleting all listings:', e.message || e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();

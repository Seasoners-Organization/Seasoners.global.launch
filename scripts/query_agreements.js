const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const listingId = process.argv[2];
    if (!listingId) {
      console.error('Usage: node scripts/query_agreements.js <listingId>');
      process.exit(1);
    }

    const ags = await prisma.agreement.findMany({ where: { listingId } });
    console.log('Agreements for', listingId, ags.map(a => ({ id: a.id, status: a.status, createdAt: a.createdAt }))); 
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

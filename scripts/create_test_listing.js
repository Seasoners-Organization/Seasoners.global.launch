const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    // Reuse or create a test user
    const email = 'test+autotest1@example.com';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name: 'Auto Test', role: 'USER' } });
      console.error('Created user:', user.id);
    } else {
      console.error('Found user:', user.id);
    }

    // Create a listing for that user
    const listing = await prisma.listing.create({
      data: {
        title: 'Smoke Test Listing',
        description: 'Temporary listing for smoke tests',
        type: 'STAY',
        price: 0,
        location: 'Testville',
        region: 'TIROL',
        city: 'Test City',
        photos: [],
        userId: user.id,
        verified: false,
      },
    });

    console.error('Created listing', listing.id);
    // Final JSON output for CI consumers (stdout)
    console.log(JSON.stringify({ userId: user.id, listingId: listing.id }));
  } catch (e) {
    console.error('Error creating test listing:', e.message || e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();

const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const listingId = process.argv[2];
    if (!listingId) {
      console.error('Usage: node scripts/emulate_host_create_agreement.js <listingId>');
      process.exit(1);
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      console.error('Listing not found:', listingId);
      process.exit(1);
    }

    const host = await prisma.user.findUnique({ where: { id: listing.userId } });
    if (!host) {
      console.error('Host user not found for listing:', listing.userId);
      process.exit(1);
    }

    const agreement = await prisma.agreement.create({
      data: {
        listingId: listing.id,
        hostId: host.id,
        guestId: host.id, // placeholder guest same as host for emulation
        preamble: 'Emulated host-created agreement (smoke test)',
        clauses: [{ title: 'Emulated', content: 'This is a host-created agreement.' }],
        countryCode: 'AT',
        status: 'DRAFT'
      }
    });

    console.log('Created agreement:', agreement.id);
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

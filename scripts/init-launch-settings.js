const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initializing launch settings...');

  // Check if launch settings already exist
  const existing = await prisma.launchSettings.findFirst();

  if (existing) {
    console.log('✅ Launch settings already exist:', {
      isLaunched: existing.isLaunched,
      earlyBirdActive: existing.earlyBirdActive,
    });
    return;
  }

  // Create default launch settings
  const settings = await prisma.launchSettings.create({
    data: {
      isLaunched: false,
      earlyBirdActive: true,
      earlyBirdPrice: 5.0,
      regularSearcherPrice: 7.0,
      regularListerPrice: 12.0,
    },
  });

  console.log('✅ Launch settings created:', {
    isLaunched: settings.isLaunched,
    earlyBirdActive: settings.earlyBirdActive,
    earlyBirdPrice: settings.earlyBirdPrice,
  });

  console.log('\n📋 Next steps:');
  console.log('1. Create a €5/month recurring price in your Stripe dashboard');
  console.log('2. Add the price ID to .env as STRIPE_EARLY_BIRD_PRICE_ID');
  console.log('3. Configure webhook endpoint in Stripe dashboard');
  console.log('4. Add webhook secret to .env as STRIPE_WEBHOOK_SECRET');
  console.log('5. Visit /admin/launch to control site launch status');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

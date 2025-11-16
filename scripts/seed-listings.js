const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleListings = [
  // STAYS - Winter destinations
  {
    title: "Cozy Studio in Innsbruck",
    description: "Perfect for a winter season worker! This fully furnished studio apartment is located just 10 minutes from the Nordkette ski area. Includes heating, WiFi, and all utilities. The apartment features a kitchenette, bathroom, and a comfortable living space with mountain views.",
    type: "STAY",
    price: 650,
    location: "Innsbruck, Tirol",
    region: "TIROL",
    city: "Innsbruck",
    photos: [],
    verified: true,
  },
  {
    title: "Shared Chalet Room - Kitzbühel",
    description: "Join our international team! We have a room available in our staff chalet near Kitzbühel ski resort. Shared kitchen, living room, and bathrooms. Perfect for ski instructors or resort workers. Walking distance to lifts and town center. Lively social atmosphere!",
    type: "STAY",
    price: 450,
    location: "Kitzbühel, Tirol",
    region: "TIROL",
    city: "Kitzbühel",
    photos: [],
    verified: true,
  },
  {
    title: "Mountain Apartment - Zell am See",
    description: "Beautiful 2-bedroom apartment available for the winter season. Modern furnishings, balcony with lake and mountain views. Close to ski areas and town amenities. Ideal for couples or two friends working in the area. Parking included.",
    type: "STAY",
    price: 850,
    location: "Zell am See, Salzburg",
    region: "SALZBURG",
    city: "Zell am See",
    photos: [],
    verified: true,
  },
  {
    title: "Single Room in Ski Resort Village",
    description: "Private room in a shared house in Sölden. Perfect for resort staff or ski instructors. Shared facilities with 4 other seasonal workers. Great community vibe. 5-minute walk to main lifts.",
    type: "STAY",
    price: 400,
    location: "Sölden, Tirol",
    region: "TIROL",
    city: "Sölden",
    photos: [],
    verified: true,
  },
  // STAYS - Summer destinations
  {
    title: "Lake View Apartment - Wörthersee",
    description: "Stunning apartment with direct lake access! Available for summer season workers. Fully equipped kitchen, spacious living area, and private balcony overlooking Wörthersee. Perfect for hospitality staff or activity instructors. 10-minute walk to Velden town center.",
    type: "STAY",
    price: 750,
    location: "Velden am Wörthersee, Carinthia",
    region: "CARINTHIA",
    city: "Velden",
    photos: [],
    verified: true,
  },
  {
    title: "Garden Studio - Hallstatt",
    description: "Charming studio with garden in the UNESCO World Heritage village of Hallstatt. Ideal for summer tourism workers. Quiet location, fully furnished, includes utilities. Bike storage available. Walking distance to town center and lake.",
    type: "STAY",
    price: 600,
    location: "Hallstatt, Upper Austria",
    region: "UPPER_AUSTRIA",
    city: "Hallstatt",
    photos: [],
    verified: true,
  },
  {
    title: "Shared House - Hiking Guides Welcome",
    description: "Room available in shared house near Bad Gastein. Perfect for outdoor activity staff, hiking guides, or summer resort workers. Shared kitchen and living spaces. Mountain views, peaceful surroundings. Access to hiking trails from doorstep.",
    type: "STAY",
    price: 480,
    location: "Bad Gastein, Salzburg",
    region: "SALZBURG",
    city: "Bad Gastein",
    photos: [],
    verified: true,
  },

  // JOBS - Winter season
  {
    title: "Ski Instructor - All Levels",
    description: "Established ski school in Tirol seeking qualified instructors for winter 2025/26 season. Must have valid instructor certification. Competitive pay, flexible hours, staff accommodation available. Experience with children preferred but not essential. International team, English required.",
    type: "JOB",
    price: 0,
    location: "St. Anton am Arlberg, Tirol",
    region: "TIROL",
    city: "St. Anton",
    photos: [],
    verified: true,
  },
  {
    title: "Hotel Receptionist - Winter Season",
    description: "4-star hotel in Kitzbühel seeks friendly receptionist for December-April season. Front desk duties, guest relations, reservations. German and English required, additional languages a plus. Staff accommodation and meals provided. Prior hospitality experience preferred.",
    type: "JOB",
    price: 0,
    location: "Kitzbühel, Tirol",
    region: "TIROL",
    city: "Kitzbühel",
    photos: [],
    verified: true,
  },
  {
    title: "Lift Operator - Ski Resort",
    description: "Multiple positions available for reliable lift operators. Full training provided. Dec 1 - Apr 15 season. Must be physically fit and comfortable working outdoors in all weather. Accommodation assistance available. Great team atmosphere!",
    type: "JOB",
    price: 0,
    location: "Ischgl, Tirol",
    region: "TIROL",
    city: "Ischgl",
    photos: [],
    verified: true,
  },
  {
    title: "Après-Ski Bar Staff",
    description: "Busy après-ski bar looking for energetic bartenders and servers! Must love music and creating a party atmosphere. Flexible shifts, good tips, staff discounts. Experience preferred but will train the right candidates. Accommodation help available.",
    type: "JOB",
    price: 0,
    location: "Saalbach, Salzburg",
    region: "SALZBURG",
    city: "Saalbach",
    photos: [],
    verified: true,
  },

  // JOBS - Summer season
  {
    title: "Mountain Bike Guide",
    description: "Adventure company seeks experienced mountain bike guides for summer season. Lead groups through alpine trails, conduct safety briefings, maintain equipment. First aid certification required. Jun-Sep contract. Staff housing and meals included.",
    type: "JOB",
    price: 0,
    location: "Saalbach, Salzburg",
    region: "SALZBURG",
    city: "Saalbach",
    photos: [],
    verified: true,
  },
  {
    title: "Lakeside Restaurant Server",
    description: "Upscale lakeside restaurant hiring servers for summer season. Experience in fine dining preferred. German essential, English required. May-September. Competitive wages plus tips. Beautiful work environment with lake views!",
    type: "JOB",
    price: 0,
    location: "Velden am Wörthersee, Carinthia",
    region: "CARINTHIA",
    city: "Velden",
    photos: [],
    verified: true,
  },
  {
    title: "Outdoor Activity Instructor",
    description: "Multi-activity role: rafting, canyoning, hiking guide. Training provided for motivated candidates. Must be confident swimmer and outdoor enthusiast. Jun-Sep season. Accommodation in staff house. International team, fun work environment!",
    type: "JOB",
    price: 0,
    location: "Ötztal, Tirol",
    region: "TIROL",
    city: "Ötztal",
    photos: [],
    verified: true,
  },
  {
    title: "Hotel Housekeeping Staff",
    description: "Boutique hotel seeking housekeeping staff for summer season. Attention to detail essential. Prior hospitality experience preferred. Staff accommodation available. May-October contract with potential extension. Meals and uniforms provided.",
    type: "JOB",
    price: 0,
    location: "Hallstatt, Upper Austria",
    region: "UPPER_AUSTRIA",
    city: "Hallstatt",
    photos: [],
    verified: true,
  },

  // FLATSHARES
  {
    title: "Room Available in Innsbruck Flatshare",
    description: "We're a group of 3 seasonal workers (ski instructors and hotel staff) looking for a 4th housemate! Cozy 4-bedroom apartment near city center. Shared kitchen, living room, 2 bathrooms. Looking for someone tidy, social, and working in the winter season. Age 22-35 preferred.",
    type: "FLATSHARE",
    price: 420,
    location: "Innsbruck, Tirol",
    region: "TIROL",
    city: "Innsbruck",
    photos: [],
    verified: true,
    totalRoommates: 4,
    currentRoommates: ["Alex (ski instructor)", "Maria (hotel receptionist)", "Tom (bartender)"],
    lookingForGender: "ANY",
    spotsAvailable: 1,
  },
  {
    title: "Female Housemate Wanted - Salzburg",
    description: "Female flatshare seeking 1 more housemate for winter season. We're two girls working in hospitality (25 & 28 years old). 3-bed apartment with balcony, 10 mins from city center. Non-smoker preferred. Friendly, relaxed atmosphere. Available from December.",
    type: "FLATSHARE",
    price: 480,
    location: "Salzburg, Salzburg",
    region: "SALZBURG",
    city: "Salzburg",
    photos: [],
    verified: true,
    totalRoommates: 3,
    currentRoommates: ["Lisa (hotel manager)", "Sarah (tour guide)"],
    lookingForGender: "FEMALE",
    spotsAvailable: 1,
  },
];

async function main() {
  console.log('🌱 Starting seed...');
  
  // Create or find a seed user (host for all listings)
  let seedUser = await prisma.user.findUnique({
    where: { email: 'seed@seasoners.eu' },
  });

  if (!seedUser) {
    console.log('Creating seed user...');
    seedUser = await prisma.user.create({
      data: {
        email: 'seed@seasoners.eu',
        name: 'Seasoners Host',
        role: 'HOST',
        emailVerified: new Date(),
        trustScore: 85,
        subscriptionTier: 'LISTER',
        subscriptionStatus: 'ACTIVE',
      },
    });
    console.log('✅ Seed user created');
  } else {
    console.log('✅ Seed user already exists');
  }

  // Create listings
  console.log(`Creating ${sampleListings.length} sample listings...`);
  let created = 0;
  
  for (const listing of sampleListings) {
    try {
      await prisma.listing.create({
        data: {
          ...listing,
          userId: seedUser.id,
        },
      });
      created++;
      process.stdout.write(`\r✅ Created ${created}/${sampleListings.length} listings`);
    } catch (error) {
      console.error(`\n❌ Failed to create listing: ${listing.title}`, error.message);
    }
  }

  console.log(`\n\n🎉 Seeding complete! Created ${created} listings.`);
  console.log('\nSummary:');
  
  const stays = await prisma.listing.count({ where: { type: 'STAY' } });
  const jobs = await prisma.listing.count({ where: { type: 'JOB' } });
  const flatshares = await prisma.listing.count({ where: { type: 'FLATSHARE' } });
  
  console.log(`  🏠 Stays: ${stays}`);
  console.log(`  💼 Jobs: ${jobs}`);
  console.log(`  🏘️  Flatshares: ${flatshares}`);
  console.log(`  📊 Total: ${stays + jobs + flatshares}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

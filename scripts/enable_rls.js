#!/usr/bin/env node

/**
 * Script to enable Row Level Security (RLS) on Supabase tables
 * 
 * This script:
 * 1. Reads the RLS migration SQL file
 * 2. Applies it directly to the database
 * 3. Ensures the service role key is used (bypasses RLS)
 * 
 * Usage: node scripts/enable_rls.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔒 Enabling Row Level Security on Supabase tables...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    console.error('   Please set it in your .env file or environment\n');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      '..',
      'prisma',
      'migrations',
      '20251119_enable_rls',
      'migration.sql'
    );

    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ ERROR: Migration file not found at ${migrationPath}\n`);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('🚀 Applying RLS policies to database...\n');

    // Execute the migration
    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log('✓ Executed statement');
      } catch (error) {
        // Ignore errors for policies that already exist
        if (error.message.includes('already exists')) {
          console.log('⚠ Policy already exists (skipping)');
        } else {
          console.error(`❌ Error executing statement: ${error.message}`);
          throw error;
        }
      }
    }

    console.log('\n✅ Row Level Security enabled successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify in Supabase Dashboard → Authentication → Policies');
    console.log('   2. Ensure your DATABASE_URL uses the service role key in production');
    console.log('   3. Test your application to ensure everything works\n');

  } catch (error) {
    console.error('\n❌ ERROR enabling RLS:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

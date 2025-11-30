#!/bin/bash

# Migration script using direct (non-pooled) database connection
# Supabase pgBouncer (port 6543) doesn't support schema migrations
# Use direct connection (port 5432) instead

echo "🔄 Running Prisma migration with direct database connection..."

# Check if DIRECT_DATABASE_URL is set
if [ -z "$DIRECT_DATABASE_URL" ]; then
  echo "⚠️  DIRECT_DATABASE_URL not set"
  echo "📝 Using DATABASE_URL as fallback (ensure it points to port 5432, not 6543)"
  npx prisma migrate deploy
else
  echo "✅ Using DIRECT_DATABASE_URL for migration"
  DATABASE_URL="$DIRECT_DATABASE_URL" npx prisma migrate deploy
fi

echo "✅ Migration complete. Generating Prisma client..."
npx prisma generate

echo "🎉 Done! Message model should now be available in the database."

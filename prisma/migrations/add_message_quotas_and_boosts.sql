-- Update subscription tiers: rename SEARCHER/LISTER to PLUS, keep FREE
-- This migration preserves existing subscriptions by mapping them to PLUS

-- Step 1: Add new enum value temporarily
ALTER TYPE "SubscriptionTier" ADD VALUE IF NOT EXISTS 'PLUS';

-- Step 2: Update existing SEARCHER and LISTER users to PLUS
-- (preserves their active subscription status)
UPDATE "User" 
SET "subscriptionTier" = 'PLUS'::"SubscriptionTier"
WHERE "subscriptionTier" IN ('SEARCHER'::"SubscriptionTier", 'LISTER'::"SubscriptionTier");

-- Step 3: Add new fields to Listing table
ALTER TABLE "Listing" 
ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "featuredUntil" TIMESTAMP(3);

-- Step 4: Create MessageUsage table
CREATE TABLE IF NOT EXISTS "MessageUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageUsage_pkey" PRIMARY KEY ("id")
);

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS "MessageUsage_userId_periodStart_key" ON "MessageUsage"("userId", "periodStart");

-- Create regular indexes
CREATE INDEX IF NOT EXISTS "MessageUsage_userId_idx" ON "MessageUsage"("userId");
CREATE INDEX IF NOT EXISTS "MessageUsage_periodStart_idx" ON "MessageUsage"("periodStart");

-- Step 5: Create ListingBoost table
CREATE TABLE IF NOT EXISTS "ListingBoost" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingBoost_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "ListingBoost_stripePaymentIntentId_key" ON "ListingBoost"("stripePaymentIntentId");
CREATE UNIQUE INDEX IF NOT EXISTS "ListingBoost_stripeCheckoutSessionId_key" ON "ListingBoost"("stripeCheckoutSessionId");

-- Create regular indexes
CREATE INDEX IF NOT EXISTS "ListingBoost_listingId_idx" ON "ListingBoost"("listingId");
CREATE INDEX IF NOT EXISTS "ListingBoost_userId_idx" ON "ListingBoost"("userId");
CREATE INDEX IF NOT EXISTS "ListingBoost_expiresAt_idx" ON "ListingBoost"("expiresAt");

-- Step 6: Add foreign key constraints
ALTER TABLE "MessageUsage" 
ADD CONSTRAINT "MessageUsage_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ListingBoost" 
ADD CONSTRAINT "ListingBoost_listingId_fkey" 
FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 7: Create index for featured listings
CREATE INDEX IF NOT EXISTS "Listing_isFeatured_featuredUntil_idx" ON "Listing"("isFeatured", "featuredUntil");

-- Migration complete
-- Note: The old enum values (SEARCHER, LISTER) will be removed in the next Prisma migration
-- For now they coexist with PLUS but are no longer used

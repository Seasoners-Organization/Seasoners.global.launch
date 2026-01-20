-- Enable RLS on MessageUsage table
ALTER TABLE "public"."MessageUsage" ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own message usage
CREATE POLICY "Users can view their own message usage"
ON "public"."MessageUsage"
FOR SELECT
USING (auth.uid()::text = "userId");

-- Create policy: Users can only insert their own message usage
CREATE POLICY "Users can insert their own message usage"
ON "public"."MessageUsage"
FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

-- Create policy: Users can only update their own message usage
CREATE POLICY "Users can update their own message usage"
ON "public"."MessageUsage"
FOR UPDATE
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- Enable RLS on ListingBoost table
ALTER TABLE "public"."ListingBoost" ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view boosts for their own listings and their own purchases
CREATE POLICY "Users can view their listing boosts"
ON "public"."ListingBoost"
FOR SELECT
USING (
  auth.uid()::text = "userId"
  OR
  "listingId" IN (
    SELECT id FROM "public"."Listing" WHERE "userId" = auth.uid()::text
  )
);

-- Create policy: Users can only insert boosts for listings they own
CREATE POLICY "Users can insert boosts for their listings"
ON "public"."ListingBoost"
FOR INSERT
WITH CHECK (
  auth.uid()::text = "userId"
  AND
  "listingId" IN (
    SELECT id FROM "public"."Listing" WHERE "userId" = auth.uid()::text
  )
);

-- Create policy: Users can only update boosts they purchased or for their listings
CREATE POLICY "Users can update their listing boosts"
ON "public"."ListingBoost"
FOR UPDATE
USING (
  auth.uid()::text = "userId"
  OR
  "listingId" IN (
    SELECT id FROM "public"."Listing" WHERE "userId" = auth.uid()::text
  )
)
WITH CHECK (
  auth.uid()::text = "userId"
  OR
  "listingId" IN (
    SELECT id FROM "public"."Listing" WHERE "userId" = auth.uid()::text
  )
);

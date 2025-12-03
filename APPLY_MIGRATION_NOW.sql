-- ===========================================
-- QUICK FIX: Run this in Supabase SQL Editor
-- ===========================================
-- Go to: https://supabase.com/dashboard → SQL Editor → New Query
-- Paste this entire script and click Run

-- Add Message table for messaging feature
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "listingId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Message_senderId_recipientId_idx" 
    ON "Message"("senderId", "recipientId");

CREATE INDEX IF NOT EXISTS "Message_listingId_idx" 
    ON "Message"("listingId");

-- Add foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Message_senderId_fkey'
    ) THEN
        ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" 
            FOREIGN KEY ("senderId") REFERENCES "User"("id") 
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Message_recipientId_fkey'
    ) THEN
        ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" 
            FOREIGN KEY ("recipientId") REFERENCES "User"("id") 
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Message_listingId_fkey'
    ) THEN
        ALTER TABLE "Message" ADD CONSTRAINT "Message_listingId_fkey" 
            FOREIGN KEY ("listingId") REFERENCES "Listing"("id") 
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Verify table was created
SELECT 
    'Message table created successfully!' as status,
    count(*) as message_count
FROM "Message";

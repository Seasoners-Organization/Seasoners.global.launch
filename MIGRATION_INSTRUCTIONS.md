# Message Table Migration Instructions

The Message table migration needs to be applied to your Supabase database.

## Option 1: Run via Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the SQL below:

```sql
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

-- CreateIndex
CREATE INDEX "Message_senderId_recipientId_idx" ON "Message"("senderId", "recipientId");

-- CreateIndex
CREATE INDEX "Message_listingId_idx" ON "Message"("listingId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

5. Click **Run** (or press Cmd+Enter)
6. Verify success message appears

## Option 2: Via Prisma Studio (if direct connection available)

If you have a DIRECT_DATABASE_URL environment variable with port 5432:

```bash
export DIRECT_DATABASE_URL="postgresql://postgres:Zirl%213141516%21@db.owftpnisfdzkgjvrepjt.supabase.co:5432/postgres?sslmode=require"
DATABASE_URL=$DIRECT_DATABASE_URL npx prisma migrate deploy
```

## After Migration

Once applied, restart your development server and the messaging feature will work:
```bash
npm run dev
```

The error "The table `public.Message` does not exist" will be resolved.

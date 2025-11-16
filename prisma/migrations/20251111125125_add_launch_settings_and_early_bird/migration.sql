-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'PENDING_HOST', 'PENDING_GUEST', 'FULLY_SIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "completedAgreements" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedStays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "culturalNotesAdded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "earlyBirdSignupDate" TIMESTAMP(3),
ADD COLUMN     "helpfulFlags" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isEarlyBird" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "preferredLanguage" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "reviewsGivenCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewsReceivedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "storiesShared" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trustScoreLastCalculated" TIMESTAMP(3),
ADD COLUMN     "waitlistStatus" TEXT DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "preamble" TEXT NOT NULL,
    "clauses" JSONB NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'AT',
    "signatures" JSONB NOT NULL DEFAULT '[]',
    "hash" TEXT,
    "status" "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finalizedAt" TIMESTAMP(3),
    "listingId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaunchSettings" (
    "id" TEXT NOT NULL,
    "isLaunched" BOOLEAN NOT NULL DEFAULT false,
    "earlyBirdActive" BOOLEAN NOT NULL DEFAULT true,
    "earlyBirdPrice" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "regularSearcherPrice" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
    "regularListerPrice" DOUBLE PRECISION NOT NULL DEFAULT 12.0,
    "launchDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "LaunchSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_hash_key" ON "Agreement"("hash");

-- CreateIndex
CREATE INDEX "Agreement_hostId_idx" ON "Agreement"("hostId");

-- CreateIndex
CREATE INDEX "Agreement_guestId_idx" ON "Agreement"("guestId");

-- CreateIndex
CREATE INDEX "Agreement_listingId_idx" ON "Agreement"("listingId");

-- CreateIndex
CREATE INDEX "Agreement_status_idx" ON "Agreement"("status");

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

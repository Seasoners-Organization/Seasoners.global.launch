/*
  Warnings:

  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Region" AS ENUM ('BURGENLAND', 'CARINTHIA', 'LOWER_AUSTRIA', 'SALZBURG', 'STYRIA', 'TIROL', 'UPPER_AUSTRIA', 'VIENNA', 'VORARLBERG');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "type",
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "city" TEXT,
ADD COLUMN     "region" "Region";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockoutUntil" TIMESTAMP(3),
ADD COLUMN     "password" TEXT;

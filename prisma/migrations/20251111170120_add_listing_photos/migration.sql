-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "currentRoommates" JSONB,
ADD COLUMN     "lookingForGender" TEXT,
ADD COLUMN     "photos" JSONB,
ADD COLUMN     "spotsAvailable" INTEGER,
ADD COLUMN     "totalRoommates" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "availability" JSONB,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "hasWorkPermit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interests" JSONB,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "openToOpportunities" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "preferredRegions" JSONB,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "profileVisibility" TEXT NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "skills" JSONB,
ADD COLUMN     "spokenLanguages" JSONB,
ADD COLUMN     "willingToRelocate" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "workExperience" TEXT,
ADD COLUMN     "workPermitCountries" JSONB;

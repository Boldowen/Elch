CREATE TYPE "GuideAvailabilityStatus" AS ENUM ('AVAILABLE', 'BLOCKED');

CREATE TABLE "GuideAvailability" (
  "id" UUID NOT NULL,
  "guideId" UUID NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "timeZone" VARCHAR(100) NOT NULL,
  "status" "GuideAvailabilityStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideAvailability_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GuideAvailability_valid_interval" CHECK ("endsAt" > "startsAt"),
  CONSTRAINT "GuideAvailability_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GuideAvailability_guideId_startsAt_endsAt_idx" ON "GuideAvailability"("guideId", "startsAt", "endsAt");

-- Make tourism-source verification and reuse rights explicit. A recent date or
-- source title must never be treated as proof of human review.

CREATE TYPE "TourismSourceReviewStatus" AS ENUM (
  'PENDING', 'HUMAN_VERIFIED', 'REJECTED'
);

ALTER TABLE "TourismSource"
  ADD COLUMN "licenseOrUsageNote" TEXT,
  ADD COLUMN "reviewStatus" "TourismSourceReviewStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "reviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewedById" UUID,
  ADD COLUMN "reviewNotes" TEXT;

UPDATE "TourismSource"
SET "licenseOrUsageNote" = 'Reuse rights require human review before production use';

ALTER TABLE "TourismSource"
  ALTER COLUMN "licenseOrUsageNote" SET NOT NULL;

CREATE INDEX "TourismSource_reviewStatus_lastVerifiedAt_idx"
  ON "TourismSource"("reviewStatus", "lastVerifiedAt");

CREATE INDEX "TourismSource_reviewedById_reviewedAt_idx"
  ON "TourismSource"("reviewedById", "reviewedAt");

ALTER TABLE "TourismSource"
  ADD CONSTRAINT "TourismSource_reviewedById_fkey"
  FOREIGN KEY ("reviewedById") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GuideProfile"
  ADD COLUMN "acceptanceRate" INTEGER NOT NULL DEFAULT 100,
  ADD COLUMN "providerCancellationCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "confirmedReportCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "rankingUpdatedAt" TIMESTAMP(3);

ALTER TABLE "GuideProfile" ADD CONSTRAINT "GuideProfile_rate_ranges" CHECK (
  "responseRate" >= 0 AND "responseRate" <= 100
  AND "acceptanceRate" >= 0 AND "acceptanceRate" <= 100
  AND "providerCancellationCount" >= 0 AND "confirmedReportCount" >= 0
);

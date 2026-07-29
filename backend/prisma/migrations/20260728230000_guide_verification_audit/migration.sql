CREATE TYPE "GuideVerificationDecision" AS ENUM ('APPROVED', 'REJECTED');
CREATE TYPE "VerificationCheckStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'NOT_PROVIDED');
ALTER TYPE "NotificationType" ADD VALUE 'GUIDE_APPLICATION_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'GUIDE_APPLICATION_REJECTED';

CREATE TABLE "GuideVerificationReview" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "reviewerId" UUID NOT NULL,
  "decision" "GuideVerificationDecision" NOT NULL,
  "decisionReason" TEXT,
  "internalNote" TEXT,
  "assessmentScore" INTEGER NOT NULL,
  "assessmentBreakdown" JSONB NOT NULL,
  "documentStatus" "VerificationCheckStatus" NOT NULL,
  "referenceStatus" "VerificationCheckStatus" NOT NULL,
  "applicationSnapshot" JSONB NOT NULL,
  "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GuideVerificationReview_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GuideVerificationReview_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "GuideVerificationReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "GuideVerificationReview_score_range" CHECK ("assessmentScore" >= 0 AND "assessmentScore" <= 100),
  CONSTRAINT "GuideVerificationReview_reject_reason" CHECK (
    "decision" <> 'REJECTED' OR ("decisionReason" IS NOT NULL AND length(trim("decisionReason")) > 0)
  )
);

CREATE INDEX "GuideVerificationReview_guideProfileId_reviewedAt_idx" ON "GuideVerificationReview"("guideProfileId", "reviewedAt");
CREATE INDEX "GuideVerificationReview_reviewerId_reviewedAt_idx" ON "GuideVerificationReview"("reviewerId", "reviewedAt");

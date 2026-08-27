CREATE TYPE "GuideLegalRole" AS ENUM ('LICENSED_PROFESSIONAL', 'LOCAL_HOST');
CREATE TYPE "GuideEvidenceType" AS ENUM ('IDENTITY', 'PROFESSIONAL_LICENSE', 'LANGUAGE', 'FIRST_AID', 'INSURANCE', 'SPECIALTY');
CREATE TYPE "CompetencyTaskType" AS ENUM ('PERFORMANCE', 'GENERAL_KNOWLEDGE', 'ROUTE_KNOWLEDGE', 'LANGUAGE', 'FIRST_AID_THEORY', 'SAFETY_SCENARIO');

ALTER TABLE "GuideProfile"
  ADD COLUMN "legalRole" "GuideLegalRole" NOT NULL DEFAULT 'LICENSED_PROFESSIONAL',
  ADD COLUMN "routeBadges" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "specialtySkills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "firstAidVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "languageEstimate" JSONB;

CREATE TABLE "GuideEvidence" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "type" "GuideEvidenceType" NOT NULL,
  "issuer" TEXT NOT NULL,
  "reference" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "status" "VerificationCheckStatus" NOT NULL DEFAULT 'PENDING',
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideEvidence_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GuideEvidence_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CompetencyAttempt" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "taskType" "CompetencyTaskType" NOT NULL,
  "routeId" TEXT,
  "rubricVersion" TEXT NOT NULL,
  "aiScore" DECIMAL(5,2) NOT NULL,
  "humanScores" JSONB,
  "confidence" DECIMAL(4,3) NOT NULL,
  "breakdown" JSONB NOT NULL,
  "passed" BOOLEAN NOT NULL,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CompetencyAttempt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CompetencyAttempt_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GuideEvidence_guideProfileId_type_status_idx" ON "GuideEvidence"("guideProfileId", "type", "status");
CREATE INDEX "GuideEvidence_expiresAt_idx" ON "GuideEvidence"("expiresAt");
CREATE INDEX "CompetencyAttempt_guideProfileId_taskType_createdAt_idx" ON "CompetencyAttempt"("guideProfileId", "taskType", "createdAt");
CREATE INDEX "CompetencyAttempt_routeId_passed_idx" ON "CompetencyAttempt"("routeId", "passed");

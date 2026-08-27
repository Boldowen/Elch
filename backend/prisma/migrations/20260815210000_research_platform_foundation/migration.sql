-- Expand legal roles without assuming that an approved marketplace profile holds
-- a professional license. The legacy value is retained for application compatibility.
ALTER TABLE "GuideProfile" ALTER COLUMN "legalRole" DROP DEFAULT;
ALTER TYPE "GuideLegalRole" RENAME TO "GuideLegalRole_old";
CREATE TYPE "GuideLegalRole" AS ENUM (
  'UNVERIFIED',
  'LICENSED_PROFESSIONAL',
  'LICENSED_PROFESSIONAL_GUIDE',
  'LOCAL_HOST',
  'SPECIALIST_INSTRUCTOR'
);
ALTER TABLE "GuideProfile"
  ALTER COLUMN "legalRole" TYPE "GuideLegalRole"
  USING ("legalRole"::text::"GuideLegalRole");
DROP TYPE "GuideLegalRole_old";

UPDATE "GuideProfile" AS guide
SET "legalRole" = 'UNVERIFIED'
WHERE guide."legalRole" = 'LICENSED_PROFESSIONAL'
  AND NOT EXISTS (
    SELECT 1
    FROM "GuideEvidence" AS evidence
    WHERE evidence."guideProfileId" = guide."id"
      AND evidence."type" = 'PROFESSIONAL_LICENSE'
      AND evidence."status" = 'VERIFIED'
      AND evidence."verifiedAt" IS NOT NULL
      AND (evidence."expiresAt" IS NULL OR evidence."expiresAt" > CURRENT_TIMESTAMP)
  );

ALTER TABLE "GuideProfile"
  ALTER COLUMN "legalRole" SET DEFAULT 'UNVERIFIED';

CREATE TYPE "TourismSourceType" AS ENUM ('WEBSITE', 'LAW', 'REGULATION', 'REPORT', 'DATASET', 'MAP', 'ARTICLE', 'BOOK', 'OTHER');
CREATE TYPE "TourismAuthorityLevel" AS ENUM ('GOVERNMENT', 'LEGAL', 'OFFICIAL_TOURISM', 'UNESCO', 'LOCAL_AUTHORITY', 'MUSEUM', 'PROTECTED_AREA', 'VERIFIED_OPERATOR', 'OTHER');
CREATE TYPE "TourismKnowledgeCategory" AS ENUM ('HISTORY', 'CULTURE', 'GEOGRAPHY', 'NATURE', 'LAW', 'SAFETY', 'FIRST_AID_REFERENCE', 'ROUTE_INFORMATION', 'DESTINATION_INFORMATION', 'TOURISM_GUIDANCE');
CREATE TYPE "RouteFamily" AS ENUM ('CENTRAL_HERITAGE', 'GOBI', 'KHUVSGUL', 'WESTERN_ALTAI');
CREATE TYPE "RouteRiskLevel" AS ENUM ('R0', 'R1', 'R2', 'R3', 'R4');
CREATE TYPE "RouteNodeType" AS ENUM ('CITY', 'DESTINATION', 'HERITAGE', 'MUSEUM', 'NATURE', 'TRAILHEAD', 'TRANSPORT_HUB', 'ACCOMMODATION', 'OTHER');
CREATE TYPE "RouteTransportMode" AS ENUM ('ROAD', 'OFF_ROAD', 'TREK', 'BOAT', 'AIR', 'RAIL', 'HORSE', 'OTHER');
CREATE TYPE "GuideCompetencyType" AS ENUM ('GENERAL_KNOWLEDGE', 'GUIDE_SKILL', 'LANGUAGE', 'ROUTE_SPECIFIC', 'FIRST_AID_THEORY', 'SAFETY', 'SPECIALTY');
CREATE TYPE "GuideCompetencyStatus" AS ENUM ('NOT_ASSESSED', 'AI_PRE_SCREENED', 'HUMAN_VERIFIED', 'DOCUMENT_VERIFIED', 'EXPIRED', 'REJECTED');
CREATE TYPE "CefrLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE "FirstAidCertificateStatus" AS ENUM ('NOT_PROVIDED', 'PENDING', 'DOCUMENT_VERIFIED', 'EXPIRED', 'REJECTED');
CREATE TYPE "PracticalVerificationStatus" AS ENUM ('NOT_ASSESSED', 'PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');
CREATE TYPE "AssessmentCategory" AS ENUM ('HISTORY_ARCHAEOLOGY', 'RELIGION_CULTURE', 'GEOGRAPHY_NATURE', 'LAW_ETHICS', 'SOCIETY_ECONOMY', 'ROUTE_SPECIFIC', 'SAFETY', 'FIRST_AID_THEORY', 'LANGUAGE', 'GUIDE_SKILL');
CREATE TYPE "AssessmentQuestionType" AS ENUM ('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'OPEN_EXPLANATION', 'SCENARIO', 'SPEAKING_TASK');
CREATE TYPE "AssessmentDifficulty" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE "AssessmentType" AS ENUM ('LANGUAGE', 'GENERAL_KNOWLEDGE', 'GUIDE_SKILL', 'ROUTE_COMPETENCY', 'FIRST_AID_THEORY', 'SAFETY_SCENARIO');
CREATE TYPE "AssessmentAttemptStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'AI_SCORED', 'HUMAN_REVIEWED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "EvaluatorType" AS ENUM ('AI', 'HUMAN', 'HYBRID');
CREATE TYPE "HumanReviewStatus" AS ENUM ('NOT_REQUESTED', 'PENDING', 'BLIND_REVIEW_IN_PROGRESS', 'VERIFIED', 'REJECTED', 'REASSESSMENT_REQUIRED');
CREATE TYPE "AssessmentReviewDecision" AS ENUM ('VERIFIED', 'REJECTED', 'REASSESSMENT_REQUIRED');
CREATE TYPE "AiExperimentMode" AS ENUM ('A', 'B', 'C', 'D', 'E');
CREATE TYPE "AiRequestType" AS ENUM ('GENERAL_TRAVEL', 'DESTINATION_QA', 'ITINERARY', 'ROUTE_PLANNING', 'GUIDE_SEARCH', 'GUIDE_MATCHING', 'TOUR_SEARCH', 'TOUR_COMPARISON', 'TRANSLATION', 'SAFETY_INFORMATION', 'BOOKING_HELP', 'OTHER');
CREATE TYPE "AiConversationStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "AiMessageRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT', 'TOOL');

CREATE TABLE "TourismSource" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "sourceType" "TourismSourceType" NOT NULL,
  "authorityLevel" "TourismAuthorityLevel" NOT NULL,
  "url" TEXT NOT NULL,
  "language" VARCHAR(16) NOT NULL,
  "publishedAt" TIMESTAMP(3),
  "validFrom" TIMESTAMP(3),
  "validTo" TIMESTAMP(3),
  "lastVerifiedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TourismSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TourismKnowledge" (
  "id" UUID NOT NULL,
  "sourceId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "contentHash" VARCHAR(64) NOT NULL,
  "chunkIndex" INTEGER NOT NULL DEFAULT 0,
  "region" TEXT,
  "routeFamily" "RouteFamily",
  "category" "TourismKnowledgeCategory" NOT NULL,
  "language" VARCHAR(16) NOT NULL,
  "embedding" JSONB,
  "embeddingReference" TEXT,
  "embeddingModel" TEXT,
  "tokenCount" INTEGER,
  "metadata" JSONB,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastVerifiedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TourismKnowledge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ResearchRoute" (
  "id" UUID NOT NULL,
  "sourceId" UUID,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "routeFamily" "RouteFamily" NOT NULL,
  "description" TEXT NOT NULL,
  "minimumDays" INTEGER NOT NULL,
  "recommendedDays" INTEGER NOT NULL,
  "riskLevel" "RouteRiskLevel" NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResearchRoute_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RouteNode" (
  "id" UUID NOT NULL,
  "routeId" UUID NOT NULL,
  "sourceId" UUID,
  "destinationId" TEXT,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "latitude" DECIMAL(9,6) NOT NULL,
  "longitude" DECIMAL(9,6) NOT NULL,
  "altitude" INTEGER,
  "nodeType" "RouteNodeType" NOT NULL,
  "sequenceHint" INTEGER,
  "minimumVisitMinutes" INTEGER NOT NULL DEFAULT 0,
  "seasonalityMetadata" JSONB,
  "accessMetadata" JSONB,
  "safetyMetadata" JSONB,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RouteNode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RouteEdge" (
  "id" UUID NOT NULL,
  "routeId" UUID NOT NULL,
  "fromNodeId" UUID NOT NULL,
  "toNodeId" UUID NOT NULL,
  "sourceId" UUID NOT NULL,
  "transportMode" "RouteTransportMode" NOT NULL,
  "distanceKm" DECIMAL(9,2) NOT NULL,
  "estimatedTravelMinutes" INTEGER NOT NULL,
  "estimatedCostMinor" INTEGER,
  "estimatedCostCurrency" VARCHAR(3),
  "terrain" TEXT,
  "riskLevel" "RouteRiskLevel" NOT NULL,
  "seasonality" JSONB,
  "bidirectional" BOOLEAN NOT NULL DEFAULT false,
  "requiresRoadCheck" BOOLEAN NOT NULL DEFAULT false,
  "requiresWeatherCheck" BOOLEAN NOT NULL DEFAULT false,
  "requiresPermitCheck" BOOLEAN NOT NULL DEFAULT false,
  "requiresGuide" BOOLEAN NOT NULL DEFAULT false,
  "requiredGuideCompetencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "emergencyPlanRequired" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastVerifiedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RouteEdge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideCompetency" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "routeId" UUID,
  "assessmentAttemptId" UUID,
  "competencyType" "GuideCompetencyType" NOT NULL,
  "competencyCode" TEXT NOT NULL,
  "score" DECIMAL(5,2) NOT NULL,
  "status" "GuideCompetencyStatus" NOT NULL DEFAULT 'NOT_ASSESSED',
  "verifiedById" UUID,
  "verificationMethod" TEXT,
  "validFrom" TIMESTAMP(3),
  "validTo" TIMESTAMP(3),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideCompetency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideLanguageAssessment" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "assessmentAttemptId" UUID,
  "language" VARCHAR(32) NOT NULL,
  "officialEvidenceType" TEXT,
  "officialEvidenceValue" TEXT,
  "aiEstimatedCefr" "CefrLevel",
  "aiConfidence" DECIMAL(4,3),
  "fluencyScore" DECIMAL(5,2),
  "grammarScore" DECIMAL(5,2),
  "vocabularyScore" DECIMAL(5,2),
  "interactionScore" DECIMAL(5,2),
  "clarityScore" DECIMAL(5,2),
  "humanVerifiedCefr" "CefrLevel",
  "assessmentStatus" "GuideCompetencyStatus" NOT NULL DEFAULT 'NOT_ASSESSED',
  "verifiedById" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideLanguageAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideKnowledgeAssessment" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "assessmentAttemptId" UUID,
  "historyScore" DECIMAL(5,2) NOT NULL,
  "cultureScore" DECIMAL(5,2) NOT NULL,
  "geographyNatureScore" DECIMAL(5,2) NOT NULL,
  "lawEthicsScore" DECIMAL(5,2) NOT NULL,
  "societyEconomyScore" DECIMAL(5,2) NOT NULL,
  "totalScore" DECIMAL(5,2) NOT NULL,
  "pass" BOOLEAN NOT NULL,
  "evaluatorType" "EvaluatorType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideKnowledgeAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideSkillAssessment" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "assessmentAttemptId" UUID,
  "communicationScore" DECIMAL(5,2) NOT NULL,
  "guidingTechniqueScore" DECIMAL(5,2) NOT NULL,
  "explanationStructureScore" DECIMAL(5,2) NOT NULL,
  "factualPresentationScore" DECIMAL(5,2) NOT NULL,
  "groupCareScore" DECIMAL(5,2) NOT NULL,
  "questionHandlingScore" DECIMAL(5,2) NOT NULL,
  "professionalismScore" DECIMAL(5,2) NOT NULL,
  "totalScore" DECIMAL(5,2) NOT NULL,
  "aiConfidence" DECIMAL(4,3),
  "humanReviewStatus" "HumanReviewStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideSkillAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideRouteCompetency" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "routeId" UUID,
  "assessmentAttemptId" UUID,
  "routeFamily" "RouteFamily" NOT NULL,
  "score" DECIMAL(5,2) NOT NULL,
  "status" "GuideCompetencyStatus" NOT NULL DEFAULT 'NOT_ASSESSED',
  "passedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "evaluatorType" "EvaluatorType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideRouteCompetency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideFirstAid" (
  "id" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "assessmentAttemptId" UUID,
  "certificateProvider" TEXT,
  "certificateReference" TEXT,
  "issuedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "certificateStatus" "FirstAidCertificateStatus" NOT NULL DEFAULT 'NOT_PROVIDED',
  "theoryScore" DECIMAL(5,2),
  "practicalVerificationStatus" "PracticalVerificationStatus" NOT NULL DEFAULT 'NOT_ASSESSED',
  "verifiedAt" TIMESTAMP(3),
  "verifiedById" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideFirstAid_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssessmentQuestion" (
  "id" UUID NOT NULL,
  "category" "AssessmentCategory" NOT NULL,
  "routeFamily" "RouteFamily",
  "difficulty" "AssessmentDifficulty" NOT NULL,
  "language" VARCHAR(16) NOT NULL,
  "questionType" "AssessmentQuestionType" NOT NULL,
  "prompt" TEXT NOT NULL,
  "responseOptions" JSONB,
  "answerKey" JSONB NOT NULL,
  "scoringRubric" JSONB NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "sourceId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssessmentAttempt" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "routeId" UUID,
  "routeFamily" "RouteFamily",
  "assessmentType" "AssessmentType" NOT NULL,
  "language" VARCHAR(16),
  "status" "AssessmentAttemptStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "rubricVersion" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3),
  "submittedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "score" DECIMAL(5,2),
  "aiScore" DECIMAL(5,2),
  "humanScore" DECIMAL(5,2),
  "passed" BOOLEAN,
  "humanPassed" BOOLEAN,
  "aiEstimatedCefr" "CefrLevel",
  "humanCefr" "CefrLevel",
  "aiConfidence" DECIMAL(4,3),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AssessmentAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssessmentResponse" (
  "id" UUID NOT NULL,
  "assessmentAttemptId" UUID NOT NULL,
  "questionId" UUID NOT NULL,
  "responseText" TEXT,
  "responsePayload" JSONB,
  "audioReference" TEXT,
  "aiScore" DECIMAL(5,2),
  "humanScore" DECIMAL(5,2),
  "aiFeedback" JSONB,
  "humanFeedback" JSONB,
  "unsafeActionDetected" BOOLEAN,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AssessmentResponse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssessmentReview" (
  "id" UUID NOT NULL,
  "assessmentAttemptId" UUID NOT NULL,
  "reviewerId" UUID NOT NULL,
  "blindEvaluation" BOOLEAN NOT NULL DEFAULT true,
  "decision" "AssessmentReviewDecision" NOT NULL,
  "humanScore" DECIMAL(5,2),
  "humanPassed" BOOLEAN,
  "humanCefr" "CefrLevel",
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AssessmentReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiConversation" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "title" TEXT,
  "experimentMode" "AiExperimentMode" NOT NULL,
  "status" "AiConversationStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiMessage" (
  "id" UUID NOT NULL,
  "conversationId" UUID NOT NULL,
  "role" "AiMessageRole" NOT NULL,
  "content" TEXT NOT NULL,
  "structuredContent" JSONB,
  "sources" JSONB,
  "toolName" TEXT,
  "model" TEXT,
  "tokenCount" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiExperimentRun" (
  "id" UUID NOT NULL,
  "userId" UUID,
  "conversationId" UUID,
  "routeId" UUID,
  "experimentMode" "AiExperimentMode" NOT NULL,
  "requestType" "AiRequestType" NOT NULL,
  "provider" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "promptVersion" TEXT NOT NULL,
  "routeFamily" "RouteFamily",
  "inputTokens" INTEGER NOT NULL DEFAULT 0,
  "outputTokens" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" INTEGER NOT NULL,
  "estimatedCost" DECIMAL(14,8) NOT NULL DEFAULT 0,
  "toolCalls" JSONB NOT NULL,
  "validatorResult" JSONB,
  "finalValidity" BOOLEAN,
  "failureReason" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiExperimentRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiEvaluationResult" (
  "id" UUID NOT NULL,
  "experimentRunId" UUID NOT NULL,
  "reviewerId" UUID,
  "evaluatorType" "EvaluatorType" NOT NULL,
  "blindEvaluation" BOOLEAN NOT NULL DEFAULT false,
  "factualAccuracy" DECIMAL(5,2),
  "hallucinationDetected" BOOLEAN,
  "poiValidity" DECIMAL(5,2),
  "spatialFeasibility" DECIMAL(5,2),
  "temporalFeasibility" DECIMAL(5,2),
  "budgetCompliance" DECIMAL(5,2),
  "seasonCompliance" DECIMAL(5,2),
  "safetyViolation" BOOLEAN,
  "personalizationScore" DECIMAL(5,2),
  "aiScore" DECIMAL(5,2),
  "humanScore" DECIMAL(5,2),
  "aiPass" BOOLEAN,
  "humanPass" BOOLEAN,
  "aiCefr" "CefrLevel",
  "humanCefr" "CefrLevel",
  "safetyFalseNegative" BOOLEAN,
  "safetyFalsePositive" BOOLEAN,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AiEvaluationResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideMatchRun" (
  "id" UUID NOT NULL,
  "userId" UUID,
  "routeId" UUID,
  "experimentRunId" UUID,
  "routeFamily" "RouteFamily",
  "requestedStartAt" TIMESTAMP(3),
  "requestedEndAt" TIMESTAMP(3),
  "language" VARCHAR(32) NOT NULL,
  "minimumCefr" "CefrLevel",
  "requirements" JSONB NOT NULL,
  "weights" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GuideMatchRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuideMatchResult" (
  "id" UUID NOT NULL,
  "guideMatchRunId" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "eligible" BOOLEAN NOT NULL,
  "score" DECIMAL(6,3) NOT NULL,
  "rank" INTEGER,
  "hardGateFailures" JSONB NOT NULL,
  "factors" JSONB NOT NULL,
  "reasons" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GuideMatchResult_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TourismSource_authorityLevel_lastVerifiedAt_idx" ON "TourismSource"("authorityLevel", "lastVerifiedAt");
CREATE INDEX "TourismSource_organization_idx" ON "TourismSource"("organization");
CREATE INDEX "TourismSource_validTo_idx" ON "TourismSource"("validTo");

CREATE INDEX "TourismKnowledge_routeFamily_category_language_active_idx" ON "TourismKnowledge"("routeFamily", "category", "language", "active");
CREATE INDEX "TourismKnowledge_region_language_active_idx" ON "TourismKnowledge"("region", "language", "active");
CREATE INDEX "TourismKnowledge_lastVerifiedAt_idx" ON "TourismKnowledge"("lastVerifiedAt");
CREATE UNIQUE INDEX "TourismKnowledge_sourceId_contentHash_language_key" ON "TourismKnowledge"("sourceId", "contentHash", "language");

CREATE UNIQUE INDEX "ResearchRoute_code_key" ON "ResearchRoute"("code");
CREATE INDEX "ResearchRoute_routeFamily_active_idx" ON "ResearchRoute"("routeFamily", "active");
CREATE INDEX "ResearchRoute_riskLevel_active_idx" ON "ResearchRoute"("riskLevel", "active");

CREATE INDEX "RouteNode_routeId_sequenceHint_idx" ON "RouteNode"("routeId", "sequenceHint");
CREATE INDEX "RouteNode_destinationId_idx" ON "RouteNode"("destinationId");
CREATE UNIQUE INDEX "RouteNode_routeId_code_key" ON "RouteNode"("routeId", "code");

CREATE INDEX "RouteEdge_routeId_active_idx" ON "RouteEdge"("routeId", "active");
CREATE INDEX "RouteEdge_fromNodeId_toNodeId_idx" ON "RouteEdge"("fromNodeId", "toNodeId");
CREATE INDEX "RouteEdge_riskLevel_active_idx" ON "RouteEdge"("riskLevel", "active");
CREATE INDEX "RouteEdge_lastVerifiedAt_idx" ON "RouteEdge"("lastVerifiedAt");
CREATE UNIQUE INDEX "RouteEdge_routeId_fromNodeId_toNodeId_transportMode_key" ON "RouteEdge"("routeId", "fromNodeId", "toNodeId", "transportMode");

CREATE INDEX "GuideCompetency_guideProfileId_competencyType_status_idx" ON "GuideCompetency"("guideProfileId", "competencyType", "status");
CREATE INDEX "GuideCompetency_competencyCode_status_validTo_idx" ON "GuideCompetency"("competencyCode", "status", "validTo");
CREATE INDEX "GuideCompetency_routeId_status_idx" ON "GuideCompetency"("routeId", "status");

CREATE UNIQUE INDEX "GuideLanguageAssessment_assessmentAttemptId_key" ON "GuideLanguageAssessment"("assessmentAttemptId");
CREATE INDEX "GuideLanguageAssessment_guideProfileId_language_assessmentS_idx" ON "GuideLanguageAssessment"("guideProfileId", "language", "assessmentStatus");
CREATE INDEX "GuideLanguageAssessment_language_humanVerifiedCefr_assessme_idx" ON "GuideLanguageAssessment"("language", "humanVerifiedCefr", "assessmentStatus");

CREATE UNIQUE INDEX "GuideKnowledgeAssessment_assessmentAttemptId_key" ON "GuideKnowledgeAssessment"("assessmentAttemptId");
CREATE INDEX "GuideKnowledgeAssessment_guideProfileId_createdAt_idx" ON "GuideKnowledgeAssessment"("guideProfileId", "createdAt");
CREATE INDEX "GuideKnowledgeAssessment_pass_evaluatorType_idx" ON "GuideKnowledgeAssessment"("pass", "evaluatorType");

CREATE UNIQUE INDEX "GuideSkillAssessment_assessmentAttemptId_key" ON "GuideSkillAssessment"("assessmentAttemptId");
CREATE INDEX "GuideSkillAssessment_guideProfileId_createdAt_idx" ON "GuideSkillAssessment"("guideProfileId", "createdAt");
CREATE INDEX "GuideSkillAssessment_humanReviewStatus_createdAt_idx" ON "GuideSkillAssessment"("humanReviewStatus", "createdAt");

CREATE UNIQUE INDEX "GuideRouteCompetency_assessmentAttemptId_key" ON "GuideRouteCompetency"("assessmentAttemptId");
CREATE INDEX "GuideRouteCompetency_guideProfileId_routeFamily_status_idx" ON "GuideRouteCompetency"("guideProfileId", "routeFamily", "status");
CREATE INDEX "GuideRouteCompetency_routeId_status_expiresAt_idx" ON "GuideRouteCompetency"("routeId", "status", "expiresAt");

CREATE UNIQUE INDEX "GuideFirstAid_assessmentAttemptId_key" ON "GuideFirstAid"("assessmentAttemptId");
CREATE INDEX "GuideFirstAid_guideProfileId_certificateStatus_expiresAt_idx" ON "GuideFirstAid"("guideProfileId", "certificateStatus", "expiresAt");
CREATE INDEX "GuideFirstAid_practicalVerificationStatus_idx" ON "GuideFirstAid"("practicalVerificationStatus");

CREATE INDEX "AssessmentQuestion_category_routeFamily_difficulty_language_idx" ON "AssessmentQuestion"("category", "routeFamily", "difficulty", "language", "active");
CREATE INDEX "AssessmentQuestion_sourceId_active_idx" ON "AssessmentQuestion"("sourceId", "active");

CREATE INDEX "AssessmentAttempt_userId_status_createdAt_idx" ON "AssessmentAttempt"("userId", "status", "createdAt");
CREATE INDEX "AssessmentAttempt_guideProfileId_assessmentType_status_crea_idx" ON "AssessmentAttempt"("guideProfileId", "assessmentType", "status", "createdAt");
CREATE INDEX "AssessmentAttempt_routeId_status_idx" ON "AssessmentAttempt"("routeId", "status");
-- Prisma cannot express this partial NULLS NOT DISTINCT index. PostgreSQL 17's
-- null-equality semantics are equivalent to COALESCE sentinels without casting
-- the RouteFamily enum to text in an index expression.
CREATE UNIQUE INDEX "AssessmentAttempt_one_active_scope_key"
ON "AssessmentAttempt"(
  "userId",
  "assessmentType",
  "routeFamily",
  "language"
)
NULLS NOT DISTINCT
WHERE "status" IN ('NOT_STARTED', 'IN_PROGRESS');

CREATE INDEX "AssessmentResponse_questionId_idx" ON "AssessmentResponse"("questionId");
CREATE UNIQUE INDEX "AssessmentResponse_assessmentAttemptId_questionId_key" ON "AssessmentResponse"("assessmentAttemptId", "questionId");

CREATE INDEX "AssessmentReview_reviewerId_createdAt_idx" ON "AssessmentReview"("reviewerId", "createdAt");
CREATE UNIQUE INDEX "AssessmentReview_assessmentAttemptId_reviewerId_key" ON "AssessmentReview"("assessmentAttemptId", "reviewerId");

CREATE INDEX "AiConversation_userId_status_updatedAt_idx" ON "AiConversation"("userId", "status", "updatedAt");
CREATE INDEX "AiConversation_deletedAt_idx" ON "AiConversation"("deletedAt");
CREATE INDEX "AiMessage_conversationId_createdAt_idx" ON "AiMessage"("conversationId", "createdAt");

CREATE INDEX "AiExperimentRun_experimentMode_requestType_createdAt_idx" ON "AiExperimentRun"("experimentMode", "requestType", "createdAt");
CREATE INDEX "AiExperimentRun_userId_createdAt_idx" ON "AiExperimentRun"("userId", "createdAt");
CREATE INDEX "AiExperimentRun_routeFamily_createdAt_idx" ON "AiExperimentRun"("routeFamily", "createdAt");
CREATE INDEX "AiExperimentRun_conversationId_createdAt_idx" ON "AiExperimentRun"("conversationId", "createdAt");

CREATE INDEX "AiEvaluationResult_experimentRunId_evaluatorType_idx" ON "AiEvaluationResult"("experimentRunId", "evaluatorType");

-- Prevent retrying the same reviewer submission from creating duplicate human rows.
CREATE UNIQUE INDEX "AiEvaluationResult_experimentRunId_reviewerId_evaluatorType_key" ON "AiEvaluationResult"("experimentRunId", "reviewerId", "evaluatorType");
CREATE INDEX "AiEvaluationResult_reviewerId_createdAt_idx" ON "AiEvaluationResult"("reviewerId", "createdAt");

CREATE INDEX "GuideMatchRun_userId_createdAt_idx" ON "GuideMatchRun"("userId", "createdAt");
CREATE INDEX "GuideMatchRun_routeId_createdAt_idx" ON "GuideMatchRun"("routeId", "createdAt");
CREATE INDEX "GuideMatchRun_experimentRunId_idx" ON "GuideMatchRun"("experimentRunId");

CREATE INDEX "GuideMatchResult_guideProfileId_createdAt_idx" ON "GuideMatchResult"("guideProfileId", "createdAt");
CREATE INDEX "GuideMatchResult_guideMatchRunId_eligible_rank_idx" ON "GuideMatchResult"("guideMatchRunId", "eligible", "rank");
CREATE UNIQUE INDEX "GuideMatchResult_guideMatchRunId_guideProfileId_key" ON "GuideMatchResult"("guideMatchRunId", "guideProfileId");

ALTER TABLE "TourismKnowledge" ADD CONSTRAINT "TourismKnowledge_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TourismSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ResearchRoute" ADD CONSTRAINT "ResearchRoute_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TourismSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RouteNode" ADD CONSTRAINT "RouteNode_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RouteNode" ADD CONSTRAINT "RouteNode_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TourismSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RouteEdge" ADD CONSTRAINT "RouteEdge_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RouteEdge" ADD CONSTRAINT "RouteEdge_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "RouteNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RouteEdge" ADD CONSTRAINT "RouteEdge_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "RouteNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RouteEdge" ADD CONSTRAINT "RouteEdge_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TourismSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TourismSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AssessmentReview" ADD CONSTRAINT "AssessmentReview_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssessmentReview" ADD CONSTRAINT "AssessmentReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GuideCompetency" ADD CONSTRAINT "GuideCompetency_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuideCompetency" ADD CONSTRAINT "GuideCompetency_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideCompetency" ADD CONSTRAINT "GuideCompetency_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideCompetency" ADD CONSTRAINT "GuideCompetency_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GuideLanguageAssessment" ADD CONSTRAINT "GuideLanguageAssessment_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuideLanguageAssessment" ADD CONSTRAINT "GuideLanguageAssessment_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideLanguageAssessment" ADD CONSTRAINT "GuideLanguageAssessment_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GuideKnowledgeAssessment" ADD CONSTRAINT "GuideKnowledgeAssessment_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuideKnowledgeAssessment" ADD CONSTRAINT "GuideKnowledgeAssessment_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideSkillAssessment" ADD CONSTRAINT "GuideSkillAssessment_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuideSkillAssessment" ADD CONSTRAINT "GuideSkillAssessment_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GuideRouteCompetency" ADD CONSTRAINT "GuideRouteCompetency_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuideRouteCompetency" ADD CONSTRAINT "GuideRouteCompetency_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideRouteCompetency" ADD CONSTRAINT "GuideRouteCompetency_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GuideFirstAid" ADD CONSTRAINT "GuideFirstAid_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuideFirstAid" ADD CONSTRAINT "GuideFirstAid_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideFirstAid" ADD CONSTRAINT "GuideFirstAid_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiExperimentRun" ADD CONSTRAINT "AiExperimentRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiExperimentRun" ADD CONSTRAINT "AiExperimentRun_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiExperimentRun" ADD CONSTRAINT "AiExperimentRun_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiEvaluationResult" ADD CONSTRAINT "AiEvaluationResult_experimentRunId_fkey" FOREIGN KEY ("experimentRunId") REFERENCES "AiExperimentRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiEvaluationResult" ADD CONSTRAINT "AiEvaluationResult_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GuideMatchRun" ADD CONSTRAINT "GuideMatchRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideMatchRun" ADD CONSTRAINT "GuideMatchRun_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideMatchRun" ADD CONSTRAINT "GuideMatchRun_experimentRunId_fkey" FOREIGN KEY ("experimentRunId") REFERENCES "AiExperimentRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuideMatchResult" ADD CONSTRAINT "GuideMatchResult_guideMatchRunId_fkey" FOREIGN KEY ("guideMatchRunId") REFERENCES "GuideMatchRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuideMatchResult" ADD CONSTRAINT "GuideMatchResult_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

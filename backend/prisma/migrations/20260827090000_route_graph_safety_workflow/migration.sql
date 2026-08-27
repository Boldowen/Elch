-- Move RouteGraph runtime ownership into PostgreSQL and add an explicit,
-- human-reviewed R3/R4 safety-plan lifecycle.

ALTER TYPE "VerificationCheckStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';

CREATE TYPE "SafetyPlanStatus" AS ENUM (
  'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'REVOKED', 'EXPIRED'
);

CREATE TYPE "SafetyPlanAuditAction" AS ENUM (
  'CREATED', 'UPDATED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'REVOKED', 'EXPIRED'
);

ALTER TABLE "ResearchRoute"
  ADD COLUMN "minimumLanguageLevel" "CefrLevel" NOT NULL DEFAULT 'B2',
  ADD COLUMN "routeBadge" TEXT,
  ADD COLUMN "firstAidRequired" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "requiredGuideLegalRole" "GuideLegalRole" NOT NULL DEFAULT 'LICENSED_PROFESSIONAL_GUIDE',
  ADD COLUMN "requiredSpecialtySkills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "ResearchRoute"
SET
  "routeBadge" = "code",
  "requiredSpecialtySkills" = CASE "code"
    WHEN 'central-heritage' THEN ARRAY['heritage-interpretation']::TEXT[]
    WHEN 'gobi' THEN ARRAY['remote-navigation', 'heat-safety']::TEXT[]
    WHEN 'khuvsgul' THEN ARRAY['water-safety', 'cold-exposure']::TEXT[]
    WHEN 'western-altai' THEN ARRAY['trekking', 'altitude-safety']::TEXT[]
    ELSE ARRAY[]::TEXT[]
  END,
  "requiredGuideLegalRole" = CASE "code"
    WHEN 'western-altai' THEN 'SPECIALIST_INSTRUCTOR'::"GuideLegalRole"
    ELSE 'LICENSED_PROFESSIONAL_GUIDE'::"GuideLegalRole"
  END;

ALTER TABLE "ResearchRoute" ALTER COLUMN "routeBadge" SET NOT NULL;

ALTER TABLE "RouteNode"
  ADD COLUMN "nameMn" TEXT,
  ADD COLUMN "nameEn" TEXT,
  ADD COLUMN "region" TEXT;

UPDATE "RouteNode"
SET "nameMn" = "name", "nameEn" = "name", "region" = '';

ALTER TABLE "RouteNode"
  ALTER COLUMN "nameMn" SET NOT NULL,
  ALTER COLUMN "nameEn" SET NOT NULL,
  ALTER COLUMN "region" SET NOT NULL;

ALTER TABLE "RouteEdge" ADD COLUMN "code" TEXT;

UPDATE "RouteEdge" AS edge
SET "code" = from_node."code" || '-' || to_node."code"
FROM "RouteNode" AS from_node, "RouteNode" AS to_node
WHERE edge."fromNodeId" = from_node."id"
  AND edge."toNodeId" = to_node."id";

ALTER TABLE "RouteEdge" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "RouteEdge_routeId_code_key" ON "RouteEdge"("routeId", "code");

CREATE TABLE "SafetyPlan" (
  "id" UUID NOT NULL,
  "routeId" UUID NOT NULL,
  "createdById" UUID NOT NULL,
  "guideProfileId" UUID NOT NULL,
  "reviewedById" UUID,
  "title" TEXT NOT NULL,
  "tripStartAt" TIMESTAMP(3) NOT NULL,
  "tripEndAt" TIMESTAMP(3) NOT NULL,
  "riskLevelSnapshot" "RouteRiskLevel" NOT NULL,
  "itinerary" JSONB NOT NULL,
  "emergencyContacts" JSONB NOT NULL,
  "communicationsPlan" TEXT NOT NULL,
  "evacuationPlan" TEXT NOT NULL,
  "medicalPlan" TEXT NOT NULL,
  "riskMitigations" JSONB NOT NULL,
  "equipmentChecklist" JSONB NOT NULL,
  "permitReferences" JSONB,
  "status" "SafetyPlanStatus" NOT NULL DEFAULT 'DRAFT',
  "version" INTEGER NOT NULL DEFAULT 1,
  "submittedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "reviewNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SafetyPlan_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SafetyPlan_trip_window_check" CHECK ("tripEndAt" > "tripStartAt"),
  CONSTRAINT "SafetyPlan_version_check" CHECK ("version" > 0)
);

CREATE TABLE "SafetyPlanAudit" (
  "id" UUID NOT NULL,
  "safetyPlanId" UUID NOT NULL,
  "actorId" UUID,
  "action" "SafetyPlanAuditAction" NOT NULL,
  "fromStatus" "SafetyPlanStatus",
  "toStatus" "SafetyPlanStatus" NOT NULL,
  "planVersion" INTEGER NOT NULL,
  "snapshot" JSONB NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SafetyPlanAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SafetyPlan_createdById_status_createdAt_idx" ON "SafetyPlan"("createdById", "status", "createdAt");
CREATE INDEX "SafetyPlan_routeId_status_tripStartAt_idx" ON "SafetyPlan"("routeId", "status", "tripStartAt");
CREATE INDEX "SafetyPlan_guideProfileId_status_idx" ON "SafetyPlan"("guideProfileId", "status");
CREATE INDEX "SafetyPlan_status_expiresAt_idx" ON "SafetyPlan"("status", "expiresAt");
CREATE INDEX "SafetyPlanAudit_safetyPlanId_createdAt_idx" ON "SafetyPlanAudit"("safetyPlanId", "createdAt");
CREATE INDEX "SafetyPlanAudit_actorId_createdAt_idx" ON "SafetyPlanAudit"("actorId", "createdAt");

ALTER TABLE "SafetyPlan"
  ADD CONSTRAINT "SafetyPlan_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ResearchRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "SafetyPlan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "SafetyPlan_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "SafetyPlan_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SafetyPlanAudit"
  ADD CONSTRAINT "SafetyPlanAudit_safetyPlanId_fkey" FOREIGN KEY ("safetyPlanId") REFERENCES "SafetyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "SafetyPlanAudit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION reject_safety_plan_audit_mutation()
RETURNS trigger AS $$
BEGIN
  IF current_setting('app.allow_safety_plan_audit_mutation', true) = 'on' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'SafetyPlanAudit rows are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "SafetyPlanAudit_immutable"
BEFORE UPDATE OR DELETE ON "SafetyPlanAudit"
FOR EACH ROW EXECUTE FUNCTION reject_safety_plan_audit_mutation();

CREATE TYPE "UserModerationStatus" AS ENUM ('ACTIVE', 'TEMPORARILY_SUSPENDED', 'PERMANENTLY_SUSPENDED');
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'HARASSMENT', 'SCAM', 'UNSAFE_GUIDE_BEHAVIOR', 'FAKE_LISTING', 'INAPPROPRIATE_CONTENT', 'PAYMENT_FRAUD', 'OTHER');
CREATE TYPE "ReportTargetType" AS ENUM ('USER', 'LISTING', 'GUIDE', 'POST', 'MESSAGE', 'BOOKING');
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');
CREATE TYPE "ModerationActionType" AS ENUM ('REPORT_DISMISS', 'CONTENT_REMOVE', 'WARNING', 'TEMPORARY_SUSPENSION', 'PERMANENT_SUSPENSION', 'LISTING_UNPUBLISH', 'GUIDE_VERIFICATION_REVOKE');

ALTER TABLE "User"
  ADD COLUMN "moderationStatus" "UserModerationStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "suspendedUntil" TIMESTAMP(3),
  ADD COLUMN "suspensionReason" TEXT;
ALTER TABLE "ConversationParticipant" ADD COLUMN "mutedAt" TIMESTAMP(3);

CREATE TABLE "UserBlock" (
  "id" UUID NOT NULL,
  "blockerId" UUID NOT NULL,
  "blockedId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserBlock_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserBlock_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserBlock_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserBlock_not_self" CHECK ("blockerId" <> "blockedId")
);
CREATE UNIQUE INDEX "UserBlock_blockerId_blockedId_key" ON "UserBlock"("blockerId", "blockedId");
CREATE INDEX "UserBlock_blockedId_idx" ON "UserBlock"("blockedId");

CREATE TABLE "Report" (
  "id" UUID NOT NULL,
  "reporterId" UUID NOT NULL,
  "reason" "ReportReason" NOT NULL,
  "targetType" "ReportTargetType" NOT NULL,
  "targetId" UUID NOT NULL,
  "details" TEXT,
  "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
  "resolution" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "resolvedAt" TIMESTAMP(3),
  CONSTRAINT "Report_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");
CREATE INDEX "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");
CREATE INDEX "Report_reporterId_createdAt_idx" ON "Report"("reporterId", "createdAt");

CREATE TABLE "ModerationAction" (
  "id" UUID NOT NULL,
  "reportId" UUID NOT NULL,
  "adminId" UUID NOT NULL,
  "action" "ModerationActionType" NOT NULL,
  "reason" TEXT NOT NULL,
  "metadata" JSONB,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ModerationAction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ModerationAction_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ModerationAction_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "ModerationAction_reportId_createdAt_idx" ON "ModerationAction"("reportId", "createdAt");
CREATE INDEX "ModerationAction_adminId_createdAt_idx" ON "ModerationAction"("adminId", "createdAt");

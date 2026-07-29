CREATE TYPE "NotificationType" AS ENUM (
  'BOOKING_CREATED',
  'BOOKING_ACCEPTED',
  'BOOKING_DECLINED',
  'BOOKING_CANCELLED',
  'BOOKING_STARTED',
  'BOOKING_COMPLETED',
  'BOOKING_EXPIRED',
  'NEW_MESSAGE'
);

CREATE TABLE "Notification" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "data" JSONB,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
CREATE TYPE "BookingStatus" AS ENUM (
  'DRAFT', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'DECLINED',
  'CANCELLED_BY_TRAVELER', 'CANCELLED_BY_PROVIDER', 'EXPIRED', 'NO_SHOW',
  'DISPUTED', 'REFUND_PENDING', 'REFUNDED'
);
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus"
  USING (CASE
    WHEN "status"::text = 'CANCELLED' THEN 'CANCELLED_BY_TRAVELER'
    ELSE "status"::text
  END)::"BookingStatus";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
DROP TYPE "BookingStatus_old";

CREATE TYPE "BookingActorType" AS ENUM ('TRAVELER', 'PROVIDER', 'SYSTEM', 'ADMIN');

CREATE TABLE "BookingEvent" (
  "id" UUID NOT NULL,
  "bookingId" UUID NOT NULL,
  "actorId" UUID,
  "actorType" "BookingActorType" NOT NULL,
  "fromStatus" "BookingStatus",
  "toStatus" "BookingStatus" NOT NULL,
  "eventType" TEXT NOT NULL,
  "reason" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BookingEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BookingEvent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BookingEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "BookingEvent_bookingId_createdAt_idx" ON "BookingEvent"("bookingId", "createdAt");
CREATE INDEX "BookingEvent_actorId_idx" ON "BookingEvent"("actorId");

CREATE TABLE "IdempotencyKey" (
  "id" UUID NOT NULL,
  "key" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "requestHash" TEXT NOT NULL,
  "responseBody" JSONB,
  "statusCode" INTEGER,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "IdempotencyKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "IdempotencyKey_userId_key_key" ON "IdempotencyKey"("userId", "key");
CREATE INDEX "IdempotencyKey_expiresAt_idx" ON "IdempotencyKey"("expiresAt");

-- The database remains the final authority under concurrent requests. Pending
-- requests also reserve the slot, matching the product overlap rule.
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_guide_no_overlap"
  EXCLUDE USING gist (
    "guideId" WITH =,
    tsrange("startsAt", "endsAt", '[)') WITH &&
  ) WHERE ("guideId" IS NOT NULL AND "deletedAt" IS NULL AND "status" IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS'));

-- Current listings represent one sellable unit. A future inventory migration can
-- replace this constraint with per-date inventory row locks for multi-unit stock.
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_listing_no_overlap"
  EXCLUDE USING gist (
    "listingId" WITH =,
    tsrange("startsAt", "endsAt", '[)') WITH &&
  ) WHERE ("listingId" IS NOT NULL AND "deletedAt" IS NULL AND "status" IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS'));

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_exactly_one_provider"
  CHECK (("guideId" IS NOT NULL) <> ("listingId" IS NOT NULL));
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_valid_time_range"
  CHECK ("startsAt" < "endsAt");

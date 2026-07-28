CREATE TYPE "CancellationPolicyType" AS ENUM ('FLEXIBLE', 'MODERATE', 'STRICT', 'CUSTOM');

ALTER TABLE "Booking"
  ADD COLUMN "expiresAt" TIMESTAMP(3),
  ADD COLUMN "cancellationPolicy" "CancellationPolicyType" NOT NULL DEFAULT 'FLEXIBLE',
  ADD COLUMN "freeCancellationUntil" TIMESTAMP(3),
  ADD COLUMN "lateCancellationPercent" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "noShowPercent" INTEGER NOT NULL DEFAULT 100,
  ADD COLUMN "cancellationFee" DECIMAL(10,2) NOT NULL DEFAULT 0;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_cancellation_percent_range"
  CHECK (
    "lateCancellationPercent" BETWEEN 0 AND 100
    AND "noShowPercent" BETWEEN 0 AND 100
  );

CREATE INDEX "Booking_status_expiresAt_idx" ON "Booking"("status", "expiresAt");
CREATE INDEX "Booking_status_startsAt_idx" ON "Booking"("status", "startsAt");
CREATE INDEX "Booking_status_endsAt_idx" ON "Booking"("status", "endsAt");

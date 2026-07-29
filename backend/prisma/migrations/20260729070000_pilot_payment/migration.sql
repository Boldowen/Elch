CREATE TYPE "PaymentArrangement" AS ENUM ('CASH_ON_ARRIVAL', 'BANK_TRANSFER', 'PROVIDER_TERMINAL', 'ONLINE_PAYMENT');
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'AGREED', 'PAID', 'FAILED', 'REFUND_PENDING', 'REFUNDED');

CREATE TABLE "PilotPayment" (
  "id" UUID NOT NULL,
  "bookingId" UUID NOT NULL,
  "arrangement" "PaymentArrangement" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "instructions" TEXT,
  "proposedById" UUID NOT NULL,
  "agreedByTravelerAt" TIMESTAMP(3),
  "agreedByProviderAt" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PilotPayment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PilotPayment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PilotPayment_proposedById_fkey" FOREIGN KEY ("proposedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "PilotPayment_bookingId_key" ON "PilotPayment"("bookingId");
CREATE INDEX "PilotPayment_status_updatedAt_idx" ON "PilotPayment"("status", "updatedAt");
CREATE INDEX "PilotPayment_proposedById_idx" ON "PilotPayment"("proposedById");

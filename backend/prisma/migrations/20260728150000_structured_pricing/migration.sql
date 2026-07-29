ALTER TABLE "Listing"
  ADD COLUMN "basePriceMinor" INTEGER,
  ADD COLUMN "cleaningFeeMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "serviceFeeMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "taxMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "extraGuestFeeMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "depositMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "currency" VARCHAR(3) NOT NULL DEFAULT 'USD';

UPDATE "Listing" SET "basePriceMinor" = ROUND("price" * 100)::INTEGER;
ALTER TABLE "Listing" ALTER COLUMN "basePriceMinor" SET NOT NULL;
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_price_minor_non_negative" CHECK (
  "basePriceMinor" > 0 AND "cleaningFeeMinor" >= 0 AND "serviceFeeMinor" >= 0
  AND "taxMinor" >= 0 AND "extraGuestFeeMinor" >= 0 AND "depositMinor" >= 0
);
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_currency_iso_length" CHECK (char_length("currency") = 3 AND "currency" = upper("currency"));

ALTER TABLE "Booking"
  ADD COLUMN "amountMinor" INTEGER,
  ADD COLUMN "baseAmountMinor" INTEGER,
  ADD COLUMN "cleaningFeeMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "serviceFeeMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "taxMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "extraGuestFeeMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "depositMinor" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "cancellationFeeMinor" INTEGER NOT NULL DEFAULT 0;

UPDATE "Booking" SET
  "amountMinor" = ROUND("amount" * 100)::INTEGER,
  "baseAmountMinor" = ROUND("amount" * 100)::INTEGER,
  "cancellationFeeMinor" = ROUND("cancellationFee" * 100)::INTEGER;
ALTER TABLE "Booking" ALTER COLUMN "amountMinor" SET NOT NULL;
ALTER TABLE "Booking" ALTER COLUMN "baseAmountMinor" SET NOT NULL;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_price_minor_non_negative" CHECK (
  "amountMinor" >= 0 AND "baseAmountMinor" >= 0 AND "cleaningFeeMinor" >= 0
  AND "serviceFeeMinor" >= 0 AND "taxMinor" >= 0 AND "extraGuestFeeMinor" >= 0
  AND "depositMinor" >= 0 AND "cancellationFeeMinor" >= 0
);

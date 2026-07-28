CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED');
CREATE TYPE "PriceUnit" AS ENUM ('PER_NIGHT', 'PER_HOUR', 'PER_DAY', 'PER_PERSON', 'PER_GROUP', 'PACKAGE');

ALTER TABLE "Listing" ADD COLUMN "status" "ListingStatus" NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "Listing" ADD COLUMN "defaultTotalUnits" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Listing" ALTER COLUMN "priceUnit" TYPE "PriceUnit"
  USING (CASE lower("priceUnit")
    WHEN 'night' THEN 'PER_NIGHT'
    WHEN 'hour' THEN 'PER_HOUR'
    WHEN 'day' THEN 'PER_DAY'
    WHEN 'person' THEN 'PER_PERSON'
    WHEN 'group' THEN 'PER_GROUP'
    ELSE 'PACKAGE'
  END)::"PriceUnit";

CREATE TABLE "ListingInventory" (
  "id" UUID NOT NULL,
  "listingId" UUID NOT NULL,
  "date" DATE NOT NULL,
  "totalUnits" INTEGER NOT NULL,
  "reservedUnits" INTEGER NOT NULL DEFAULT 0,
  "availableUnits" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ListingInventory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ListingInventory_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ListingInventory_unit_range" CHECK (
    "totalUnits" >= 0 AND "reservedUnits" >= 0
    AND "availableUnits" >= 0
    AND "reservedUnits" + "availableUnits" = "totalUnits"
  )
);
CREATE UNIQUE INDEX "ListingInventory_listingId_date_key" ON "ListingInventory"("listingId", "date");
CREATE INDEX "ListingInventory_date_availableUnits_idx" ON "ListingInventory"("date", "availableUnits");

-- Listing capacity is now enforced by inventory rows rather than a single-unit
-- time-range exclusion. Guide overlap remains protected by its DB constraint.
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_listing_no_overlap";

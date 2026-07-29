ALTER TABLE "Review" ADD COLUMN "bookingId" UUID;
ALTER TABLE "Review" ADD COLUMN "listingId" UUID;
ALTER TABLE "Review" ALTER COLUMN "guideId" DROP NOT NULL;
ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_authorId_guideId_key";

ALTER TABLE "Review"
  ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT "Review_rating_range" CHECK ("rating" >= 1 AND "rating" <= 5),
  ADD CONSTRAINT "Review_target_required" CHECK ("guideId" IS NOT NULL OR "listingId" IS NOT NULL);

CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");
CREATE INDEX "Review_listingId_createdAt_idx" ON "Review"("listingId", "createdAt");

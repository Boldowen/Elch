ALTER TABLE "GuideProfile"
ADD COLUMN "assessmentScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "referenceContact" TEXT,
ADD COLUMN "codeOfConductAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "rankPoints" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN "completedTrips" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "responseRate" INTEGER NOT NULL DEFAULT 100;

CREATE INDEX "GuideProfile_rankPoints_rating_idx"
ON "GuideProfile"("rankPoints" DESC, "rating" DESC);

ALTER TABLE "User" ADD COLUMN "providerSubject" TEXT;

CREATE UNIQUE INDEX "User_provider_providerSubject_key"
ON "User"("provider", "providerSubject");

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TYPE "Role" AS ENUM ('TRAVELER','GUIDE','ADMIN');
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL','GOOGLE','APPLE');
CREATE TYPE "GuideStatus" AS ENUM ('DRAFT','PENDING','APPROVED','REJECTED');
CREATE TYPE "ListingCategory" AS ENUM ('TRENDING','HOTEL','FOODS','NATURE');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING','CONFIRMED','COMPLETED','CANCELLED','DECLINED');
CREATE TYPE "MessageType" AS ENUM ('TEXT','IMAGE','SYSTEM');
CREATE TYPE "PricingType" AS ENUM ('HOURLY','PACKAGE','NONE');

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT, "name" TEXT NOT NULL, "phone" TEXT, "avatarUrl" TEXT,
  "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL', "roles" "Role"[] NOT NULL DEFAULT ARRAY['TRAVELER']::"Role"[],
  "isVerified" BOOLEAN NOT NULL DEFAULT false, "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

CREATE TABLE "RefreshToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "tokenHash" TEXT NOT NULL, "family" UUID NOT NULL,
  "userAgent" TEXT, "ipAddress" TEXT, "expiresAt" TIMESTAMP(3) NOT NULL, "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX "RefreshToken_userId_expiresAt_idx" ON "RefreshToken"("userId","expiresAt");
CREATE INDEX "RefreshToken_family_idx" ON "RefreshToken"("family");

CREATE TABLE "GuideProfile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "country" TEXT NOT NULL, "city" TEXT NOT NULL, "bio" TEXT NOT NULL, "experienceYears" INTEGER NOT NULL DEFAULT 0,
  "languages" JSONB NOT NULL, "expertise" TEXT[] NOT NULL, "availability" TEXT[] NOT NULL,
  "pricingType" "PricingType" NOT NULL DEFAULT 'HOURLY', "price" DECIMAL(10,2), "status" "GuideStatus" NOT NULL DEFAULT 'DRAFT',
  "verified" BOOLEAN NOT NULL DEFAULT false, "rating" DECIMAL(3,2) NOT NULL DEFAULT 0, "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "GuideProfile_status_deletedAt_idx" ON "GuideProfile"("status","deletedAt");
CREATE INDEX "GuideProfile_city_idx" ON "GuideProfile"("city");

CREATE TABLE "Listing" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "slug" TEXT NOT NULL UNIQUE, "title" TEXT NOT NULL, "location" TEXT NOT NULL,
  "description" TEXT NOT NULL, "category" "ListingCategory" NOT NULL, "price" DECIMAL(10,2) NOT NULL, "priceUnit" TEXT NOT NULL,
  "datesLabel" TEXT NOT NULL, "tags" TEXT[] NOT NULL, "amenities" TEXT[] NOT NULL, "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0, "published" BOOLEAN NOT NULL DEFAULT true, "hostId" UUID NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "Listing_category_published_deletedAt_idx" ON "Listing"("category","published","deletedAt");
CREATE INDEX "Listing_location_idx" ON "Listing"("location");
CREATE INDEX "Listing_rating_idx" ON "Listing"("rating");

CREATE TABLE "ListingImage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "url" TEXT NOT NULL, "alt" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "listingId" UUID NOT NULL REFERENCES "Listing"("id") ON DELETE CASCADE
);
CREATE INDEX "ListingImage_listingId_sortOrder_idx" ON "ListingImage"("listingId","sortOrder");

CREATE TABLE "Booking" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "travelerId" UUID NOT NULL REFERENCES "User"("id"), "guideId" UUID REFERENCES "User"("id"),
  "listingId" UUID REFERENCES "Listing"("id"), "startsAt" TIMESTAMP(3) NOT NULL, "endsAt" TIMESTAMP(3) NOT NULL,
  "guests" INTEGER NOT NULL DEFAULT 1, "amount" DECIMAL(10,2) NOT NULL, "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING', "note" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "cancelledAt" TIMESTAMP(3), "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "Booking_travelerId_startsAt_idx" ON "Booking"("travelerId","startsAt");
CREATE INDEX "Booking_guideId_status_idx" ON "Booking"("guideId","status");
CREATE INDEX "Booking_listingId_idx" ON "Booking"("listingId");

CREATE TABLE "Favorite" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "listingId" UUID NOT NULL REFERENCES "Listing"("id") ON DELETE CASCADE, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_userId_listingId_key" UNIQUE("userId","listingId")
);
CREATE INDEX "Favorite_listingId_idx" ON "Favorite"("listingId");

CREATE TABLE "Conversation" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "bookingId" UUID UNIQUE REFERENCES "Booking"("id"), "title" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

CREATE TABLE "ConversationParticipant" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "conversationId" UUID NOT NULL REFERENCES "Conversation"("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "lastReadAt" TIMESTAMP(3), "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConversationParticipant_conversationId_userId_key" UNIQUE("conversationId","userId")
);
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

CREATE TABLE "Message" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "conversationId" UUID NOT NULL REFERENCES "Conversation"("id") ON DELETE CASCADE,
  "senderId" UUID NOT NULL REFERENCES "User"("id"), "type" "MessageType" NOT NULL DEFAULT 'TEXT', "body" TEXT, "mediaUrl" TEXT,
  "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "Message_conversationId_sentAt_idx" ON "Message"("conversationId","sentAt");
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

CREATE TABLE "PaymentMethod" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "providerRef" TEXT NOT NULL, "brand" TEXT NOT NULL, "last4" TEXT NOT NULL, "expMonth" INTEGER NOT NULL, "expYear" INTEGER NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3),
  CONSTRAINT "PaymentMethod_userId_providerRef_key" UNIQUE("userId","providerRef")
);
CREATE INDEX "PaymentMethod_userId_isDefault_idx" ON "PaymentMethod"("userId","isDefault");

CREATE TABLE "Review" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "authorId" UUID NOT NULL REFERENCES "User"("id"), "guideId" UUID NOT NULL REFERENCES "User"("id"),
  "rating" INTEGER NOT NULL CHECK ("rating" BETWEEN 1 AND 5), "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3),
  CONSTRAINT "Review_authorId_guideId_key" UNIQUE("authorId","guideId")
);
CREATE INDEX "Review_guideId_createdAt_idx" ON "Review"("guideId","createdAt");

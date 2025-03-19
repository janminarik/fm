-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppTokenType" AS ENUM ('REFRESH_TOKEN', 'PASSWORD_RESET_TOKEN', 'EMAIL_VERIFICATION_TOKEN');

-- CreateEnum
CREATE TYPE "AdSpaceType" AS ENUM ('BILLBOARD', 'CITYBOARD', 'DIGITAL_CITYLIGHT', 'INTERACTIVE_MONITOR', 'OUTDOOR_DCL', 'DIGITAL_KIOSK');

-- CreateEnum
CREATE TYPE "AdSpaceStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'INACTIVE', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "AdSpaceVisibility" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "AdContentType" AS ENUM ('STATIC', 'DYNAMIC', 'INTERACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT,
    "phoneNumber" TEXT,
    "disabled" BOOLEAN NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "passwordAttempt" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppToken" (
    "id" TEXT NOT NULL,
    "type" "AppTokenType" NOT NULL DEFAULT 'REFRESH_TOKEN',
    "publicId" TEXT NOT NULL,
    "value" TEXT,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "AppToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GarminActivity" (
    "id" TEXT NOT NULL,
    "activityType" TEXT,
    "aerobicTE" DOUBLE PRECISION,
    "ascent" DOUBLE PRECISION,
    "avgCadence" DOUBLE PRECISION,
    "avgGAP" INTEGER,
    "avgGCTBalance" TEXT,
    "avgGroundContactTime" INTEGER,
    "avgHR" INTEGER,
    "avgPace" INTEGER,
    "avgPower" INTEGER,
    "avgResp" INTEGER,
    "avgRunCadence" INTEGER,
    "avgStrideLength" DOUBLE PRECISION,
    "avgVerticalOscillation" DOUBLE PRECISION,
    "avgVerticalRatio" DOUBLE PRECISION,
    "bestLapTime" DOUBLE PRECISION,
    "bestPace" INTEGER,
    "calories" INTEGER,
    "date" TIMESTAMP(3),
    "decompression" BOOLEAN NOT NULL,
    "distance" DOUBLE PRECISION,
    "elapsedTime" INTEGER,
    "favorite" BOOLEAN NOT NULL,
    "maxCadence" INTEGER,
    "maxElevation" DOUBLE PRECISION,
    "maxHR" INTEGER,
    "maxPower" INTEGER,
    "maxResp" INTEGER,
    "maxRunCadence" INTEGER,
    "maxTemp" DOUBLE PRECISION,
    "minElevation" DOUBLE PRECISION,
    "minResp" INTEGER,
    "minTemp" DOUBLE PRECISION,
    "movingTime" INTEGER,
    "normalizedPower" INTEGER,
    "numberOfLaps" INTEGER,
    "steps" INTEGER,
    "time" INTEGER,
    "title" TEXT,
    "totalAscent" INTEGER,
    "totalDescent" INTEGER,
    "trainingStressScore" INTEGER,

    CONSTRAINT "GarminActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalContent" (
    "id" TEXT NOT NULL,
    "type" "AdContentType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL,
    "adSpaceId" TEXT NOT NULL,

    CONSTRAINT "DigitalContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSpace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AdSpaceType" NOT NULL,
    "status" "AdSpaceStatus" NOT NULL,
    "visibility" "AdSpaceVisibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "addressId" TEXT NOT NULL,

    CONSTRAINT "AdSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "adSpaceId" TEXT NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppToken_publicId_key" ON "AppToken"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "AdSpace_addressId_key" ON "AdSpace"("addressId");

-- AddForeignKey
ALTER TABLE "AppToken" ADD CONSTRAINT "AppToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalContent" ADD CONSTRAINT "DigitalContent_adSpaceId_fkey" FOREIGN KEY ("adSpaceId") REFERENCES "AdSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdSpace" ADD CONSTRAINT "AdSpace_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_adSpaceId_fkey" FOREIGN KEY ("adSpaceId") REFERENCES "AdSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Crop" (
    "cropId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("cropId")
);

-- CreateTable
CREATE TABLE "DiseaseDetection" (
    "detectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "diseaseName" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiseaseDetection_pkey" PRIMARY KEY ("detectionId")
);

-- CreateTable
CREATE TABLE "WeatherAlert" (
    "alertId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "weatherType" TEXT NOT NULL,
    "alertMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherAlert_pkey" PRIMARY KEY ("alertId")
);

-- CreateTable
CREATE TABLE "MandiPrice" (
    "priceId" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "predictedPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MandiPrice_pkey" PRIMARY KEY ("priceId")
);

-- CreateTable
CREATE TABLE "Marketplace" (
    "listingId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "buyerId" TEXT,
    "cropId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marketplace_pkey" PRIMARY KEY ("listingId")
);

-- CreateTable
CREATE TABLE "GovernmentScheme" (
    "schemeId" TEXT NOT NULL,
    "schemeName" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "applyLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentScheme_pkey" PRIMARY KEY ("schemeId")
);

-- CreateTable
CREATE TABLE "ExpenseProfit" (
    "recordId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseProfit_pkey" PRIMARY KEY ("recordId")
);

-- CreateTable
CREATE TABLE "EquipmentRental" (
    "equipmentId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "equipmentName" TEXT NOT NULL,
    "rentPrice" DOUBLE PRECISION NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentRental_pkey" PRIMARY KEY ("equipmentId")
);

-- CreateTable
CREATE TABLE "RewardLoan" (
    "rewardId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "loanEligibility" BOOLEAN NOT NULL,
    "creditScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardLoan_pkey" PRIMARY KEY ("rewardId")
);

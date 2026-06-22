-- Align marketplace-rentals tables with merged schema:
-- the _init migration created FK columns as TEXT (when User.userId was a string),
-- never added FK constraints, indexes, or the EquipmentRental.availability default.
-- Runs on an empty DB after `prisma migrate reset`, so the type casts are trivial.

-- Drop columns to INTEGER (was TEXT)
ALTER TABLE "Crop" ALTER COLUMN "userId" TYPE INTEGER USING "userId"::INTEGER;
ALTER TABLE "DiseaseDetection" ALTER COLUMN "userId" TYPE INTEGER USING "userId"::INTEGER;
ALTER TABLE "WeatherAlert" ALTER COLUMN "userId" TYPE INTEGER USING "userId"::INTEGER;
ALTER TABLE "Marketplace" ALTER COLUMN "farmerId" TYPE INTEGER USING "farmerId"::INTEGER;
ALTER TABLE "Marketplace" ALTER COLUMN "buyerId" TYPE INTEGER USING "buyerId"::INTEGER;
ALTER TABLE "ExpenseProfit" ALTER COLUMN "farmerId" TYPE INTEGER USING "farmerId"::INTEGER;
ALTER TABLE "EquipmentRental" ALTER COLUMN "ownerId" TYPE INTEGER USING "ownerId"::INTEGER;
ALTER TABLE "RewardLoan" ALTER COLUMN "farmerId" TYPE INTEGER USING "farmerId"::INTEGER;

-- Add availability default
ALTER TABLE "EquipmentRental" ALTER COLUMN "availability" SET DEFAULT true;

-- Foreign-key constraints (none existed on these tables)
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DiseaseDetection" ADD CONSTRAINT "DiseaseDetection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WeatherAlert" ADD CONSTRAINT "WeatherAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Marketplace" ADD CONSTRAINT "Marketplace_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "Marketplace" ADD CONSTRAINT "Marketplace_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "Marketplace" ADD CONSTRAINT "Marketplace_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("cropId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExpenseProfit" ADD CONSTRAINT "ExpenseProfit_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EquipmentRental" ADD CONSTRAINT "EquipmentRental_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardLoan" ADD CONSTRAINT "RewardLoan_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes declared by @@index in schema.prisma
CREATE INDEX "Crop_userId_idx" ON "Crop"("userId");
CREATE INDEX "DiseaseDetection_userId_idx" ON "DiseaseDetection"("userId");
CREATE INDEX "WeatherAlert_userId_idx" ON "WeatherAlert"("userId");
CREATE INDEX "MandiPrice_cropName_idx" ON "MandiPrice"("cropName");
CREATE INDEX "MandiPrice_market_idx" ON "MandiPrice"("market");
CREATE INDEX "Marketplace_farmerId_idx" ON "Marketplace"("farmerId");
CREATE INDEX "Marketplace_buyerId_idx" ON "Marketplace"("buyerId");
CREATE INDEX "Marketplace_cropId_idx" ON "Marketplace"("cropId");
CREATE INDEX "ExpenseProfit_farmerId_idx" ON "ExpenseProfit"("farmerId");
CREATE INDEX "EquipmentRental_ownerId_idx" ON "EquipmentRental"("ownerId");
CREATE INDEX "RewardLoan_farmerId_idx" ON "RewardLoan"("farmerId");

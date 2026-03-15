-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "gstLegalName" TEXT,
ADD COLUMN     "gstRegistered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gstRegisteredOn" TIMESTAMP(3),
ADD COLUMN     "gstRegistrationType" TEXT,
ADD COLUMN     "gstTradeName" TEXT,
ADD COLUMN     "gstin" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'English',
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "state" TEXT;

-- CreateTable
CREATE TABLE "shop_preferences" (
    "id" TEXT NOT NULL,
    "enableDiscounts" BOOLEAN NOT NULL DEFAULT true,
    "additionalCharges" BOOLEAN NOT NULL DEFAULT true,
    "soundNotifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "invoicePdf" BOOLEAN NOT NULL DEFAULT false,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "shop_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_preferences_shopId_key" ON "shop_preferences"("shopId");

-- AddForeignKey
ALTER TABLE "shop_preferences" ADD CONSTRAINT "shop_preferences_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

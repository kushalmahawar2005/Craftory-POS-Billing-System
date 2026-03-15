-- AlterTable
ALTER TABLE "products" ADD COLUMN     "description" TEXT,
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

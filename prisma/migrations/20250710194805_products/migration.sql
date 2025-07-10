-- CreateEnum
CREATE TYPE "ProductSource" AS ENUM ('SHOPIFY', 'WOOCOMMERCE', 'INSTAGRAM', 'MANUAL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IntegrationType" ADD VALUE 'SHOPIFY';
ALTER TYPE "IntegrationType" ADD VALUE 'WOOCOMMERCE';

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "source" "ProductSource" NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION DEFAULT 0.0,
    "currency" TEXT DEFAULT 'EUR',
    "imageUrl" TEXT,
    "productUrl" TEXT,
    "sku" TEXT,
    "units" INTEGER DEFAULT 1,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "integrationId" UUID,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

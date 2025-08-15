/*
  Warnings:

  - You are about to drop the column `occurredAt` on the `stats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,automationId,listenerId,keywordId,postId,date]` on the table `stats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `stats` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ONLINE', 'IN_STORE', 'SMART_AI');

-- DropIndex
DROP INDEX "stats_automationId_occurredAt_idx";

-- DropIndex
DROP INDEX "stats_occurredAt_idx";

-- DropIndex
DROP INDEX "stats_userId_occurredAt_idx";

-- AlterTable
ALTER TABLE "stats" DROP COLUMN "occurredAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "orderId" UUID,
ADD COLUMN     "ordersCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dmId" UUID,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderType" "OrderType" NOT NULL DEFAULT 'SMART_AI',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0.0,
    "metadata" JSONB,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_userId_status_idx" ON "orders"("userId", "status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "stats_date_idx" ON "stats"("date");

-- CreateIndex
CREATE INDEX "stats_userId_date_idx" ON "stats"("userId", "date");

-- CreateIndex
CREATE INDEX "stats_automationId_date_idx" ON "stats"("automationId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "stats_userId_automationId_listenerId_keywordId_postId_date_key" ON "stats"("userId", "automationId", "listenerId", "keywordId", "postId", "date");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "dms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stats" ADD CONSTRAINT "stats_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `userId` to the `Keyword` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "userId" TEXT NOT NULL;

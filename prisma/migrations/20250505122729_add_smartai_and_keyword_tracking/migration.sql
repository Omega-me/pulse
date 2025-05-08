/*
  Warnings:

  - Added the required column `usedSmartAI` to the `Dms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dms" ADD COLUMN     "keywordId" UUID,
ADD COLUMN     "usedSmartAI" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "Dms" ADD CONSTRAINT "Dms_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Changed the type of `type` on the `Trigger` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('COMMENT', 'DM');

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "type",
ADD COLUMN     "type" "TriggerType" NOT NULL;

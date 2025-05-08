/*
  Warnings:

  - Added the required column `system_dm` to the `Dms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dms" ADD COLUMN     "system_dm" BOOLEAN NOT NULL;

/*
  Warnings:

  - You are about to drop the column `userId` on the `conversation_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversation_sessions" DROP COLUMN "userId";

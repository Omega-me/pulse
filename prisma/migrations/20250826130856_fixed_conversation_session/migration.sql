/*
  Warnings:

  - Added the required column `recieverId` to the `conversation_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversation_sessions" ADD COLUMN     "recieverId" TEXT NOT NULL;

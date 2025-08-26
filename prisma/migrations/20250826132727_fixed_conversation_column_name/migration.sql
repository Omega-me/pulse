/*
  Warnings:

  - You are about to drop the column `recieverId` on the `conversation_sessions` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `conversation_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversation_sessions" DROP COLUMN "recieverId",
ADD COLUMN     "receiverId" TEXT NOT NULL;

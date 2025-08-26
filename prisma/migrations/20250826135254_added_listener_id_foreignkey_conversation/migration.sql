/*
  Warnings:

  - Changed the type of `listenerId` on the `conversation_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "conversation_sessions" DROP COLUMN "listenerId",
ADD COLUMN     "listenerId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_listenerId_fkey" FOREIGN KEY ("listenerId") REFERENCES "listeners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

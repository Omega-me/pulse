-- AlterTable
ALTER TABLE "dms" ADD COLUMN     "conversationSessionId" TEXT;

-- AlterTable
ALTER TABLE "listeners" ADD COLUMN     "continuousConversation" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "conversation_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "listenerId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "conversation_sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dms" ADD CONSTRAINT "dms_conversationSessionId_fkey" FOREIGN KEY ("conversationSessionId") REFERENCES "conversation_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

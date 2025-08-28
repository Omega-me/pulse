-- DropForeignKey
ALTER TABLE "conversation_sessions" DROP CONSTRAINT "conversation_sessions_keywordId_fkey";

-- DropForeignKey
ALTER TABLE "conversation_sessions" DROP CONSTRAINT "conversation_sessions_listenerId_fkey";

-- DropForeignKey
ALTER TABLE "dms" DROP CONSTRAINT "dms_conversationSessionId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_integrationId_fkey";

-- AddForeignKey
ALTER TABLE "dms" ADD CONSTRAINT "dms_conversationSessionId_fkey" FOREIGN KEY ("conversationSessionId") REFERENCES "conversation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_listenerId_fkey" FOREIGN KEY ("listenerId") REFERENCES "listeners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "keywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

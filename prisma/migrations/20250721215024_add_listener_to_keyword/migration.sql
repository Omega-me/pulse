-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "listenerId" UUID;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_listenerId_fkey" FOREIGN KEY ("listenerId") REFERENCES "Listener"("id") ON DELETE CASCADE ON UPDATE CASCADE;

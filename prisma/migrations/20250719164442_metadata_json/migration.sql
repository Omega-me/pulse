-- AlterTable
ALTER TABLE "Automations" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Dms" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Integrations" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Listener" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "metadata" JSONB;

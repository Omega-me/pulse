-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('POST', 'AD');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postType" "PostType" NOT NULL DEFAULT 'POST';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pqrId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "PQRS" DROP CONSTRAINT "PQRS_creatorId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "oversightEntityId" TEXT;

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PQRS" ADD COLUMN     "consecutiveCode" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "subject" TEXT,
ALTER COLUMN "creatorId" DROP NOT NULL,
ALTER COLUMN "private" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profilePicture" TEXT;

-- CreateTable
CREATE TABLE "EntityConsecutive" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "consecutive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EntityConsecutive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityHasUser" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "EntityHasUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OversightEntity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OversightEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntityConsecutive_code_key" ON "EntityConsecutive"("code");

-- CreateIndex
CREATE INDEX "EntityConsecutive_entityId_idx" ON "EntityConsecutive"("entityId");

-- CreateIndex
CREATE INDEX "EntityHasUser_entityId_idx" ON "EntityHasUser"("entityId");

-- CreateIndex
CREATE INDEX "EntityHasUser_userId_idx" ON "EntityHasUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OversightEntity_name_key" ON "OversightEntity"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityConsecutive" ADD CONSTRAINT "EntityConsecutive_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EntityHasUser" ADD CONSTRAINT "EntityHasUser_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EntityHasUser" ADD CONSTRAINT "EntityHasUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_oversightEntityId_fkey" FOREIGN KEY ("oversightEntityId") REFERENCES "OversightEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PQRS" ADD CONSTRAINT "PQRS_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pqrId_fkey" FOREIGN KEY ("pqrId") REFERENCES "PQRS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

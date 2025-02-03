/*
  Warnings:

  - You are about to drop the column `filename` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `pqrsId` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `name` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pqrId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pqrsId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "filename",
DROP COLUMN "pqrsId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pqrId" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PQRS" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Attachment_pqrId_idx" ON "Attachment"("pqrId");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_pqrId_fkey" FOREIGN KEY ("pqrId") REFERENCES "PQRS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

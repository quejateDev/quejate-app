/*
  Warnings:

  - Added the required column `pqrId` to the `EntityResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EntityResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntityResponse" ADD COLUMN     "pqrId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "EntityResponse_pqrId_idx" ON "EntityResponse"("pqrId");

-- AddForeignKey
ALTER TABLE "EntityResponse" ADD CONSTRAINT "EntityResponse_pqrId_fkey" FOREIGN KEY ("pqrId") REFERENCES "PQRS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Made the column `entityId` on table `PQRS` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PQRS" DROP CONSTRAINT "PQRS_entityId_fkey";

-- AlterTable
ALTER TABLE "PQRS" ALTER COLUMN "entityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PQRS" ADD CONSTRAINT "PQRS_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

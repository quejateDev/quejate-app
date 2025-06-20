/*
  Warnings:

  - A unique constraint covering the columns `[entityId]` on the table `PQRConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PQRConfig" ADD COLUMN     "entityId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PQRConfig_entityId_key" ON "PQRConfig"("entityId");

-- AddForeignKey
ALTER TABLE "PQRConfig" ADD CONSTRAINT "PQRConfig_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

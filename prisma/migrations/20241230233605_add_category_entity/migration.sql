/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Department` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Department" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "imageUrl" TEXT;

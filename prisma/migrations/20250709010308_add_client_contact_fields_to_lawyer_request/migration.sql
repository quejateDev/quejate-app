/*
  Warnings:

  - You are about to drop the column `oversightEntityId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `createdat` on the `RegionalDepartment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_oversightEntityId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "oversightEntityId";

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "regionalDepartmentId" TEXT;

-- AlterTable
ALTER TABLE "LawyerRequest" ADD COLUMN     "clientContactEmail" TEXT,
ADD COLUMN     "clientContactPhone" TEXT;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "RegionalDepartment" DROP COLUMN "createdat",
ADD COLUMN     "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

-- RenameForeignKey
ALTER TABLE "Municipality" RENAME CONSTRAINT "municipality_regionaldepartmentid_fkey" TO "Municipality_regionalDepartmentId_fkey";

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_regionalDepartmentId_fkey" FOREIGN KEY ("regionalDepartmentId") REFERENCES "RegionalDepartment"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

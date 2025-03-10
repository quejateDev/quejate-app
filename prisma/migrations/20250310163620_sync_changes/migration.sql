-- AlterEnum
ALTER TYPE "PQRSType" ADD VALUE 'SUGGESTION';

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "municipalityId" TEXT;

-- CreateTable
CREATE TABLE "Municipality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionalDepartmentId" TEXT NOT NULL,

    CONSTRAINT "municipality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionalDepartment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regionaldepartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regionaldepartment_name_key" ON "RegionalDepartment"("name");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Municipality" ADD CONSTRAINT "municipality_regionaldepartmentid_fkey" FOREIGN KEY ("regionalDepartmentId") REFERENCES "RegionalDepartment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

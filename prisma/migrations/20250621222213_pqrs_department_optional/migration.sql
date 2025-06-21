-- DropForeignKey
ALTER TABLE "PQRS" DROP CONSTRAINT "PQRS_departmentId_fkey";

-- AlterTable
ALTER TABLE "PQRS" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PQRS" ADD CONSTRAINT "PQRS_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

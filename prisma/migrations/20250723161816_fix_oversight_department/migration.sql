-- Add missing columns and foreign keys
ALTER TABLE "OversightEntity" ADD COLUMN "municipalityId" text NULL;
ALTER TABLE "OversightEntity" ADD COLUMN "regionalDepartmentId" text NULL;
ALTER TABLE "OversightEntity" ADD CONSTRAINT "OversightEntity_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"(id) ON DELETE SET NULL;
ALTER TABLE "OversightEntity" ADD CONSTRAINT "OversightEntity_regionalDepartmentId_fkey" FOREIGN KEY ("regionalDepartmentId") REFERENCES "RegionalDepartment"(id) ON DELETE SET NULL;
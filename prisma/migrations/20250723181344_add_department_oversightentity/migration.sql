-- 1. Añadir columnas a OversightEntity
-- 3. Añadir relaciones inversas (OversightEntity[]) a Municipality y RegionalDepartment
-- (No se necesitan cambios físicos en la BD, solo modificaciones en el esquema de Prisma)

-- Asegúrate de que estas son exactamente las constraints que existen en tu BD
ALTER TABLE "OversightEntity" 
ADD CONSTRAINT "OversightEntity_municipalityId_fkey" 
FOREIGN KEY ("municipalityId") 
REFERENCES "Municipality"("id") 
ON UPDATE NO ACTION;

ALTER TABLE "OversightEntity"
ADD CONSTRAINT "OversightEntity_regionalDepartmentId_fkey"
FOREIGN KEY ("regionalDepartmentId")
REFERENCES "RegionalDepartment"("id")
ON UPDATE NO ACTION;
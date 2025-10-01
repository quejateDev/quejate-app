-- CreateEnum
CREATE TYPE "public"."SuggestionStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED');

-- CreateTable
CREATE TABLE "public"."EntitySuggestion" (
    "id" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "regionalDepartmentId" TEXT NOT NULL,
    "municipalityId" TEXT,
    "status" "public"."SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntitySuggestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EntitySuggestion" ADD CONSTRAINT "EntitySuggestion_regionalDepartmentId_fkey" FOREIGN KEY ("regionalDepartmentId") REFERENCES "public"."RegionalDepartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntitySuggestion" ADD CONSTRAINT "EntitySuggestion_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "public"."Municipality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

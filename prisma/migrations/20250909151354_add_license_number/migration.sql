/*
  Warnings:

  - A unique constraint covering the columns `[identityDocument]` on the table `Lawyer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licenseNumber]` on the table `Lawyer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `licenseNumber` to the `Lawyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Lawyer" ADD COLUMN     "licenseNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_identityDocument_key" ON "public"."Lawyer"("identityDocument");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_licenseNumber_key" ON "public"."Lawyer"("licenseNumber");

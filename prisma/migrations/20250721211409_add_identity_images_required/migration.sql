/*
  Warnings:

  - Made the column `identityDocumentImage` on table `Lawyer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `professionalCardImage` on table `Lawyer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lawyer" ALTER COLUMN "identityDocumentImage" SET NOT NULL,
ALTER COLUMN "professionalCardImage" SET NOT NULL;

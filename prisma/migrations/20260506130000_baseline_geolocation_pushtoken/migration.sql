-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "pushToken" TEXT;

-- AlterTable
ALTER TABLE "public"."PQRS" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;


-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CC', 'CE', 'PPT', 'NIT', 'PASSPORT', 'LICENSE');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'LAWYER';

-- CreateTable
CREATE TABLE "Lawyer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "identityDocument" TEXT NOT NULL,
    "specialties" TEXT[],
    "description" TEXT,
    "feePerHour" DOUBLE PRECISION,
    "feePerService" DOUBLE PRECISION,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lawyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_userId_key" ON "Lawyer"("userId");

-- CreateIndex
CREATE INDEX "Lawyer_userId_idx" ON "Lawyer"("userId");

-- CreateIndex
CREATE INDEX "Rating_lawyerId_idx" ON "Rating"("lawyerId");

-- CreateIndex
CREATE INDEX "Rating_clientId_idx" ON "Rating"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_lawyerId_clientId_key" ON "Rating"("lawyerId", "clientId");

-- AddForeignKey
ALTER TABLE "Lawyer" ADD CONSTRAINT "Lawyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "LawyerRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "LawyerRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "pqrId" TEXT,
    "message" TEXT NOT NULL,
    "serviceType" TEXT,
    "status" "LawyerRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LawyerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LawyerRequest_userId_idx" ON "LawyerRequest"("userId");

-- CreateIndex
CREATE INDEX "LawyerRequest_lawyerId_idx" ON "LawyerRequest"("lawyerId");

-- CreateIndex
CREATE INDEX "LawyerRequest_pqrId_idx" ON "LawyerRequest"("pqrId");

-- AddForeignKey
ALTER TABLE "LawyerRequest" ADD CONSTRAINT "LawyerRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawyerRequest" ADD CONSTRAINT "LawyerRequest_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawyerRequest" ADD CONSTRAINT "LawyerRequest_pqrId_fkey" FOREIGN KEY ("pqrId") REFERENCES "PQRS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "CustomField" ADD COLUMN     "isForAnonymous" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PQRS" ADD COLUMN     "assignedToId" TEXT;

-- CreateTable
CREATE TABLE "PQRStatusHistory" (
    "id" TEXT NOT NULL,
    "status" "PQRSStatus" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pqrId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PQRStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PQRStatusHistory_pqrId_idx" ON "PQRStatusHistory"("pqrId");

-- CreateIndex
CREATE INDEX "PQRStatusHistory_userId_idx" ON "PQRStatusHistory"("userId");

-- CreateIndex
CREATE INDEX "PQRS_assignedToId_idx" ON "PQRS"("assignedToId");

-- AddForeignKey
ALTER TABLE "PQRS" ADD CONSTRAINT "PQRS_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PQRStatusHistory" ADD CONSTRAINT "PQRStatusHistory_pqrId_fkey" FOREIGN KEY ("pqrId") REFERENCES "PQRS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PQRStatusHistory" ADD CONSTRAINT "PQRStatusHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

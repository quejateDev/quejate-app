-- CreateTable
CREATE TABLE "public"."EntityResponse" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResponseAttachment" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResponseAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityResponse_entityId_idx" ON "public"."EntityResponse"("entityId");

-- CreateIndex
CREATE INDEX "EntityResponse_userId_idx" ON "public"."EntityResponse"("userId");

-- CreateIndex
CREATE INDEX "ResponseAttachment_responseId_idx" ON "public"."ResponseAttachment"("responseId");

-- AddForeignKey
ALTER TABLE "public"."EntityResponse" ADD CONSTRAINT "EntityResponse_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "public"."Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntityResponse" ADD CONSTRAINT "EntityResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResponseAttachment" ADD CONSTRAINT "ResponseAttachment_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "public"."EntityResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "UserFavoriteEntity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteEntity_userId_entityId_key" ON "UserFavoriteEntity"("userId", "entityId");

-- AddForeignKey
ALTER TABLE "UserFavoriteEntity" ADD CONSTRAINT "UserFavoriteEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteEntity" ADD CONSTRAINT "UserFavoriteEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

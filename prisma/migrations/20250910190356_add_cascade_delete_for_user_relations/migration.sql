-- DropForeignKey
ALTER TABLE "public"."PQRStatusHistory" DROP CONSTRAINT "PQRStatusHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserFavoriteEntity" DROP CONSTRAINT "UserFavoriteEntity_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavoriteEntity" ADD CONSTRAINT "UserFavoriteEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PQRStatusHistory" ADD CONSTRAINT "PQRStatusHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `verification_tokens` table. All the data in the column will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `verification_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropIndex
DROP INDEX "public"."User_verificationToken_key";

-- DropIndex
DROP INDEX "public"."verification_tokens_identifier_token_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "profilePicture",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
DROP COLUMN "verificationToken",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isOAuth" BOOLEAN,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."verification_tokens" DROP COLUMN "identifier",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."sessions";

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "public"."password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_email_token_key" ON "public"."password_reset_tokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_email_token_key" ON "public"."verification_tokens"("email", "token");

/*
  Warnings:

  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verified",
ADD COLUMN     "avatar" VARCHAR(255) NOT NULL,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL;

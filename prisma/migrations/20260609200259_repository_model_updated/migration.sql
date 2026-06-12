/*
  Warnings:

  - Added the required column `githubUpdatedAt` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPrivate` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "githubUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL;

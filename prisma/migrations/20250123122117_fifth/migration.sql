/*
  Warnings:

  - Added the required column `cargo` to the `Collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collaborator" ADD COLUMN     "cargo" TEXT NOT NULL;

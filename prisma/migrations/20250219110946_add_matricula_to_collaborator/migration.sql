/*
  Warnings:

  - Made the column `matricula` on table `Collaborator` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Collaborator" ALTER COLUMN "matricula" SET NOT NULL;

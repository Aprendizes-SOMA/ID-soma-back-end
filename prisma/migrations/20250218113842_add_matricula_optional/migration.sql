/*
  Warnings:

  - A unique constraint covering the columns `[matricula]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Collaborator" ADD COLUMN     "matricula" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_matricula_key" ON "Collaborator"("matricula");

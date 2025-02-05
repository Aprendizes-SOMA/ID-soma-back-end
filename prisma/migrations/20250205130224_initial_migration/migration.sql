/*
  Warnings:

  - You are about to drop the column `CPF` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the column `cargo` on the `Collaborator` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Collaborator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Collaborator_CPF_key";

-- AlterTable
ALTER TABLE "Collaborator" DROP COLUMN "CPF",
DROP COLUMN "cargo",
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_cpf_key" ON "Collaborator"("cpf");

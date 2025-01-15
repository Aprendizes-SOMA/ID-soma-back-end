/*
  Warnings:

  - You are about to drop the column `login` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `Colaborador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dependente` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Colaborador" DROP CONSTRAINT "Colaborador_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Dependente" DROP CONSTRAINT "Dependente_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Dependente" DROP CONSTRAINT "Dependente_colaboradorId_fkey";

-- DropIndex
DROP INDEX "Admin_login_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "login",
DROP COLUMN "senha",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Colaborador";

-- DropTable
DROP TABLE "Dependente";

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "collaboratorId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_CPF_key" ON "Collaborator"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Dependent_CPF_key" ON "Dependent"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

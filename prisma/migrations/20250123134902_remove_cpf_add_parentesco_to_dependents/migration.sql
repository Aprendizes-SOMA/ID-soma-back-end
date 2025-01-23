/*
  Warnings:

  - You are about to drop the column `CPF` on the `Dependent` table. All the data in the column will be lost.
  - Added the required column `parentesco` to the `Dependent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dependent_CPF_key";

-- AlterTable
ALTER TABLE "Dependent" DROP COLUMN "CPF",
ADD COLUMN     "parentesco" TEXT NOT NULL;

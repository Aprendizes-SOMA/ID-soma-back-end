-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colaborador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "colaboradorId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Dependente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_CPF_key" ON "Colaborador"("CPF");

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependente" ADD CONSTRAINT "Dependente_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependente" ADD CONSTRAINT "Dependente_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

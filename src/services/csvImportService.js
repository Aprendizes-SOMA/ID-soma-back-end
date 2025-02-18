const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.processCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const colaboradores = [];
    const dependentes = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        separator: ';',
        mapHeaders: ({ header }) => {
          const normalizedHeader = header ? header.toLowerCase().trim() : null;
          return normalizedHeader && normalizedHeader !== '' ? normalizedHeader : null; // Ignora colunas vazias
        }
      }))
      .on('data', (row) => {
        const cleanedRow = Object.fromEntries(
          Object.entries(row).filter(([key, value]) => key && value && value.trim() !== '')
        );

        console.log("Linha processada:", cleanedRow);

        if (cleanedRow['codigo'] && cleanedRow['cpf'] && cleanedRow['nome'] && cleanedRow['cargo']) {
          colaboradores.push({
            matricula: cleanedRow['codigo'],
            cpf: cleanedRow['cpf'],
            name: cleanedRow['nome'],
            role: cleanedRow['cargo']
          });
        } else if (cleanedRow['codigo'] && cleanedRow['nome'] && cleanedRow['parentesco']) {
          dependentes.push({
            collaboratorMatricula: cleanedRow['codigo'],
            name: cleanedRow['nome'],
            parentesco: cleanedRow['parentesco']
          });
        }
      })
      .on('end', async () => {
        try {
          console.log("Colaboradores extraídos:", colaboradores);
          console.log("Dependentes extraídos:", dependentes);

          for (const colaborador of colaboradores) {
            let existingCollaborator = await prisma.collaborator.findUnique({
              where: { matricula: colaborador.matricula },
            });

            if (!existingCollaborator) {
              existingCollaborator = await prisma.collaborator.create({
                data: {
                  matricula: colaborador.matricula,
                  cpf: colaborador.cpf,
                  name: colaborador.name,
                  role: colaborador.role,
                  adminId: 3,
                },
              });
              console.log("Novo colaborador salvo:", existingCollaborator);
            }
          }

          for (const dependente of dependentes) {
            let collaborator = await prisma.collaborator.findUnique({
              where: { matricula: dependente.collaboratorMatricula },
            });

            if (collaborator) {
              await prisma.dependent.create({
                data: {
                  name: dependente.name,
                  parentesco: dependente.parentesco,
                  collaboratorId: collaborator.id,
                  adminId: 3,
                },
              });
              console.log("Dependente salvo:", dependente);
            } else {
              console.warn("Colaborador não encontrado para dependente:", dependente);
            }
          }

          resolve();
        } catch (error) {
          console.error("Erro ao salvar no banco:", error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error("Erro ao ler CSV:", error);
        reject(error);
      });
  });
};

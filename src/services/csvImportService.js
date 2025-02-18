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
        mapHeaders: ({ header }) => header.toLowerCase().trim()
      }))
      .on('data', (row) => {
        if (row.cpf && row.nome && row.cargo) {
          colaboradores.push({
            matricula: row.código,
            cpf: row.cpf,
            name: row.nome,
            role: row.cargo
          });
        } else if (row['parentesco'] && row['código']) {
          dependentes.push({
            colaborador_matricula: row['código'],
            name: row['nome'],
            parentesco: row['parentesco']
          });
        }
      })
      .on('end', async () => {
        try {
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
            }

            for (const dependente of dependentes) {
              if (dependente.colaborador_matricula === colaborador.matricula) {
                await prisma.dependent.create({
                  data: {
                    name: dependente.name,
                    parentesco: dependente.parentesco,
                    collaboratorId: existingCollaborator.id,
                    adminId: 3,
                  },
                });
              }
            }
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

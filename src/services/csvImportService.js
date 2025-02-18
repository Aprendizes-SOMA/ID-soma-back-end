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
        console.log("Linha lida do CSV:", row);

        if (row['código'] && row['cpf'] && row['nome'] && row['cargo']) {
          colaboradores.push({
            matricula: row['código'],  
            cpf: row['cpf'],
            name: row['nome'],
            role: row['cargo']
          });
        } else if (row['código'] && row['nome'] && row['parentesco']) {
          dependentes.push({
            collaboratorMatricula: row['código'], 
            name: row['nome'],
            parentesco: row['parentesco']
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

            for (const dependente of dependentes) {
              if (dependente.collaboratorMatricula === colaborador.matricula) {
                await prisma.dependent.create({
                  data: {
                    name: dependente.name,
                    parentesco: dependente.parentesco,
                    collaboratorId: existingCollaborator.id,
                    collaboratorMatricula: dependente.collaboratorMatricula,
                    adminId: 3,
                  },
                });
                console.log("Dependente salvo:", dependente);
              }
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

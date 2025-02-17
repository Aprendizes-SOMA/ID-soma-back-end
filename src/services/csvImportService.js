const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.processCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({ 
        separator: ';',
        mapHeaders: ({ header }) => header.toLowerCase().trim() 
      }))
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          for (const row of results) {
            const { cpf, cargo, nome, dependents } = row;

            if (!cpf || !cargo || !nome) {
              console.error("Campos obrigatórios faltando na linha:", row);
              continue;
            }

            const collaborator = await prisma.collaborator.create({
              data: {
                cpf: cpf,
                role: cargo,
                name: nome,
                adminId: 3,
              },
            });

            if (dependents) {
              const dependentsArray = dependents.split(';');
              for (const depStr of dependentsArray) {
                if (!depStr.trim()) continue;
                // Esperamos o formato "nomeDependente|parentesco"
                const [depName, depParentesco] = depStr.split('|').map(item => item.trim());

                if (depName && depParentesco) {
                  await prisma.dependent.create({
                    data: {
                      name: depName,
                      parentesco: depParentesco,
                      collaboratorId: collaborator.id,
                      adminId: 3,
                    },
                  });
                }
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

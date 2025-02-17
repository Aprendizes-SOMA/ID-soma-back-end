const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_ADMIN_ID = 1;

exports.processCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',', headers: true }))
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          for (const row of results) {
            const { cpf, nome, cargo, dependents } = row;

            const collaborator = await prisma.collaborator.create({
              data: {
                name: nome,
                cpf: cpf,
                role: cargo,
                adminId: DEFAULT_ADMIN_ID,
              },
            });

            if (dependents) {
              const dependentsArray = dependents.split(';');
              for (const depStr of dependentsArray) {
                if (!depStr.trim()) continue;

                const [depNome, depCpf, depParentesco] = depStr.split('|').map(item => item.trim());

                if (depNome && depCpf && depParentesco) {
                  await prisma.dependent.create({
                    data: {
                      name: depNome,
                      cpf: depCpf,
                      parentesco: depParentesco,
                      collaboratorId: collaborator.id,
                      adminId: DEFAULT_ADMIN_ID,
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

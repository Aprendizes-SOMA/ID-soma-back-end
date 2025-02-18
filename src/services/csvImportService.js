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
        separator: detectDelimiter(filePath),
        mapHeaders: ({ header }) => {
          const normalizedHeader = header ? header.toLowerCase().trim() : null;
          return normalizedHeader && normalizedHeader !== '' ? normalizedHeader : null;
        }
      }))
      .on('data', (row) => {
        console.log("Linha processada:", row);

        if (row['codigo'] && row['cpf'] && row['nome'] && row['cargo']) {
          colaboradores.push({
            matricula: row['codigo'],
            cpf: row['cpf'],
            name: row['nome'],
            role: row['cargo']
          });
        } else if (row['codigo'] && row['nome'] && row['parentesco']) {
          dependentes.push({
            collaboratorMatricula: row['codigo'],
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
            let existingCollaborator = await prisma.collaborator.findFirst({
              where: { matricula: String(colaborador.matricula) },
            });                     

            if (!existingCollaborator) {
              existingCollaborator = await prisma.collaborator.create({
                data: {
                  matricula: colaborador.matricula || "SEM_MATRICULA",
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

function detectDelimiter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(';') ? ';' : ',';
}

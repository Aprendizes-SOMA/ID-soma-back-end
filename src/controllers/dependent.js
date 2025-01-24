const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const addDependent = async (req, res) => {
  const { name, parentesco, collaboratorId, adminId } = req.body;

  if (!name || !parentesco || !collaboratorId || !adminId) {
    console.error('[addDependent] Campos obrigatórios faltando.', req.body);
    return res.status(400).json({ error: 'All fields (name, parentesco, collaboratorId, adminId) are required' });
  }

  try {
    const collaborator = await prisma.collaborator.findUnique({ where: { id: collaboratorId } });
    if (!collaborator) {
      console.error(`[addDependent] Colaborador com id ${collaboratorId} não encontrado.`);
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    const dependent = await prisma.dependent.create({
      data: {
        name,
        parentesco,
        collaboratorId,
        adminId,
      },
    });

    res.status(201).json(dependent);
  } catch (error) {
    console.error(`[addDependent] Erro ao adicionar dependente: ${error.message}`, error);
    res.status(500).json({ error: 'Error adding dependent' });
  }
};

const listDependents = async (req, res) => {
  try {
    const dependents = await prisma.dependent.findMany({
      include: { collaborator: true },
    });
    res.json(dependents);
  } catch (error) {
    console.error(`[listDependents] Erro ao listar dependentes: ${error.message}`, error);
    res.status(500).json({ error: 'Error listing dependents' });
  }
};

const updateDependent = async (req, res) => {
  const { id } = req.params;
  const { name, parentesco } = req.body;

  try {
    const dependent = await prisma.dependent.update({
      where: { id: parseInt(id) },
      data: { name, parentesco },
    });

    res.json(dependent);
  } catch (error) {
    console.error(`[updateDependent] Erro ao atualizar dependente com id ${id}: ${error.message}`, error);
    res.status(500).json({ error: 'Error updating dependent' });
  }
};

const deleteDependent = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.dependent.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Dependent successfully deleted' });
  } catch (error) {
    console.error(`[deleteDependent] Erro ao deletar dependente com id ${id}: ${error.message}`, error);
    res.status(500).json({ error: 'Error deleting dependent' });
  }
};

module.exports = {
  addDependent,
  listDependents,
  updateDependent,
  deleteDependent,
};
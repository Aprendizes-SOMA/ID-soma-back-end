const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const addCollaborator = async (req, res) => {
  const { name, CPF, adminId } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const collaborator = await prisma.collaborator.create({
      data: { name, CPF, adminId },
    });

    res.status(201).json(collaborator);
  } catch (error) {
    console.error('Error adding collaborator:', error.message);
    res.status(500).json({ error: 'Error adding collaborator' });
  }
};

const listCollaborators = async (req, res) => {
  try {
    const collaborators = await prisma.collaborator.findMany({
      include: { Dependents: true },
    });
    res.json(collaborators);
  } catch (error) {
    console.error('Error listing collaborators:', error.message);
    res.status(500).json({ error: 'Error listing collaborators' });
  }
};

const updateCollaborator = async (req, res) => {
  const { id } = req.params;
  const { name, CPF } = req.body;

  try {
    const collaborator = await prisma.collaborator.update({
      where: { id: parseInt(id) },
      data: { name, CPF },
    });
    res.json(collaborator);
  } catch (error) {
    console.error('Error updating collaborator:', error.message);
    res.status(500).json({ error: 'Error updating collaborator' });
  }
};

const deleteCollaborator = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.collaborator.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Collaborator successfully deleted' });
  } catch (error) {
    console.error('Error deleting collaborator:', error.message);
    res.status(500).json({ error: 'Error deleting collaborator' });
  }
};

module.exports = {
  addCollaborator,
  listCollaborators,
  updateCollaborator,
  deleteCollaborator,
};

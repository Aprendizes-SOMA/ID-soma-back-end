const {
  PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();
const addDependent = async (req, res) => {
  const {
    name,
    CPF,
    collaboratorId
  } = req.body;
  try {
    const collaborator = await prisma.collaborator.findUnique({
      where: {
        id: collaboratorId
      }
    });
    if (!collaborator) {
      return res.status(404).json({
        error: 'Collaborator not found'
      });
    }
    const dependent = await prisma.dependent.create({
      data: {
        name,
        CPF,
        collaboratorId,
        adminId: collaborator.adminId
      }
    });
    res.status(201).json(dependent);
  } catch (error) {
    console.error('Error adding dependent:', error.message);
    res.status(500).json({
      error: 'Error adding dependent'
    });
  }
};
const listDependents = async (req, res) => {
  try {
    const dependents = await prisma.dependent.findMany({
      include: {
        collaborator: false,
        admin: false
      }
    });
    res.json(dependents);
  } catch (error) {
    console.error('Error listing dependents:', error.message);
    res.status(500).json({
      error: 'Error listing dependents'
    });
  }
};
const updateDependent = async (req, res) => {
  const {
    id
  } = req.params;
  const {
    name,
    CPF
  } = req.body;
  try {
    const dependent = await prisma.dependent.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        CPF
      }
    });
    res.json(dependent);
  } catch (error) {
    console.error('Error updating dependent:', error.message);
    res.status(500).json({
      error: 'Error updating dependent'
    });
  }
};
const deleteDependent = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    await prisma.dependent.delete({
      where: {
        id: parseInt(id)
      }
    });
    res.json({
      message: 'Dependent successfully deleted'
    });
  } catch (error) {
    console.error('Error deleting dependent:', error.message);
    res.status(500).json({
      error: 'Error deleting dependent'
    });
  }
};
module.exports = {
  addDependent,
  listDependents,
  updateDependent,
  deleteDependent
};
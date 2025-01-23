const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const addCollaborator = async (req, res) => {
  const { name, CPF, adminId, cargo } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const collaborator = await prisma.collaborator.create({
      data: { name, CPF, adminId, cargo },
    });

    res.status(201).json(collaborator);
  } catch (error) {
    console.error("Error adding collaborator:", error.message);
    res.status(500).json({ error: "Error adding collaborator" });
  }
};

const listCollaborators = async (req, res) => {
  try {
    const collaborators = await prisma.collaborator.findMany({
      include: { Dependents: true },
    });
    res.json(collaborators);
  } catch (error) {
    console.error("Error listing collaborators:", error.message);
    res.status(500).json({ error: "Error listing collaborators" });
  }
};

const listCollaboratorsByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Name must be provided" });
  }

  try {
    const collaborators = await prisma.collaborator.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      },
      include: {
        Dependents: true
      }
    });

    if (collaborators.length === 0) {
      return res.status(404).json({ error: "No collaborators found" });
    }
    res.json(collaborators);
  } catch (error) {
    console.error("Error listing collaborators by name:", error.message);
    res.status(500).json({ error: "Error listing collaborators by name" });
  }
};

const listCollaboratorsByCPF = async (req, res) => {
  const { CPF } = req.query;

  if (!CPF) {
    return res.status(400).json({ error: "CPF must be provided" });
  }

  try {
    const collaborator = await prisma.collaborator.findUnique({
      where: {
        CPF: CPF,
      },
      include: { Dependents: true },
    });

    if (!collaborator) {
      return res.status(404).json({ error: "No collaborator found" });
    }

    res.json(collaborator);
  } catch (error) {
    console.error("Error listing collaborator by CPF:", error.message);
    res.status(500).json({ error: "Error listing collaborator by CPF" });
  }
};

const getCollaboratorById = async (req, res) => {
  const { id } = req.params;

  try {
    const collaborator = await prisma.collaborator.findUnique({
      where: { id: Number(id) },
      include: { Dependents: true },
    });
    if (collaborator) {
      res.json(collaborator);
    } else {
      res.status(404).json({ error: "Collaborator not found" });
    }
  } catch (error) {
    console.error("Error getting collaborator by ID:", error.message);
    res.status(500).json({ error: "Error getting collaborator by ID" });
  }
};

const updateCollaborator = async (req, res) => {
  const { id } = req.params;
  const { name, CPF, cargo } = req.body;

  try {
    const collaborator = await prisma.collaborator.update({
      where: { id: parseInt(id) },
      data: { name, CPF, cargo },
    });
    res.json(collaborator);
  } catch (error) {
    console.error("Error updating collaborator:", error.message);
    res.status(500).json({ error: "Error updating collaborator" });
  }
};

const deleteCollaborator = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.collaborator.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Collaborator successfully deleted" });
  } catch (error) {
    console.error("Error deleting collaborator:", error.message);
    res.status(500).json({ error: "Error deleting collaborator" });
  }
};

module.exports = {
  addCollaborator,
  listCollaborators,
  updateCollaborator,
  deleteCollaborator,
  getCollaboratorById,
  listCollaboratorsByName,
  listCollaboratorsByCPF,
};

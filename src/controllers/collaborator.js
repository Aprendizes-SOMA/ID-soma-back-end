const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const addCollaborator = async (req, res) => {
  const { name, CPF, adminId, cargo } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      console.error(`[addCollaborator] Admin com id ${adminId} não encontrado.`);
      return res.status(404).json({ error: "Admin not found" });
    }

    const collaborator = await prisma.collaborator.create({
      data: { name, CPF, adminId, cargo },
    });

    res.status(201).json(collaborator);
  } catch (error) {
    console.error(`[addCollaborator] Erro ao adicionar colaborador: ${error.message}`, error);
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
    console.error(`[listCollaborators] Erro ao listar colaboradores: ${error.message}`, error);
    res.status(500).json({ error: "Error listing collaborators" });
  }
};

const listCollaboratorsByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    console.error(`[listCollaboratorsByName] Nome não fornecido na query.`);
    return res.status(400).json({ error: "Name must be provided" });
  }

  try {
    const collaborators = await prisma.collaborator.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: { Dependents: true },
    });

    if (collaborators.length === 0) {
      console.error(`[listCollaboratorsByName] Nenhum colaborador encontrado com o nome "${name}".`);
      return res.status(404).json({ error: "No collaborators found" });
    }

    res.json(collaborators);
  } catch (error) {
    console.error(`[listCollaboratorsByName] Erro ao buscar colaboradores por nome: ${error.message}`, error);
    res.status(500).json({ error: "Error listing collaborators by name" });
  }
};

const listCollaboratorsByCPF = async (req, res) => {
  const { CPF } = req.query;

  if (!CPF) {
    console.error(`[listCollaboratorsByCPF] CPF não fornecido na query.`);
    return res.status(400).json({ error: "CPF must be provided" });
  }

  try {
    const collaborator = await prisma.collaborator.findUnique({
      where: { CPF },
      include: { Dependents: true },
    });

    if (!collaborator) {
      console.error(`[listCollaboratorsByCPF] Nenhum colaborador encontrado com o CPF "${CPF}".`);
      return res.status(404).json({ error: "No collaborator found" });
    }

    res.json(collaborator);
  } catch (error) {
    console.error(`[listCollaboratorsByCPF] Erro ao buscar colaborador por CPF: ${error.message}`, error);
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

    if (!collaborator) {
      console.error(`[getCollaboratorById] Colaborador com id ${id} não encontrado.`);
      return res.status(404).json({ error: "Collaborator not found" });
    }

    res.json(collaborator);
  } catch (error) {
    console.error(`[getCollaboratorById] Erro ao buscar colaborador por ID: ${error.message}`, error);
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
    console.error(`[updateCollaborator] Erro ao atualizar colaborador com id ${id}: ${error.message}`, error);
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
    console.error(`[deleteCollaborator] Erro ao deletar colaborador com id ${id}: ${error.message}`, error);
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

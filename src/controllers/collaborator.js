const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const addCollaborator = async (req, res) => {
  const { matricula, name, cpf, role } = req.body;
  const adminId = req.admin.id;

  if (!matricula || !name || !cpf || !role) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const collaborator = await prisma.collaborator.create({
      data: { 
        matricula: String(matricula).trim() || null, 
        name: String(name).trim(), 
        cpf: String(cpf).trim(), 
        adminId, 
        role: String(role).trim() 
      },
    });

    res.status(201).json(collaborator);
  } catch (error) {
    console.error(`[addCollaborator] Erro ao adicionar colaborador: ${error.message}`, error);
    res.status(500).json({ error: "Erro ao adicionar colaborador." });
  }
};

const listCollaborators = async (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy = "matricula", order = "asc" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (limit > 50) {
      limit = 50;
    }

    const validSortFields = ["matricula", "name", "cpf"];
    if (!validSortFields.includes(sortBy)) {
      console.warn(`Parâmetro sortBy inválido: ${sortBy}. Usando "matricula" como padrão.`);
      sortBy = "matricula";
    }

    order = order.toLowerCase() === "desc" ? "desc" : "asc";

    const offset = (page - 1) * limit;

    const orderBy = {};
    orderBy[sortBy] = order;

    const collaborators = await prisma.collaborator.findMany({
      take: limit,
      skip: offset,
      orderBy,
      include: {
        Dependents: {
          select: {
            id: true,
            name: true,
            parentesco: true,
          },
        },
      },
    });

    const totalItems = await prisma.collaborator.count();
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    res.json({
      currentPage: page,
      totalPages,
      totalItems,
      pageSize: limit,
      data: collaborators,
    });

  } catch (error) {
    console.error(`[listCollaborators] Erro ao listar colaboradores: ${error.message}`, error);
    res.status(500).json({ error: "Erro ao listar colaboradores." });
  }
};

const listCollaboratorsByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "O nome deve ser fornecido." });
  }

  try {
    const collaborators = await prisma.collaborator.findMany({
      where: {
        name: {
          contains: name.trim(),
          mode: "insensitive",
        },
      },
      include: { Dependents: true },
    });

    if (collaborators.length === 0) {
      return res.status(404).json({ error: "Nenhum colaborador encontrado." });
    }

    res.json(collaborators);
  } catch (error) {
    console.error(`[listCollaboratorsByName] Erro ao buscar por nome: ${error.message}`, error);
    res.status(500).json({ error: "Erro ao buscar colaboradores." });
  }
};

const listCollaboratorsByCPF = async (req, res) => {
  const { cpf } = req.query;

  if (!cpf) {
    return res.status(400).json({ error: "O CPF deve ser fornecido." });
  }

  try {
    const collaborator = await prisma.collaborator.findUnique({
      where: { cpf: cpf.trim() },
      include: { Dependents: true },
    });

    if (!collaborator) {
      return res.status(404).json({ error: "Nenhum colaborador encontrado com este CPF." });
    }

    res.json(collaborator);
  } catch (error) {
    console.error(`[listCollaboratorsByCPF] Erro ao buscar por CPF: ${error.message}`, error);
    res.status(500).json({ error: "Erro ao buscar colaborador." });
  }
};

const getCollaboratorById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const collaborator = await prisma.collaborator.findUnique({
      where: { id: Number(id) },
      include: { Dependents: true },
    });

    if (!collaborator) {
      return res.status(404).json({ error: "Colaborador não encontrado." });
    }

    res.json(collaborator);
  } catch (error) {
    console.error(`[getCollaboratorById] Erro ao buscar por ID: ${error.message}`, error);
    res.status(500).json({ error: "Erro ao buscar colaborador." });
  }
};

const updateCollaborator = async (req, res) => {
  const { id } = req.params;
  const { matricula, name, cpf, role } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const existingCollaborator = await prisma.collaborator.findUnique({ where: { id: parseInt(id) } });

    if (!existingCollaborator) {
      return res.status(404).json({ error: "Colaborador não encontrado." });
    }

    const collaborator = await prisma.collaborator.update({
      where: { id: parseInt(id) },
      data: { 
        matricula: matricula ? String(matricula).trim() : existingCollaborator.matricula,
        name: name ? String(name).trim() : existingCollaborator.name,
        cpf: cpf ? String(cpf).trim() : existingCollaborator.cpf,
        role: role ? String(role).trim() : existingCollaborator.role,
      },
    });

    res.json(collaborator);
  } catch (error) {
    console.error(`[updateCollaborator] Erro ao atualizar: ${error.message}`, error);
    res.status(500).json({ error: "Erro ao atualizar colaborador." });
  }
};

const deleteCollaborator = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const existingCollaborator = await prisma.collaborator.findUnique({ where: { id: parseInt(id) } });

    if (!existingCollaborator) {
      return res.status(404).json({ error: "Colaborador não encontrado." });
    }

    await prisma.collaborator.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Colaborador excluído com sucesso." });
  } catch (error) {
    console.error(`[deleteCollaborator] Erro ao deletar: ${error.message}`, error);
    res.status(500).json({ error: "Erro ao deletar colaborador." });
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

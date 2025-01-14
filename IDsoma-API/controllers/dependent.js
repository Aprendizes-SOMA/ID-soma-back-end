const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adicionarDependente = async (req, res) => {
  const { nome, CPF, colaboradorId, adminId } = req.body;
  try {
    const dependente = await prisma.dependente.create({
      data: { nome, CPF, colaboradorId, adminId },
    });
    res.status(201).json(dependente);
  } catch (error) {
    console.error('Erro ao adicionar dependente:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar dependente' });
  }
};

const listarDependentes = async (req, res) => {
  try {
    const dependentes = await prisma.dependente.findMany({
      include: { colaborador: true, admin: true },
    });
    res.json(dependentes);
  } catch (error) {
    console.error('Erro ao listar dependentes:', error.message);
    res.status(500).json({ error: 'Erro ao listar dependentes' });
  }
};

const atualizarDependente = async (req, res) => {
  const { id } = req.params;
  const { nome, CPF } = req.body;
  try {
    const dependente = await prisma.dependente.update({
      where: { id: parseInt(id) },
      data: { nome, CPF },
    });
    res.json(dependente);
  } catch (error) {
    console.error('Erro ao atualizar dependente:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar dependente' });
  }
};

const excluirDependente = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.dependente.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Dependente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir dependente:', error.message);
    res.status(500).json({ error: 'Erro ao excluir dependente' });
  }
};

module.exports = {
  adicionarDependente,
  listarDependentes,
  atualizarDependente,
  excluirDependente,
};

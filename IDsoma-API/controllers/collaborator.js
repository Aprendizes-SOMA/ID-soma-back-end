const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adicionarColaborador = async (req, res) => {
  const { nome, CPF, adminId } = req.body;
  try {
    const colaborador = await prisma.colaborador.create({
      data: { nome, CPF, adminId },
    });
    res.status(201).json(colaborador);
  } catch (error) {
    console.error('Erro ao adicionar colaborador:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar colaborador' });
  }
};

const listarColaboradores = async (req, res) => {
  try {
    const colaboradores = await prisma.colaborador.findMany({
      include: { Dependente: true },
    });
    res.json(colaboradores);
  } catch (error) {
    console.error('Erro ao listar colaboradores:', error.message);
    res.status(500).json({ error: 'Erro ao listar colaboradores' });
  }
};

const atualizarColaborador = async (req, res) => {
  const { id } = req.params;
  const { nome, CPF } = req.body;
  try {
    const colaborador = await prisma.colaborador.update({
      where: { id: parseInt(id) },
      data: { nome, CPF },
    });
    res.json(colaborador);
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar colaborador' });
  }
};

const excluirColaborador = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.colaborador.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Colaborador excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir colaborador:', error.message);
    res.status(500).json({ error: 'Erro ao excluir colaborador' });
  }
};

module.exports = {
  adicionarColaborador,
  listarColaboradores,
  atualizarColaborador,
  excluirColaborador,
};

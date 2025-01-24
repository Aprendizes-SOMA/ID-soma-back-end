const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const jwt = require('jsonwebtoken');

const addAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.error('[addAdmin] Username ou senha não fornecidos.');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    console.error(`[addAdmin] Erro ao criar admin: ${error.message}`, error);
    res.status(500).json({ error: 'Error creating admin' });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  if (!username && !password) {
    console.error('[updateAdmin] Nenhum campo fornecido para atualização.');
    return res.status(400).json({ error: 'At least one field (username or password) must be provided' });
  }

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    console.error(`[updateAdmin] Erro ao atualizar admin com id ${id}: ${error.message}`, error);
    res.status(500).json({ error: 'Error updating admin' });
  }
};

const listAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.status(200).json(admins);
  } catch (error) {
    console.error(`[listAdmins] Erro ao listar admins: ${error.message}`, error);
    res.status(500).json({ error: 'Error listing admins' });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.admin.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Admin successfully deleted' });
  } catch (error) {
    console.error(`[deleteAdmin] Erro ao deletar admin com id ${id}: ${error.message}`, error);
    res.status(500).json({ error: 'Error deleting admin' });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.error('[loginAdmin] Username ou senha não fornecidos.');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      console.error(`[loginAdmin] Admin com username "${username}" não encontrado.`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      console.error(`[loginAdmin] Senha inválida para o username "${username}".`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(`[loginAdmin] Erro ao fazer login do admin "${username}": ${error.message}`, error);
    res.status(500).json({ error: 'Error logging in admin' });
  }
};

module.exports = {
  addAdmin,
  updateAdmin,
  listAdmins,
  deleteAdmin,
  loginAdmin
};

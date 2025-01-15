const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    console.error('Error creating admin:', error.message);
    res.status(500).json({ error: 'Error creating admin' });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  if (!username && !password) {
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
    console.error('Error updating admin:', error.message);
    res.status(500).json({ error: 'Error updating admin' });
  }
};

const listAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error listing admins:', error.message);
    res.status(500).json({ error: 'Error listing admins' });
  }
};

module.exports = {
  addAdmin,
  updateAdmin,
  listAdmins,
};

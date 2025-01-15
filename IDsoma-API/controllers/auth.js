const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

const login = async (req, res) => {
  const { CPF, username, password } = req.body;

  try {
    if (username && password) {
      const admin = await prisma.admin.findUnique({ where: { username } });

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign({ id: admin.id, userType: 'Admin' }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Admin authenticated', token });
    }

    if (CPF) {
      const collaborator = await prisma.collaborator.findUnique({ where: { CPF } });

      if (!collaborator) {
        return res.status(404).json({ error: 'Collaborator not found' });
      }

      const token = jwt.sign({ id: collaborator.id, userType: 'Collaborator' }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Collaborator authenticated', token });
    }

    res.status(400).json({ error: 'Invalid login credentials' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { login };

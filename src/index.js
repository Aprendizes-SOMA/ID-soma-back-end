const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());

const collaboratorsRoutes = require('./routes/collaborator');
const dependentsRoutes = require('./routes/dependent');
const adminRoutes = require('./routes/admin');

app.use('/collaborator', collaboratorsRoutes);
app.use('/dependents', dependentsRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso!');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/test-db', async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.status(200).json({ message: 'Database connected successfully', admins });
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

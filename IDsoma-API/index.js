require('dotenv').config();
const express = require('express');
const app = express();

const colaboradoresRoutes = require('./routes/collaborator');
const dependentesRoutes = require('./routes/dependent');

app.use(express.json());

app.use('/collaborator', colaboradoresRoutes);
app.use('/dependents', dependentesRoutes);

app.get('/', (req, res) => {
  res.send('API está rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

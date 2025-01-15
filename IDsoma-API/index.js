const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth');
const collaboratorsRoutes = require('./routes/collaborator');
const dependentsRoutes = require('./routes/dependent');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/collaborator', collaboratorsRoutes);
app.use('/dependents', dependentsRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

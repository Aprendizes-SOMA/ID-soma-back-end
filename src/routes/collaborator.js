const express = require('express');
const router = express.Router();
const {
  addCollaborator,
  listCollaborators,
  updateCollaborator,
  deleteCollaborator,
  listCollaboratorsByName,
  listCollaboratorsByCPF,
  getCollaboratorById,
  getCollaboratorByExactName
} = require('../controllers/collaborator');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, addCollaborator);
router.get('/', authenticateToken, listCollaborators);
router.put('/:id', authenticateToken, updateCollaborator);
router.delete('/:id', authenticateToken, deleteCollaborator);
router.get('/exact-name', getCollaboratorByExactName);
router.get('/search-name', listCollaboratorsByName);
router.get('/search-cpf', listCollaboratorsByCPF);
router.get('/:id', authenticateToken, getCollaboratorById);

module.exports = router;

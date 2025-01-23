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
} = require('../controllers/collaborator');

router.post('/', addCollaborator);
router.get('/', listCollaborators);
router.put('/:id', updateCollaborator);
router.delete('/:id', deleteCollaborator);
router.get('/search-name', listCollaboratorsByName);
router.get('/search-cpf', listCollaboratorsByCPF);
router.get('/:id', getCollaboratorById);

module.exports = router;

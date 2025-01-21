const express = require('express');
const router = express.Router();
const {
  addCollaborator,
  listCollaborators,
  updateCollaborator,
  deleteCollaborator
} = require('../controllers/collaborator');
router.post('/', addCollaborator);
router.get('/', listCollaborators);
router.put('/:id', updateCollaborator);
router.delete('/:id', deleteCollaborator);
module.exports = router;
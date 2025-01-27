const express = require('express');
const router = express.Router();
const {
  addDependent,
  listDependents,
  updateDependent,
  deleteDependent,
} = require('../controllers/dependent');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, addDependent);
router.get('/', authenticateToken, listDependents);
router.put('/:id', authenticateToken, updateDependent);
router.delete('/:id', authenticateToken, deleteDependent);

module.exports = router;

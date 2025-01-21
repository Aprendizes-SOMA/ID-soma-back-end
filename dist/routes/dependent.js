const express = require('express');
const router = express.Router();
const {
  addDependent,
  listDependents,
  updateDependent,
  deleteDependent
} = require('../controllers/dependent');
router.post('/', addDependent);
router.get('/', listDependents);
router.put('/:id', updateDependent);
router.delete('/:id', deleteDependent);
module.exports = router;
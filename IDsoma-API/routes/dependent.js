const express = require('express');
const router = express.Router();
const {
  adicionarDependente,
  listarDependentes,
  atualizarDependente,
  excluirDependente,
} = require('../controllers/dependent'); 

router.post('/', adicionarDependente);
router.get('/', listarDependentes);
router.put('/:id', atualizarDependente);
router.delete('/:id', excluirDependente);

module.exports = router;

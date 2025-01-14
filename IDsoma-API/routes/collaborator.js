const express = require('express');
const router = express.Router();
const {
  adicionarColaborador,
  listarColaboradores,
  atualizarColaborador,
  excluirColaborador,
} = require('../controllers/collaborator');

router.post('/', adicionarColaborador);
router.get('/', listarColaboradores);
router.put('/:id', atualizarColaborador);
router.delete('/:id', excluirColaborador);

module.exports = router;

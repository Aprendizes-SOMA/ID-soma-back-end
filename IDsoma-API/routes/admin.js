const express = require('express');
const router = express.Router();
const { addAdmin, updateAdmin, listAdmins, deleteAdmin } = require('../controllers/admin');

router.post('/', addAdmin);
router.put('/:id', updateAdmin);
router.get('/', listAdmins);
router.delete('/:id', deleteAdmin)

module.exports = router;

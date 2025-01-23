const express = require('express');
const router = express.Router();
const { addAdmin, updateAdmin, listAdmins, deleteAdmin, loginAdmin } = require('../controllers/admin');
const authenticateToken = require('../middleware/auth');

router.post('/login', loginAdmin);

router.post('/', addAdmin);
router.put('/:id', authenticateToken, updateAdmin);
router.get('/', authenticateToken, listAdmins);
router.delete('/:id', authenticateToken, deleteAdmin);

module.exports = router;

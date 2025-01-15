const express = require('express');
const router = express.Router();
const { authenticate, authenticateAdmin } = require('../middleware/auth');
const { addAdmin, updateAdmin, listAdmins } = require('../controllers/admin');

router.post('/', authenticate, authenticateAdmin, addAdmin);
router.put('/:id', authenticate, authenticateAdmin, updateAdmin);
router.get('/', authenticate, authenticateAdmin, listAdmins);

module.exports = router;

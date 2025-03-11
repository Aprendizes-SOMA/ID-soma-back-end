const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvImportController = require('../controllers/csvImportController');

const upload = multer({ dest: 'uploads/' });

router.post('/import-csv', upload.single('file'), csvImportController.importCSV);

module.exports = router;

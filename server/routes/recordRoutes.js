const express = require('express');
const { analyzeRecord, getRecordHistory } = require('../controllers/recordController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/analyze', protect, upload.single('pdfFile'), analyzeRecord); // <-- Nama key 'pdfFile'
router.get('/', protect, getRecordHistory);

module.exports = router;
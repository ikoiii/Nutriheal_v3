// server/routes/recordRoutes.js
const express = require('express');

// === PERUBAHAN DI SINI ===
// Impor fungsi-fungsi baru dari file controller yang BARU
const { analyzeRecord, getRecordHistory } = require('../controllers/recordController'); // <-- Ganti 'mealController' menjadi 'recordController'
// ==========================

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Arahkan rute ke fungsi yang baru
router.post('/analyze', protect, upload.single('pdfFile'), analyzeRecord); // <-- Nama key 'pdfFile'
router.get('/', protect, getRecordHistory);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createDailyLogEntry, getDailyLogsHistory } = require('../controllers/dailyLogController');
const { protect } = require('../middleware/authMiddleware');

// Protect all daily log routes with authentication middleware
router.post('/', protect, createDailyLogEntry);
router.get('/', protect, getDailyLogsHistory);

module.exports = router;

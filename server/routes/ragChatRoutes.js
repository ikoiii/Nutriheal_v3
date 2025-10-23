const express = require('express');
const router = express.Router();
const { getChatReply } = require('../controllers/ragChatController');
const { protect } = require('../middleware/authMiddleware');

// Protect chat routes with authentication middleware
router.post('/', protect, getChatReply);

module.exports = router;

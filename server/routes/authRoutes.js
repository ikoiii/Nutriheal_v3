// server/routes/authRoutes.js

const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Endpoint untuk registrasi
// POST /api/auth/register
router.post('/register', registerUser);

// Endpoint untuk login
// POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;
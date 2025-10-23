const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);
router.get('/me', protect, authController.getLoggedInUserProfile);

module.exports = router;

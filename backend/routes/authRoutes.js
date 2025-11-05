// ============================================================
// Authentication Routes
// ============================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register/student', validateRegistration, authController.registerStudent);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/me', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;

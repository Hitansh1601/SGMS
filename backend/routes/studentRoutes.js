// ============================================================
// Student Routes
// ============================================================

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, isStudent } = require('../middleware/auth');
const { validateMessage, validateFeedback, validateGrievanceId } = require('../middleware/validation');

// All routes require student authentication
router.use(authenticateToken, isStudent);

// Message routes
router.get('/grievances/:id/messages', validateGrievanceId, studentController.getGrievanceMessages);
router.post('/grievances/:id/messages', validateGrievanceId, validateMessage, studentController.sendMessage);

// Feedback route
router.post('/grievances/:id/feedback', validateGrievanceId, validateFeedback, studentController.submitFeedback);

// Notification routes
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/:id/read', studentController.markNotificationRead);

// Utility routes
router.get('/categories', studentController.getCategories);
router.get('/status', studentController.getStatusOptions);

module.exports = router;

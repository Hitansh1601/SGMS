// ============================================================
// Faculty Routes
// ============================================================

const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { authenticateToken, isFaculty } = require('../middleware/auth');
const { validateMessage, validateGrievanceId, validatePagination, validateSearchFilters } = require('../middleware/validation');

// All routes require faculty authentication
router.use(authenticateToken, isFaculty);

// Grievance routes
router.get('/grievances', validatePagination, validateSearchFilters, facultyController.getAssignedGrievances);
router.get('/stats', facultyController.getFacultyStats);

// Message routes
router.get('/grievances/:id/messages', validateGrievanceId, facultyController.getGrievanceMessages);
router.post('/grievances/:id/messages', validateGrievanceId, validateMessage, facultyController.sendMessage);

// Notification routes
router.get('/notifications', facultyController.getNotifications);
router.put('/notifications/:id/read', facultyController.markNotificationRead);

module.exports = router;

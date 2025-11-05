// ============================================================
// Admin Routes
// ============================================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { validateRegistration, validateUserId, validateUserUpdate, validateCategory, validatePagination, validateSearchFilters } = require('../middleware/validation');

// All routes require admin authentication
router.use(authenticateToken, isAdmin);

// User management routes
router.get('/students', validatePagination, adminController.getAllStudents);
router.get('/faculty', validatePagination, adminController.getAllFaculty);
router.post('/students', validateRegistration, adminController.addStudent);
router.post('/faculty', validateRegistration, adminController.addFaculty);
router.put('/students/:id', validateUserId, validateUserUpdate, adminController.updateStudent);
router.put('/faculty/:id', validateUserId, validateUserUpdate, adminController.updateFaculty);

// Grievance management routes
router.get('/grievances', validatePagination, validateSearchFilters, adminController.getAllGrievances);
router.put('/grievances/:id/assign', adminController.assignGrievance);

// Category management routes
router.get('/categories', adminController.getAllCategories);
router.post('/categories', validateCategory, adminController.addCategory);
router.put('/categories/:id', adminController.updateCategory);

// Statistics routes
router.get('/stats', adminController.getDashboardStats);
router.get('/faculty/workload', adminController.getFacultyWorkload);

module.exports = router;

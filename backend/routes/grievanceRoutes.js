// ============================================================
// Grievance Routes
// ============================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const grievanceController = require('../controllers/grievanceController');
const { authenticateToken, isStudent, isFacultyOrAdmin } = require('../middleware/auth');
const { validateGrievance, validateGrievanceUpdate, validateGrievanceId, validatePagination, validateSearchFilters } = require('../middleware/validation');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'grievance-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs only
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images, PDFs, and documents are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Student routes
router.post(
    '/',
    authenticateToken,
    isStudent,
    upload.single('attachment'),
    validateGrievance,
    grievanceController.createGrievance
);

router.get(
    '/student',
    authenticateToken,
    isStudent,
    validatePagination,
    validateSearchFilters,
    grievanceController.getStudentGrievances
);

router.get(
    '/stats/student',
    authenticateToken,
    isStudent,
    grievanceController.getStudentStats
);

// Common routes (all authenticated users)
router.get(
    '/:id',
    authenticateToken,
    validateGrievanceId,
    grievanceController.getGrievanceById
);

// Faculty/Admin routes
router.put(
    '/:id',
    authenticateToken,
    isFacultyOrAdmin,
    validateGrievanceId,
    validateGrievanceUpdate,
    grievanceController.updateGrievance
);

router.delete(
    '/:id',
    authenticateToken,
    isFacultyOrAdmin,
    validateGrievanceId,
    grievanceController.deleteGrievance
);

module.exports = router;

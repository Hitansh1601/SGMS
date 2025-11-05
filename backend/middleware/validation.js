// ============================================================
// Validation Middleware
// Input validation using express-validator
// ============================================================

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 * Returns errors if validation fails
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }
    
    next();
};

// ============================================================
// AUTHENTICATION VALIDATIONS
// ============================================================

const validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department must be max 100 characters'),
    
    body('contact')
        .optional()
        .trim()
        .matches(/^[0-9]{10,15}$/).withMessage('Contact must be 10-15 digits'),
    
    body('enrollment_no')
        .if(body('role').equals('student'))
        .notEmpty().withMessage('Enrollment number is required for students')
        .trim()
        .isLength({ max: 50 }).withMessage('Enrollment number must be max 50 characters'),
    
    body('employee_id')
        .if(body('role').equals('faculty'))
        .notEmpty().withMessage('Employee ID is required for faculty')
        .trim()
        .isLength({ max: 50 }).withMessage('Employee ID must be max 50 characters'),
    
    validate,
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required'),
    
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['student', 'faculty', 'admin']).withMessage('Invalid role'),
    
    validate,
];

// ============================================================
// GRIEVANCE VALIDATIONS
// ============================================================

const validateGrievance = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    
    body('category_id')
        .notEmpty().withMessage('Category is required')
        .isInt({ min: 1 }).withMessage('Invalid category'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    
    validate,
];

const validateGrievanceUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    
    body('status_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Invalid status'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    
    body('resolution_notes')
        .optional()
        .trim(),
    
    validate,
];

const validateGrievanceId = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid grievance ID'),
    
    validate,
];

// ============================================================
// MESSAGE VALIDATIONS
// ============================================================

const validateMessage = [
    body('message_text')
        .trim()
        .notEmpty().withMessage('Message text is required')
        .isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters'),
    
    validate,
];

// ============================================================
// FEEDBACK VALIDATIONS
// ============================================================

const validateFeedback = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    
    body('comments')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Comments must be max 500 characters'),
    
    validate,
];

// ============================================================
// CATEGORY VALIDATIONS
// ============================================================

const validateCategory = [
    body('category_name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be 3-100 characters'),
    
    body('description')
        .optional()
        .trim(),
    
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department must be max 100 characters'),
    
    validate,
];

// ============================================================
// USER MANAGEMENT VALIDATIONS
// ============================================================

const validateUserId = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid user ID'),
    
    validate,
];

const validateUserUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department must be max 100 characters'),
    
    body('contact')
        .optional()
        .trim()
        .matches(/^[0-9]{10,15}$/).withMessage('Contact must be 10-15 digits'),
    
    body('is_active')
        .optional()
        .isBoolean().withMessage('is_active must be boolean'),
    
    validate,
];

// ============================================================
// QUERY PARAMETER VALIDATIONS
// ============================================================

const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    
    validate,
];

const validateSearchFilters = [
    query('status')
        .optional()
        .isIn(['pending', 'in progress', 'resolved', 'closed', 'reopened'])
        .withMessage('Invalid status filter'),
    
    query('category')
        .optional()
        .isInt({ min: 1 }).withMessage('Invalid category filter'),
    
    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority filter'),
    
    query('search')
        .optional()
        .trim(),
    
    validate,
];

module.exports = {
    validate,
    validateRegistration,
    validateLogin,
    validateGrievance,
    validateGrievanceUpdate,
    validateGrievanceId,
    validateMessage,
    validateFeedback,
    validateCategory,
    validateUserId,
    validateUserUpdate,
    validatePagination,
    validateSearchFilters,
};

// ============================================================
// Student Controller
// Handles student-specific operations
// ============================================================

const { query } = require('../config/database');

/**
 * Get messages for a grievance
 * GET /api/student/grievances/:id/messages
 */
const getGrievanceMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: student_id } = req.user;

        // Verify student owns this grievance
        const grievanceCheck = await query(
            'SELECT * FROM grievances WHERE grievance_id = $1 AND student_id = $2',
            [id, student_id]
        );

        if (grievanceCheck.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        // Get messages
        const result = await query(
            `SELECT 
                m.*,
                CASE 
                    WHEN m.sender_type = 'student' THEN s.name
                    WHEN m.sender_type = 'faculty' THEN f.name
                    WHEN m.sender_type = 'admin' THEN a.name
                END as sender_name
            FROM messages m
            LEFT JOIN students s ON m.sender_type = 'student' AND m.sender_id = s.student_id
            LEFT JOIN faculty f ON m.sender_type = 'faculty' AND m.sender_id = f.faculty_id
            LEFT JOIN admins a ON m.sender_type = 'admin' AND m.sender_id = a.admin_id
            WHERE m.grievance_id = $1
            ORDER BY m.created_at ASC`,
            [id]
        );

        // Mark messages as read
        await query(
            `UPDATE messages SET is_read = TRUE 
             WHERE grievance_id = $1 AND sender_type IN ('faculty', 'admin')`,
            [id]
        );

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error in getGrievanceMessages:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Send message for a grievance
 * POST /api/student/grievances/:id/messages
 */
const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message_text } = req.body;
        const { id: student_id } = req.user;

        // Verify student owns this grievance
        const grievanceCheck = await query(
            'SELECT * FROM grievances WHERE grievance_id = $1 AND student_id = $2',
            [id, student_id]
        );

        if (grievanceCheck.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        // Insert message
        const result = await query(
            `INSERT INTO messages (grievance_id, sender_id, sender_type, message_text)
             VALUES ($1, $2, 'student', $3)
             RETURNING *`,
            [id, student_id, message_text]
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Submit feedback for a resolved grievance
 * POST /api/student/grievances/:id/feedback
 */
const submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comments } = req.body;
        const { id: student_id } = req.user;

        // Verify student owns this grievance and it's resolved
        const grievanceCheck = await query(
            `SELECT g.*, s.status_name 
             FROM grievances g
             JOIN status s ON g.status_id = s.status_id
             WHERE g.grievance_id = $1 AND g.student_id = $2`,
            [id, student_id]
        );

        if (grievanceCheck.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        const grievance = grievanceCheck.rows[0];

        if (grievance.status_name !== 'Resolved') {
            return res.status(400).json({
                success: false,
                message: 'Can only provide feedback for resolved grievances',
            });
        }

        // Check if feedback already exists
        const existingFeedback = await query(
            'SELECT * FROM feedback WHERE grievance_id = $1',
            [id]
        );

        if (existingFeedback.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Feedback already submitted for this grievance',
            });
        }

        // Insert feedback
        const result = await query(
            `INSERT INTO feedback (grievance_id, student_id, rating, comments)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id, student_id, rating, comments]
        );

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in submitFeedback:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get student notifications
 * GET /api/student/notifications
 */
const getNotifications = async (req, res) => {
    try {
        const { id: student_id } = req.user;
        const { limit = 20, unread_only = false } = req.query;

        let queryText = `
            SELECT * FROM notifications
            WHERE user_id = $1 AND user_type = 'student'
        `;

        if (unread_only === 'true') {
            queryText += ` AND is_read = FALSE`;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $2`;

        const result = await query(queryText, [student_id, limit]);

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Mark notification as read
 * PUT /api/student/notifications/:id/read
 */
const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: student_id } = req.user;

        await query(
            `UPDATE notifications SET is_read = TRUE 
             WHERE notification_id = $1 AND user_id = $2 AND user_type = 'student'`,
            [id, student_id]
        );

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        console.error('Error in markNotificationRead:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get all categories
 * GET /api/student/categories
 */
const getCategories = async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM categories WHERE is_active = TRUE ORDER BY category_name',
            []
        );

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get all status options
 * GET /api/student/status
 */
const getStatusOptions = async (req, res) => {
    try {
        const result = await query('SELECT * FROM status ORDER BY status_id', []);

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error in getStatusOptions:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = {
    getGrievanceMessages,
    sendMessage,
    submitFeedback,
    getNotifications,
    markNotificationRead,
    getCategories,
    getStatusOptions,
};

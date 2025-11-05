// ============================================================
// Faculty Controller
// Handles faculty-specific operations
// ============================================================

const { query } = require('../config/database');

/**
 * Get all grievances assigned to faculty
 * GET /api/faculty/grievances
 */
const getAssignedGrievances = async (req, res) => {
    try {
        const { id: faculty_id } = req.user;
        const { page = 1, limit = 10, status, priority, search } = req.query;

        const offset = (page - 1) * limit;

        // Build query
        let queryText = `
            SELECT 
                g.*,
                c.category_name,
                s.status_name,
                s.color_code,
                st.name AS student_name,
                st.email AS student_email,
                st.department AS student_department,
                st.enrollment_no,
                st.contact AS student_contact
            FROM grievances g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN status s ON g.status_id = s.status_id
            LEFT JOIN students st ON g.student_id = st.student_id
            WHERE g.assigned_to = $1
        `;

        const queryParams = [faculty_id];
        let paramCount = 2;

        if (status) {
            queryText += ` AND LOWER(s.status_name) = LOWER($${paramCount})`;
            queryParams.push(status);
            paramCount++;
        }

        if (priority) {
            queryText += ` AND g.priority = $${paramCount}`;
            queryParams.push(priority);
            paramCount++;
        }

        if (search) {
            queryText += ` AND (g.title ILIKE $${paramCount} OR g.description ILIKE $${paramCount})`;
            queryParams.push(`%${search}%`);
            paramCount++;
        }

        queryText += ` ORDER BY g.priority DESC, g.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        queryParams.push(limit, offset);

        const result = await query(queryText, queryParams);

        // Get total count
        let countQuery = `SELECT COUNT(*) FROM grievances g LEFT JOIN status s ON g.status_id = s.status_id WHERE g.assigned_to = $1`;
        const countParams = [faculty_id];
        let countIndex = 2;

        if (status) {
            countQuery += ` AND LOWER(s.status_name) = LOWER($${countIndex})`;
            countParams.push(status);
            countIndex++;
        }
        if (priority) {
            countQuery += ` AND g.priority = $${countIndex}`;
            countParams.push(priority);
            countIndex++;
        }
        if (search) {
            countQuery += ` AND (g.title ILIKE $${countIndex} OR g.description ILIKE $${countIndex})`;
            countParams.push(`%${search}%`);
        }

        const countResult = await query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            data: {
                grievances: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error in getAssignedGrievances:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get faculty workload statistics
 * GET /api/faculty/stats
 */
const getFacultyStats = async (req, res) => {
    try {
        const { id: faculty_id } = req.user;

        const result = await query(
            `SELECT 
                COUNT(*) as total_assigned,
                COUNT(CASE WHEN s.status_name = 'Pending' THEN 1 END) as pending,
                COUNT(CASE WHEN s.status_name = 'In Progress' THEN 1 END) as in_progress,
                COUNT(CASE WHEN s.status_name = 'Resolved' THEN 1 END) as resolved,
                COUNT(CASE WHEN g.priority = 'high' THEN 1 END) as high_priority,
                AVG(CASE 
                    WHEN g.resolved_at IS NOT NULL THEN 
                        EXTRACT(EPOCH FROM (g.resolved_at - g.created_at))/86400 
                    ELSE NULL 
                END) as avg_resolution_days
            FROM grievances g
            LEFT JOIN status s ON g.status_id = s.status_id
            WHERE g.assigned_to = $1`,
            [faculty_id]
        );

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in getFacultyStats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get messages for a grievance
 * GET /api/faculty/grievances/:id/messages
 */
const getGrievanceMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: faculty_id } = req.user;

        // Verify faculty is assigned to this grievance
        const grievanceCheck = await query(
            'SELECT * FROM grievances WHERE grievance_id = $1 AND assigned_to = $2',
            [id, faculty_id]
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
             WHERE grievance_id = $1 AND sender_type = 'student'`,
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
 * POST /api/faculty/grievances/:id/messages
 */
const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message_text } = req.body;
        const { id: faculty_id } = req.user;

        // Verify faculty is assigned to this grievance
        const grievanceCheck = await query(
            'SELECT * FROM grievances WHERE grievance_id = $1 AND assigned_to = $2',
            [id, faculty_id]
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
             VALUES ($1, $2, 'faculty', $3)
             RETURNING *`,
            [id, faculty_id, message_text]
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
 * Get faculty notifications
 * GET /api/faculty/notifications
 */
const getNotifications = async (req, res) => {
    try {
        const { id: faculty_id } = req.user;
        const { limit = 20, unread_only = false } = req.query;

        let queryText = `
            SELECT * FROM notifications
            WHERE user_id = $1 AND user_type = 'faculty'
        `;

        if (unread_only === 'true') {
            queryText += ` AND is_read = FALSE`;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $2`;

        const result = await query(queryText, [faculty_id, limit]);

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
 * PUT /api/faculty/notifications/:id/read
 */
const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: faculty_id } = req.user;

        await query(
            `UPDATE notifications SET is_read = TRUE 
             WHERE notification_id = $1 AND user_id = $2 AND user_type = 'faculty'`,
            [id, faculty_id]
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

module.exports = {
    getAssignedGrievances,
    getFacultyStats,
    getGrievanceMessages,
    sendMessage,
    getNotifications,
    markNotificationRead,
};

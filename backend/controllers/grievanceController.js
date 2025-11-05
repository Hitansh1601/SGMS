// ============================================================
// Grievance Controller
// Handles all grievance-related operations
// ============================================================

const { query } = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

/**
 * Create a new grievance
 * POST /api/grievances
 */
const createGrievance = async (req, res) => {
    try {
        const { id: student_id } = req.user;
        const { title, description, category_id, priority } = req.body;

        // Get file path if file was uploaded
        let attachment_path = null;
        if (req.file) {
            attachment_path = req.file.path;
        }

        // Get 'Pending' status ID
        const statusResult = await query(
            "SELECT status_id FROM status WHERE status_name = 'Pending'",
            []
        );

        if (statusResult.rows.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'System error: Pending status not found',
            });
        }

        const status_id = statusResult.rows[0].status_id;

        // Insert grievance
        const result = await query(
            `INSERT INTO grievances (student_id, category_id, status_id, title, description, attachment_path, priority)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [student_id, category_id, status_id, title, description, attachment_path, priority || 'medium']
        );

        const grievance = result.rows[0];

        res.status(201).json({
            success: true,
            message: 'Grievance submitted successfully',
            data: grievance,
        });
    } catch (error) {
        console.error('Error in createGrievance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get all grievances for student (own grievances)
 * GET /api/grievances/student
 */
const getStudentGrievances = async (req, res) => {
    try {
        const { id: student_id } = req.user;
        const { page = 1, limit = 10, status, category, priority, search } = req.query;

        const offset = (page - 1) * limit;

        // Build dynamic query
        let queryText = `
            SELECT 
                g.*,
                c.category_name,
                s.status_name,
                s.color_code,
                f.name AS assigned_faculty_name,
                f.email AS assigned_faculty_email
            FROM grievances g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN status s ON g.status_id = s.status_id
            LEFT JOIN faculty f ON g.assigned_to = f.faculty_id
            WHERE g.student_id = $1
        `;

        const queryParams = [student_id];
        let paramCount = 2;

        // Add filters
        if (status) {
            queryText += ` AND LOWER(s.status_name) = LOWER($${paramCount})`;
            queryParams.push(status);
            paramCount++;
        }

        if (category) {
            queryText += ` AND g.category_id = $${paramCount}`;
            queryParams.push(category);
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

        queryText += ` ORDER BY g.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        queryParams.push(limit, offset);

        const result = await query(queryText, queryParams);

        // Get total count
        let countQuery = `SELECT COUNT(*) FROM grievances g LEFT JOIN status s ON g.status_id = s.status_id WHERE g.student_id = $1`;
        const countParams = [student_id];
        let countParamIndex = 2;

        if (status) {
            countQuery += ` AND LOWER(s.status_name) = LOWER($${countParamIndex})`;
            countParams.push(status);
            countParamIndex++;
        }
        if (category) {
            countQuery += ` AND g.category_id = $${countParamIndex}`;
            countParams.push(category);
            countParamIndex++;
        }
        if (priority) {
            countQuery += ` AND g.priority = $${countParamIndex}`;
            countParams.push(priority);
            countParamIndex++;
        }
        if (search) {
            countQuery += ` AND (g.title ILIKE $${countParamIndex} OR g.description ILIKE $${countParamIndex})`;
            countParams.push(`%${search}%`);
        }

        const countResult = await query(countQuery, countParams);
        const totalGrievances = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            data: {
                grievances: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalGrievances,
                    pages: Math.ceil(totalGrievances / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error in getStudentGrievances:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get single grievance details
 * GET /api/grievances/:id
 */
const getGrievanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        // Get grievance with all details
        const result = await query(
            `SELECT 
                g.*,
                c.category_name,
                c.department AS category_department,
                s.status_name,
                s.color_code,
                st.name AS student_name,
                st.email AS student_email,
                st.department AS student_department,
                st.enrollment_no,
                f.name AS assigned_faculty_name,
                f.email AS assigned_faculty_email,
                f.designation AS assigned_faculty_designation
            FROM grievances g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN status s ON g.status_id = s.status_id
            LEFT JOIN students st ON g.student_id = st.student_id
            LEFT JOIN faculty f ON g.assigned_to = f.faculty_id
            WHERE g.grievance_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Grievance not found',
            });
        }

        const grievance = result.rows[0];

        // Authorization check
        if (role === 'student' && grievance.student_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        if (role === 'faculty' && grievance.assigned_to !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        res.status(200).json({
            success: true,
            data: grievance,
        });
    } catch (error) {
        console.error('Error in getGrievanceById:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Update grievance status and resolution notes (Faculty/Admin)
 * PUT /api/grievances/:id
 */
const updateGrievance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_id, resolution_notes, priority } = req.body;
        const { role } = req.user;

        // Build update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (status_id) {
            updates.push(`status_id = $${paramCount++}`);
            values.push(status_id);
        }

        if (resolution_notes !== undefined) {
            updates.push(`resolution_notes = $${paramCount++}`);
            values.push(resolution_notes);
        }

        if (priority) {
            updates.push(`priority = $${paramCount++}`);
            values.push(priority);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update',
            });
        }

        values.push(id);

        const result = await query(
            `UPDATE grievances SET ${updates.join(', ')} WHERE grievance_id = $${paramCount} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Grievance not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Grievance updated successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in updateGrievance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Delete grievance (Admin only)
 * DELETE /api/grievances/:id
 */
const deleteGrievance = async (req, res) => {
    try {
        const { id } = req.params;

        // Get grievance to delete attachment file
        const grievanceResult = await query(
            'SELECT attachment_path FROM grievances WHERE grievance_id = $1',
            [id]
        );

        if (grievanceResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Grievance not found',
            });
        }

        const attachment_path = grievanceResult.rows[0].attachment_path;

        // Delete file if exists
        if (attachment_path) {
            try {
                await fs.unlink(attachment_path);
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }

        // Delete grievance
        await query('DELETE FROM grievances WHERE grievance_id = $1', [id]);

        res.status(200).json({
            success: true,
            message: 'Grievance deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteGrievance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get grievance statistics for student
 * GET /api/grievances/stats/student
 */
const getStudentStats = async (req, res) => {
    try {
        const { id: student_id } = req.user;

        const result = await query(
            `SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN s.status_name = 'Pending' THEN 1 END) as pending,
                COUNT(CASE WHEN s.status_name = 'In Progress' THEN 1 END) as in_progress,
                COUNT(CASE WHEN s.status_name = 'Resolved' THEN 1 END) as resolved,
                COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
                COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
                COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority
            FROM grievances g
            LEFT JOIN status s ON g.status_id = s.status_id
            WHERE g.student_id = $1`,
            [student_id]
        );

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in getStudentStats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = {
    createGrievance,
    getStudentGrievances,
    getGrievanceById,
    updateGrievance,
    deleteGrievance,
    getStudentStats,
};

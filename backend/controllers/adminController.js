// ============================================================
// Admin Controller
// Handles admin-specific operations
// ============================================================

const bcrypt = require('bcrypt');
const { query } = require('../config/database');

const SALT_ROUNDS = 10;

// ============================================================
// USER MANAGEMENT
// ============================================================

/**
 * Get all students
 * GET /api/admin/students
 */
const getAllStudents = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, department, is_active } = req.query;
        const offset = (page - 1) * limit;

        let queryText = 'SELECT student_id, name, email, department, contact, enrollment_no, is_active, created_at FROM students WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (search) {
            queryText += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR enrollment_no ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        if (department) {
            queryText += ` AND department = $${paramCount}`;
            params.push(department);
            paramCount++;
        }

        if (is_active !== undefined) {
            queryText += ` AND is_active = $${paramCount}`;
            params.push(is_active === 'true');
            paramCount++;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM students WHERE 1=1';
        const countParams = [];
        let countIndex = 1;

        if (search) {
            countQuery += ` AND (name ILIKE $${countIndex} OR email ILIKE $${countIndex} OR enrollment_no ILIKE $${countIndex})`;
            countParams.push(`%${search}%`);
            countIndex++;
        }
        if (department) {
            countQuery += ` AND department = $${countIndex}`;
            countParams.push(department);
            countIndex++;
        }
        if (is_active !== undefined) {
            countQuery += ` AND is_active = $${countIndex}`;
            countParams.push(is_active === 'true');
        }

        const countResult = await query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            data: {
                students: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get all faculty
 * GET /api/admin/faculty
 */
const getAllFaculty = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, department, is_active } = req.query;
        const offset = (page - 1) * limit;

        let queryText = 'SELECT faculty_id, name, email, department, contact, designation, employee_id, is_active, created_at FROM faculty WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (search) {
            queryText += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR employee_id ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        if (department) {
            queryText += ` AND department = $${paramCount}`;
            params.push(department);
            paramCount++;
        }

        if (is_active !== undefined) {
            queryText += ` AND is_active = $${paramCount}`;
            params.push(is_active === 'true');
            paramCount++;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM faculty WHERE 1=1';
        const countParams = [];
        let countIndex = 1;

        if (search) {
            countQuery += ` AND (name ILIKE $${countIndex} OR email ILIKE $${countIndex} OR employee_id ILIKE $${countIndex})`;
            countParams.push(`%${search}%`);
            countIndex++;
        }
        if (department) {
            countQuery += ` AND department = $${countIndex}`;
            countParams.push(department);
            countIndex++;
        }
        if (is_active !== undefined) {
            countQuery += ` AND is_active = $${countIndex}`;
            countParams.push(is_active === 'true');
        }

        const countResult = await query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            data: {
                faculty: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error in getAllFaculty:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Add new student
 * POST /api/admin/students
 */
const addStudent = async (req, res) => {
    try {
        const { name, email, password, department, contact, enrollment_no } = req.body;

        // Check if student already exists
        const existing = await query(
            'SELECT * FROM students WHERE email = $1 OR enrollment_no = $2',
            [email, enrollment_no]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email or enrollment number already exists',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert student
        const result = await query(
            `INSERT INTO students (name, email, password, department, contact, enrollment_no)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING student_id, name, email, department, contact, enrollment_no, is_active, created_at`,
            [name, email, hashedPassword, department, contact, enrollment_no]
        );

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in addStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Add new faculty
 * POST /api/admin/faculty
 */
const addFaculty = async (req, res) => {
    try {
        const { name, email, password, department, contact, designation, employee_id } = req.body;

        // Check if faculty already exists
        const existing = await query(
            'SELECT * FROM faculty WHERE email = $1 OR employee_id = $2',
            [email, employee_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Faculty with this email or employee ID already exists',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert faculty
        const result = await query(
            `INSERT INTO faculty (name, email, password, department, contact, designation, employee_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING faculty_id, name, email, department, contact, designation, employee_id, is_active, created_at`,
            [name, email, hashedPassword, department, contact, designation, employee_id]
        );

        res.status(201).json({
            success: true,
            message: 'Faculty added successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in addFaculty:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Update student status (activate/deactivate)
 * PUT /api/admin/students/:id
 */
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, name, department, contact } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (is_active !== undefined) {
            updates.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }
        if (name) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (department) {
            updates.push(`department = $${paramCount++}`);
            values.push(department);
        }
        if (contact) {
            updates.push(`contact = $${paramCount++}`);
            values.push(contact);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update',
            });
        }

        values.push(id);

        const result = await query(
            `UPDATE students SET ${updates.join(', ')} WHERE student_id = $${paramCount}
             RETURNING student_id, name, email, department, contact, enrollment_no, is_active`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in updateStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Update faculty status (activate/deactivate)
 * PUT /api/admin/faculty/:id
 */
const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, name, department, contact, designation } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (is_active !== undefined) {
            updates.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }
        if (name) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (department) {
            updates.push(`department = $${paramCount++}`);
            values.push(department);
        }
        if (contact) {
            updates.push(`contact = $${paramCount++}`);
            values.push(contact);
        }
        if (designation) {
            updates.push(`designation = $${paramCount++}`);
            values.push(designation);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update',
            });
        }

        values.push(id);

        const result = await query(
            `UPDATE faculty SET ${updates.join(', ')} WHERE faculty_id = $${paramCount}
             RETURNING faculty_id, name, email, department, contact, designation, employee_id, is_active`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Faculty updated successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in updateFaculty:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// ============================================================
// GRIEVANCE MANAGEMENT
// ============================================================

/**
 * Get all grievances
 * GET /api/admin/grievances
 */
const getAllGrievances = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, category, priority, search, department } = req.query;
        const offset = (page - 1) * limit;

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
                f.name AS assigned_faculty_name,
                f.email AS assigned_faculty_email
            FROM grievances g
            LEFT JOIN categories c ON g.category_id = c.category_id
            LEFT JOIN status s ON g.status_id = s.status_id
            LEFT JOIN students st ON g.student_id = st.student_id
            LEFT JOIN faculty f ON g.assigned_to = f.faculty_id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (status) {
            queryText += ` AND LOWER(s.status_name) = LOWER($${paramCount})`;
            params.push(status);
            paramCount++;
        }

        if (category) {
            queryText += ` AND g.category_id = $${paramCount}`;
            params.push(category);
            paramCount++;
        }

        if (priority) {
            queryText += ` AND g.priority = $${paramCount}`;
            params.push(priority);
            paramCount++;
        }

        if (department) {
            queryText += ` AND st.department = $${paramCount}`;
            params.push(department);
            paramCount++;
        }

        if (search) {
            queryText += ` AND (g.title ILIKE $${paramCount} OR g.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        queryText += ` ORDER BY g.priority DESC, g.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) FROM grievances g 
                         LEFT JOIN status s ON g.status_id = s.status_id 
                         LEFT JOIN students st ON g.student_id = st.student_id
                         WHERE 1=1`;
        const countParams = [];
        let countIndex = 1;

        if (status) {
            countQuery += ` AND LOWER(s.status_name) = LOWER($${countIndex})`;
            countParams.push(status);
            countIndex++;
        }
        if (category) {
            countQuery += ` AND g.category_id = $${countIndex}`;
            countParams.push(category);
            countIndex++;
        }
        if (priority) {
            countQuery += ` AND g.priority = $${countIndex}`;
            countParams.push(priority);
            countIndex++;
        }
        if (department) {
            countQuery += ` AND st.department = $${countIndex}`;
            countParams.push(department);
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
        console.error('Error in getAllGrievances:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Assign grievance to faculty
 * PUT /api/admin/grievances/:id/assign
 */
const assignGrievance = async (req, res) => {
    try {
        const { id } = req.params;
        const { faculty_id } = req.body;

        // Verify faculty exists
        const facultyCheck = await query(
            'SELECT * FROM faculty WHERE faculty_id = $1 AND is_active = TRUE',
            [faculty_id]
        );

        if (facultyCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found or inactive',
            });
        }

        // Get 'In Progress' status ID
        const statusResult = await query(
            "SELECT status_id FROM status WHERE status_name = 'In Progress'",
            []
        );

        const status_id = statusResult.rows[0]?.status_id;

        // Update grievance
        const result = await query(
            `UPDATE grievances 
             SET assigned_to = $1, status_id = $2
             WHERE grievance_id = $3
             RETURNING *`,
            [faculty_id, status_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Grievance not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Grievance assigned successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in assignGrievance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// ============================================================
// CATEGORY MANAGEMENT
// ============================================================

/**
 * Get all categories
 * GET /api/admin/categories
 */
const getAllCategories = async (req, res) => {
    try {
        const result = await query('SELECT * FROM categories ORDER BY category_name', []);

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Add new category
 * POST /api/admin/categories
 */
const addCategory = async (req, res) => {
    try {
        const { category_name, description, department } = req.body;

        // Check if category already exists
        const existing = await query(
            'SELECT * FROM categories WHERE category_name = $1',
            [category_name]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists',
            });
        }

        // Insert category
        const result = await query(
            `INSERT INTO categories (category_name, description, department)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [category_name, description, department]
        );

        res.status(201).json({
            success: true,
            message: 'Category added successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in addCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Update category
 * PUT /api/admin/categories/:id
 */
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, description, department, is_active } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (category_name) {
            updates.push(`category_name = $${paramCount++}`);
            values.push(category_name);
        }
        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if (department) {
            updates.push(`department = $${paramCount++}`);
            values.push(department);
        }
        if (is_active !== undefined) {
            updates.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update',
            });
        }

        values.push(id);

        const result = await query(
            `UPDATE categories SET ${updates.join(', ')} WHERE category_id = $${paramCount} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// ============================================================
// DASHBOARD & STATISTICS
// ============================================================

/**
 * Get dashboard statistics
 * GET /api/admin/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        // Total counts
        const totalStats = await query(`
            SELECT 
                (SELECT COUNT(*) FROM students WHERE is_active = TRUE) as total_students,
                (SELECT COUNT(*) FROM faculty WHERE is_active = TRUE) as total_faculty,
                (SELECT COUNT(*) FROM grievances) as total_grievances,
                (SELECT COUNT(*) FROM grievances g JOIN status s ON g.status_id = s.status_id WHERE s.status_name = 'Pending') as pending_grievances,
                (SELECT COUNT(*) FROM grievances g JOIN status s ON g.status_id = s.status_id WHERE s.status_name = 'In Progress') as in_progress_grievances,
                (SELECT COUNT(*) FROM grievances g JOIN status s ON g.status_id = s.status_id WHERE s.status_name = 'Resolved') as resolved_grievances
        `);

        // Grievances by status
        const statusStats = await query(`
            SELECT s.status_name, s.color_code, COUNT(g.grievance_id) as count
            FROM status s
            LEFT JOIN grievances g ON s.status_id = g.status_id
            GROUP BY s.status_id, s.status_name, s.color_code
            ORDER BY s.status_id
        `);

        // Grievances by category
        const categoryStats = await query(`
            SELECT c.category_name, COUNT(g.grievance_id) as count
            FROM categories c
            LEFT JOIN grievances g ON c.category_id = g.category_id
            WHERE c.is_active = TRUE
            GROUP BY c.category_id, c.category_name
            ORDER BY count DESC
            LIMIT 10
        `);

        // Monthly statistics
        const monthlyStats = await query(`
            SELECT * FROM monthly_statistics
            ORDER BY month DESC
            LIMIT 6
        `);

        // Priority distribution
        const priorityStats = await query(`
            SELECT priority, COUNT(*) as count
            FROM grievances
            GROUP BY priority
        `);

        // Recent grievances
        const recentGrievances = await query(`
            SELECT 
                g.grievance_id,
                g.title,
                g.priority,
                s.status_name,
                s.color_code,
                st.name as student_name,
                g.created_at
            FROM grievances g
            JOIN status s ON g.status_id = s.status_id
            JOIN students st ON g.student_id = st.student_id
            ORDER BY g.created_at DESC
            LIMIT 5
        `);

        res.status(200).json({
            success: true,
            data: {
                totals: totalStats.rows[0],
                byStatus: statusStats.rows,
                byCategory: categoryStats.rows,
                monthly: monthlyStats.rows,
                byPriority: priorityStats.rows,
                recentGrievances: recentGrievances.rows,
            },
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Get faculty workload
 * GET /api/admin/faculty/workload
 */
const getFacultyWorkload = async (req, res) => {
    try {
        const result = await query('SELECT * FROM faculty_workload ORDER BY total_assigned DESC');

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error('Error in getFacultyWorkload:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = {
    // User management
    getAllStudents,
    getAllFaculty,
    addStudent,
    addFaculty,
    updateStudent,
    updateFaculty,
    
    // Grievance management
    getAllGrievances,
    assignGrievance,
    
    // Category management
    getAllCategories,
    addCategory,
    updateCategory,
    
    // Statistics
    getDashboardStats,
    getFacultyWorkload,
};

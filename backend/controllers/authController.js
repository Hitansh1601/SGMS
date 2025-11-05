// ============================================================
// Authentication Controller
// Handles user registration, login, and authentication
// ============================================================

const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { generateToken } = require('../config/jwt');

// Salt rounds for bcrypt password hashing
const SALT_ROUNDS = 10;

/**
 * Register a new student
 * POST /api/auth/register/student
 */
const registerStudent = async (req, res) => {
    try {
        const { name, email, password, department, contact, enrollment_no } = req.body;

        // Check if student already exists
        const existingStudent = await query(
            'SELECT * FROM students WHERE email = $1 OR enrollment_no = $2',
            [email, enrollment_no]
        );

        if (existingStudent.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email or enrollment number already exists',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert new student
        const result = await query(
            `INSERT INTO students (name, email, password, department, contact, enrollment_no)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING student_id, name, email, department, contact, enrollment_no, created_at`,
            [name, email, hashedPassword, department, contact, enrollment_no]
        );

        const student = result.rows[0];

        // Generate JWT token
        const token = generateToken({
            id: student.student_id,
            email: student.email,
            role: 'student',
            name: student.name,
        });

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: {
                user: {
                    id: student.student_id,
                    name: student.name,
                    email: student.email,
                    department: student.department,
                    enrollment_no: student.enrollment_no,
                    role: 'student',
                },
                token,
            },
        });
    } catch (error) {
        console.error('Error in registerStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message,
        });
    }
};

/**
 * Login user (student, faculty, or admin)
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let table, idField;
        
        // Determine which table to query based on role
        switch (role) {
            case 'student':
                table = 'students';
                idField = 'student_id';
                break;
            case 'faculty':
                table = 'faculty';
                idField = 'faculty_id';
                break;
            case 'admin':
                table = 'admins';
                idField = 'admin_id';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role',
                });
        }

        // Find user by email
        const result = await query(
            `SELECT * FROM ${table} WHERE email = $1 AND is_active = TRUE`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const user = result.rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: user[idField],
            email: user.email,
            role: role,
            name: user.name,
        });

        // Remove password from user object
        delete user.password;
        user.id = user[idField];
        user.role = role;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message,
        });
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getProfile = async (req, res) => {
    try {
        const { id, role } = req.user;

        let table, idField;
        
        switch (role) {
            case 'student':
                table = 'students';
                idField = 'student_id';
                break;
            case 'faculty':
                table = 'faculty';
                idField = 'faculty_id';
                break;
            case 'admin':
                table = 'admins';
                idField = 'admin_id';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role',
                });
        }

        // Get user details
        const result = await query(
            `SELECT * FROM ${table} WHERE ${idField} = $1 AND is_active = TRUE`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const user = result.rows[0];
        delete user.password;
        user.id = user[idField];
        user.role = role;

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { name, department, contact } = req.body;

        let table, idField;
        
        switch (role) {
            case 'student':
                table = 'students';
                idField = 'student_id';
                break;
            case 'faculty':
                table = 'faculty';
                idField = 'faculty_id';
                break;
            case 'admin':
                table = 'admins';
                idField = 'admin_id';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role',
                });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];
        let paramCount = 1;

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
            `UPDATE ${table} SET ${updates.join(', ')} WHERE ${idField} = $${paramCount} RETURNING *`,
            values
        );

        const user = result.rows[0];
        delete user.password;
        user.id = user[idField];
        user.role = role;

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required',
            });
        }

        let table, idField;
        
        switch (role) {
            case 'student':
                table = 'students';
                idField = 'student_id';
                break;
            case 'faculty':
                table = 'faculty';
                idField = 'faculty_id';
                break;
            case 'admin':
                table = 'admins';
                idField = 'admin_id';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role',
                });
        }

        // Get current user
        const userResult = await query(
            `SELECT password FROM ${table} WHERE ${idField} = $1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const user = userResult.rows[0];

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update password
        await query(
            `UPDATE ${table} SET password = $1 WHERE ${idField} = $2`,
            [hashedPassword, id]
        );

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Error in changePassword:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = {
    registerStudent,
    login,
    getProfile,
    updateProfile,
    changePassword,
};

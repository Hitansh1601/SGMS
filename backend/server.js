// ============================================================
// STUDENT GRIEVANCE MANAGEMENT SYSTEM (SGMS)
// Main Server File
// ============================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import database config to test connection
const { pool } = require('./config/database');

// Initialize Express app
const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// ROUTES
// ============================================================

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SGMS API is running',
        timestamp: new Date().toISOString(),
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Student Grievance Management System API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            grievances: '/api/grievances',
            student: '/api/student',
            faculty: '/api/faculty',
            admin: '/api/admin',
            health: '/api/health',
        },
    });
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB',
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message,
        });
    }

    // Database errors
    if (err.code && err.code.startsWith('23')) {
        return res.status(400).json({
            success: false,
            message: 'Database constraint violation',
            error: err.message,
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        console.error('Please ensure PostgreSQL is running and database is created');
        process.exit(1);
    }

    console.log('✅ Database connection successful');
    
    // Start server
    app.listen(PORT, () => {
        console.log('');
        console.log('='.repeat(50));
        console.log('  STUDENT GRIEVANCE MANAGEMENT SYSTEM (SGMS)');
        console.log('='.repeat(50));
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Local URL: http://localhost:${PORT}`);
        console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📊 Database: ${process.env.DB_NAME || 'sgms_db'}`);
        console.log('='.repeat(50));
        console.log('');
        console.log('API Endpoints:');
        console.log(`  - Auth:       http://localhost:${PORT}/api/auth`);
        console.log(`  - Grievances: http://localhost:${PORT}/api/grievances`);
        console.log(`  - Student:    http://localhost:${PORT}/api/student`);
        console.log(`  - Faculty:    http://localhost:${PORT}/api/faculty`);
        console.log(`  - Admin:      http://localhost:${PORT}/api/admin`);
        console.log(`  - Health:     http://localhost:${PORT}/api/health`);
        console.log('='.repeat(50));
        console.log('');
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Closing server gracefully...');
    pool.end(() => {
        console.log('✅ Database connections closed');
        process.exit(0);
    });
});

module.exports = app;

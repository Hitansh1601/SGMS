-- ============================================================
-- STUDENT GRIEVANCE MANAGEMENT SYSTEM (SGMS)
-- Database Schema for PostgreSQL
-- ============================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS grievances CASCADE;
DROP TABLE IF EXISTS status CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Drop existing views if they exist
DROP VIEW IF EXISTS grievance_summary CASCADE;
DROP VIEW IF EXISTS faculty_workload CASCADE;
DROP VIEW IF EXISTS monthly_statistics CASCADE;

-- ============================================================
-- TABLE: students
-- Stores student information and credentials
-- ============================================================
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hashed
    department VARCHAR(100),
    contact VARCHAR(15),
    enrollment_no VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups during authentication
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_enrollment ON students(enrollment_no);

-- ============================================================
-- TABLE: faculty
-- Stores faculty information and credentials
-- ============================================================
CREATE TABLE faculty (
    faculty_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hashed
    department VARCHAR(100),
    contact VARCHAR(15),
    designation VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups during authentication
CREATE INDEX idx_faculty_email ON faculty(email);
CREATE INDEX idx_faculty_employee ON faculty(employee_id);

-- ============================================================
-- TABLE: admins
-- Stores administrator information and credentials
-- ============================================================
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hashed
    contact VARCHAR(15),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups during authentication
CREATE INDEX idx_admins_email ON admins(email);

-- ============================================================
-- TABLE: categories
-- Stores grievance categories
-- ============================================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for active categories
CREATE INDEX idx_categories_active ON categories(is_active);

-- ============================================================
-- TABLE: status
-- Stores possible grievance statuses
-- ============================================================
CREATE TABLE status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color_code VARCHAR(7) -- Hex color for UI (e.g., #FF5733)
);

-- ============================================================
-- TABLE: grievances
-- Stores all grievances submitted by students
-- ============================================================
CREATE TABLE grievances (
    grievance_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    status_id INTEGER NOT NULL REFERENCES status(status_id) ON DELETE RESTRICT,
    assigned_to INTEGER REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    attachment_path VARCHAR(500),
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_grievances_student ON grievances(student_id);
CREATE INDEX idx_grievances_status ON grievances(status_id);
CREATE INDEX idx_grievances_category ON grievances(category_id);
CREATE INDEX idx_grievances_assigned ON grievances(assigned_to);
CREATE INDEX idx_grievances_created ON grievances(created_at DESC);
CREATE INDEX idx_grievances_priority ON grievances(priority);

-- ============================================================
-- TABLE: messages
-- Stores internal messages between students and faculty
-- ============================================================
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    grievance_id INTEGER NOT NULL REFERENCES grievances(grievance_id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('student', 'faculty', 'admin')),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster message retrieval
CREATE INDEX idx_messages_grievance ON messages(grievance_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- ============================================================
-- TABLE: notifications
-- Stores notifications for users
-- ============================================================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'faculty', 'admin')),
    grievance_id INTEGER REFERENCES grievances(grievance_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50), -- 'status_change', 'assignment', 'new_message', etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster notification retrieval
CREATE INDEX idx_notifications_user ON notifications(user_id, user_type);
CREATE INDEX idx_notifications_grievance ON notifications(grievance_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================
-- TABLE: feedback
-- Stores student feedback after grievance resolution
-- ============================================================
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    grievance_id INTEGER UNIQUE NOT NULL REFERENCES grievances(grievance_id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster feedback retrieval
CREATE INDEX idx_feedback_grievance ON feedback(grievance_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger to auto-update updated_at timestamp for students
CREATE OR REPLACE FUNCTION update_students_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_students_timestamp
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_students_timestamp();

-- Trigger to auto-update updated_at timestamp for faculty
CREATE OR REPLACE FUNCTION update_faculty_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_faculty_timestamp
BEFORE UPDATE ON faculty
FOR EACH ROW
EXECUTE FUNCTION update_faculty_timestamp();

-- Trigger to auto-update updated_at timestamp for admins
CREATE OR REPLACE FUNCTION update_admins_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admins_timestamp
BEFORE UPDATE ON admins
FOR EACH ROW
EXECUTE FUNCTION update_admins_timestamp();

-- Trigger to auto-update updated_at timestamp for grievances
CREATE OR REPLACE FUNCTION update_grievances_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    -- Auto-set resolved_at when status changes to 'Resolved'
    IF NEW.status_id = (SELECT status_id FROM status WHERE status_name = 'Resolved') 
       AND OLD.status_id != NEW.status_id THEN
        NEW.resolved_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_grievances_timestamp
BEFORE UPDATE ON grievances
FOR EACH ROW
EXECUTE FUNCTION update_grievances_timestamp();

-- Trigger to create notification when grievance status changes
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_id != OLD.status_id THEN
        INSERT INTO notifications (user_id, user_type, grievance_id, title, message, notification_type)
        VALUES (
            NEW.student_id,
            'student',
            NEW.grievance_id,
            'Grievance Status Updated',
            'Your grievance "' || NEW.title || '" status has been updated to ' || 
            (SELECT status_name FROM status WHERE status_id = NEW.status_id),
            'status_change'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_status_change
AFTER UPDATE ON grievances
FOR EACH ROW
EXECUTE FUNCTION notify_status_change();

-- Trigger to create notification when grievance is assigned to faculty
CREATE OR REPLACE FUNCTION notify_assignment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS NULL OR NEW.assigned_to != OLD.assigned_to) THEN
        -- Notify faculty
        INSERT INTO notifications (user_id, user_type, grievance_id, title, message, notification_type)
        VALUES (
            NEW.assigned_to,
            'faculty',
            NEW.grievance_id,
            'New Grievance Assigned',
            'A new grievance "' || NEW.title || '" has been assigned to you',
            'assignment'
        );
        
        -- Notify student
        INSERT INTO notifications (user_id, user_type, grievance_id, title, message, notification_type)
        VALUES (
            NEW.student_id,
            'student',
            NEW.grievance_id,
            'Grievance Assigned',
            'Your grievance "' || NEW.title || '" has been assigned to a faculty member',
            'assignment'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_assignment
AFTER UPDATE ON grievances
FOR EACH ROW
EXECUTE FUNCTION notify_assignment();

-- Trigger to create notification when new message is received
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
    student_id_var INTEGER;
    assigned_to_var INTEGER;
BEGIN
    SELECT student_id, assigned_to INTO student_id_var, assigned_to_var
    FROM grievances WHERE grievance_id = NEW.grievance_id;
    
    -- Notify the recipient (if sender is student, notify faculty and vice versa)
    IF NEW.sender_type = 'student' AND assigned_to_var IS NOT NULL THEN
        INSERT INTO notifications (user_id, user_type, grievance_id, title, message, notification_type)
        VALUES (
            assigned_to_var,
            'faculty',
            NEW.grievance_id,
            'New Message',
            'You have a new message regarding grievance #' || NEW.grievance_id,
            'new_message'
        );
    ELSIF NEW.sender_type = 'faculty' THEN
        INSERT INTO notifications (user_id, user_type, grievance_id, title, message, notification_type)
        VALUES (
            student_id_var,
            'student',
            NEW.grievance_id,
            'New Message',
            'You have a new message regarding your grievance #' || NEW.grievance_id,
            'new_message'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();

-- ============================================================
-- VIEWS FOR REPORTING
-- ============================================================

-- View: grievance_summary
-- Provides a comprehensive summary of grievances with all related information
CREATE VIEW grievance_summary AS
SELECT 
    g.grievance_id,
    g.title,
    g.description,
    g.priority,
    s.name AS student_name,
    s.email AS student_email,
    s.department AS student_department,
    s.enrollment_no,
    c.category_name,
    st.status_name,
    st.color_code AS status_color,
    f.name AS assigned_faculty_name,
    f.email AS assigned_faculty_email,
    g.created_at,
    g.updated_at,
    g.resolved_at,
    CASE 
        WHEN g.resolved_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (g.resolved_at - g.created_at))/86400 
        ELSE NULL 
    END AS resolution_time_days
FROM grievances g
JOIN students s ON g.student_id = s.student_id
LEFT JOIN categories c ON g.category_id = c.category_id
JOIN status st ON g.status_id = st.status_id
LEFT JOIN faculty f ON g.assigned_to = f.faculty_id;

-- View: faculty_workload
-- Shows workload statistics for each faculty member
CREATE VIEW faculty_workload AS
SELECT 
    f.faculty_id,
    f.name,
    f.email,
    f.department,
    COUNT(g.grievance_id) AS total_assigned,
    COUNT(CASE WHEN st.status_name = 'Pending' THEN 1 END) AS pending_count,
    COUNT(CASE WHEN st.status_name = 'In Progress' THEN 1 END) AS in_progress_count,
    COUNT(CASE WHEN st.status_name = 'Resolved' THEN 1 END) AS resolved_count,
    AVG(CASE 
        WHEN g.resolved_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (g.resolved_at - g.created_at))/86400 
        ELSE NULL 
    END) AS avg_resolution_time_days
FROM faculty f
LEFT JOIN grievances g ON f.faculty_id = g.assigned_to
LEFT JOIN status st ON g.status_id = st.status_id
WHERE f.is_active = TRUE
GROUP BY f.faculty_id, f.name, f.email, f.department;

-- View: monthly_statistics
-- Shows monthly grievance statistics
CREATE VIEW monthly_statistics AS
SELECT 
    TO_CHAR(g.created_at, 'YYYY-MM') AS month,
    COUNT(*) AS total_grievances,
    COUNT(CASE WHEN st.status_name = 'Pending' THEN 1 END) AS pending,
    COUNT(CASE WHEN st.status_name = 'In Progress' THEN 1 END) AS in_progress,
    COUNT(CASE WHEN st.status_name = 'Resolved' THEN 1 END) AS resolved,
    COUNT(CASE WHEN g.priority = 'high' THEN 1 END) AS high_priority,
    COUNT(CASE WHEN g.priority = 'medium' THEN 1 END) AS medium_priority,
    COUNT(CASE WHEN g.priority = 'low' THEN 1 END) AS low_priority,
    AVG(CASE 
        WHEN g.resolved_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (g.resolved_at - g.created_at))/86400 
        ELSE NULL 
    END) AS avg_resolution_time_days
FROM grievances g
JOIN status st ON g.status_id = st.status_id
GROUP BY TO_CHAR(g.created_at, 'YYYY-MM')
ORDER BY month DESC;

-- ============================================================
-- INSERT DEFAULT STATUS VALUES
-- ============================================================
INSERT INTO status (status_name, description, color_code) VALUES
('Pending', 'Grievance has been submitted and is awaiting assignment', '#FFA500'),
('In Progress', 'Grievance is being actively worked on', '#1E90FF'),
('Resolved', 'Grievance has been resolved', '#32CD32'),
('Closed', 'Grievance has been closed', '#808080'),
('Reopened', 'Grievance has been reopened after resolution', '#FF6347');

-- ============================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================

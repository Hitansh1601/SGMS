-- ============================================================
-- STUDENT GRIEVANCE MANAGEMENT SYSTEM (SGMS)
-- Sample Seed Data for PostgreSQL
-- ============================================================

-- Note: All passwords are hashed using bcrypt with 10 salt rounds
-- Default password for all users: Password@123
-- Hashed version: $2b$10$XqS3yZQGJvU7nD0.z7fF8uX.F7q5KzYgT0Kx4oFd8rN5H0X6xL5hG

-- ============================================================
-- INSERT SAMPLE CATEGORIES
-- ============================================================
INSERT INTO categories (category_name, description, department, is_active) VALUES
('Academic Issues', 'Issues related to courses, exams, assignments, grades', 'Academic', TRUE),
('Hostel Issues', 'Accommodation, room allocation, hostel facilities', 'Hostel Management', TRUE),
('Fee Related', 'Fee payment, refunds, scholarships, financial aid', 'Accounts', TRUE),
('Library Issues', 'Book availability, library timings, digital resources', 'Library', TRUE),
('Infrastructure', 'Building maintenance, classroom facilities, equipment', 'Infrastructure', TRUE),
('Transport', 'Bus services, routes, timings, safety', 'Transport', TRUE),
('Harassment/Discrimination', 'Bullying, discrimination, harassment complaints', 'Disciplinary Committee', TRUE),
('Administrative', 'Document requests, certificates, official processes', 'Administration', TRUE),
('Food/Canteen', 'Food quality, hygiene, canteen timings', 'Canteen Management', TRUE),
('Sports/Extra-curricular', 'Sports facilities, clubs, events, activities', 'Sports Department', TRUE),
('Medical', 'Health center, medical facilities, insurance', 'Medical Services', TRUE),
('IT/Technical', 'Wi-Fi, computer labs, software access, technical support', 'IT Department', TRUE);

-- ============================================================
-- INSERT SAMPLE ADMINS
-- Password: Admin@123 (hashed with bcrypt)
-- ============================================================
INSERT INTO admins (name, email, password, contact, role, is_active) VALUES
('Dr. Priya Mehta', 'admin@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', '9876543210', 'Super Admin', TRUE),
('Mr. Amit Verma', 'amit.verma@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', '9876543211', 'Admin', TRUE);

-- ============================================================
-- INSERT SAMPLE FACULTY
-- Password: Faculty@123 (hashed with bcrypt)
-- ============================================================
INSERT INTO faculty (name, email, password, department, contact, designation, employee_id, is_active) VALUES
('Dr. Rajesh Kumar', 'rajesh.kumar@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Computer Science', '9876543220', 'Professor', 'FAC001', TRUE),
('Dr. Sneha Patel', 'sneha.patel@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Electronics', '9876543221', 'Associate Professor', 'FAC002', TRUE),
('Prof. Arun Gupta', 'arun.gupta@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Mechanical', '9876543222', 'Assistant Professor', 'FAC003', TRUE),
('Dr. Kavita Sharma', 'kavita.sharma@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Civil', '9876543223', 'Professor', 'FAC004', TRUE),
('Prof. Ravi Nair', 'ravi.nair@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Electrical', '9876543224', 'Assistant Professor', 'FAC005', TRUE),
('Dr. Anita Desai', 'anita.desai@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Computer Science', '9876543225', 'Associate Professor', 'FAC006', TRUE);

-- ============================================================
-- INSERT SAMPLE STUDENTS
-- Password: Student@123 (hashed with bcrypt)
-- ============================================================
INSERT INTO students (name, email, password, department, contact, enrollment_no, is_active) VALUES
('Rahul Sharma', 'rahul.sharma@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Computer Science', '9876543230', 'CS2021001', TRUE),
('Priya Singh', 'priya.singh@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Electronics', '9876543231', 'EC2021002', TRUE),
('Amit Patel', 'amit.patel@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Mechanical', '9876543232', 'ME2021003', TRUE),
('Neha Gupta', 'neha.gupta@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Civil', '9876543233', 'CE2021004', TRUE),
('Vikram Reddy', 'vikram.reddy@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Electrical', '9876543234', 'EE2021005', TRUE),
('Anjali Mehta', 'anjali.mehta@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Computer Science', '9876543235', 'CS2021006', TRUE),
('Karthik Krishnan', 'karthik.krishnan@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Electronics', '9876543236', 'EC2021007', TRUE),
('Divya Nair', 'divya.nair@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Mechanical', '9876543237', 'ME2021008', TRUE),
('Rohan Iyer', 'rohan.iyer@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Civil', '9876543238', 'CE2021009', TRUE),
('Sneha Kapoor', 'sneha.kapoor@college.edu', '$2b$10$rGjIy0S2h.9O3xL5qT8AE.YXqF5KzYgT0Kx4oFd8rN5H0X6xL5hG', 'Electrical', '9876543239', 'EE2021010', TRUE);

-- ============================================================
-- INSERT SAMPLE GRIEVANCES
-- ============================================================

-- Grievance 1: Academic Issue (Resolved)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority, resolution_notes, resolved_at)
VALUES (
    1,
    (SELECT category_id FROM categories WHERE category_name = 'Academic Issues'),
    (SELECT status_id FROM status WHERE status_name = 'Resolved'),
    1,
    'Question paper error in Database exam',
    'There was a typographical error in Question 3 of the Database Management Systems mid-term exam held on October 15th. The question asked about "NROMAL FORMS" instead of "NORMAL FORMS". This caused confusion during the exam.',
    'high',
    'Verified the error. Grace marks of 5 have been awarded to all students who attempted this question. The error has been noted for future reference.',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
);

-- Grievance 2: Hostel Issue (In Progress)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority)
VALUES (
    2,
    (SELECT category_id FROM categories WHERE category_name = 'Hostel Issues'),
    (SELECT status_id FROM status WHERE status_name = 'In Progress'),
    2,
    'Wi-Fi connectivity issues in hostel room',
    'The Wi-Fi connection in Room 304, Block A is extremely slow and keeps disconnecting. This is affecting my online classes and assignment submissions. The issue has persisted for the last 10 days.',
    'medium'
);

-- Grievance 3: Library Issue (Pending)
INSERT INTO grievances (student_id, category_id, status_id, title, description, priority)
VALUES (
    3,
    (SELECT category_id FROM categories WHERE category_name = 'Library Issues'),
    (SELECT status_id FROM status WHERE status_name = 'Pending'),
    'Reference books not available',
    'The reference book "Engineering Mechanics" by R.K. Bansal is not available in the library. Multiple students from Mechanical Engineering need this book for our upcoming exams. Request to purchase additional copies.',
    'medium'
);

-- Grievance 4: Fee Related (Resolved)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority, resolution_notes, resolved_at)
VALUES (
    4,
    (SELECT category_id FROM categories WHERE category_name = 'Fee Related'),
    (SELECT status_id FROM status WHERE status_name = 'Resolved'),
    3,
    'Scholarship amount not credited',
    'My scholarship amount for the current semester was supposed to be credited by October 20th, but I have not received it yet. My scholarship ID is SCH2021789.',
    'high',
    'The delay was due to a processing error at the bank. The amount has been credited to your account on October 28th. Please check your bank statement.',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
);

-- Grievance 5: Infrastructure (In Progress)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority)
VALUES (
    5,
    (SELECT category_id FROM categories WHERE category_name = 'Infrastructure'),
    (SELECT status_id FROM status WHERE status_name = 'In Progress'),
    4,
    'Broken ceiling fan in Classroom 201',
    'The ceiling fan in Classroom 201 (Electrical Department) is not working. With the current weather, it becomes very uncomfortable during afternoon lectures.',
    'medium'
);

-- Grievance 6: Transport (Pending)
INSERT INTO grievances (student_id, category_id, status_id, title, description, priority)
VALUES (
    6,
    (SELECT category_id FROM categories WHERE category_name = 'Transport'),
    (SELECT status_id FROM status WHERE status_name = 'Pending'),
    'Request for additional morning bus',
    'The current morning bus from Sector 15 route is overcrowded. Many students are unable to board and arrive late to class. Request to add one more bus on this route or use a larger bus.',
    'high'
);

-- Grievance 7: Canteen (Resolved)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority, resolution_notes, resolved_at)
VALUES (
    7,
    (SELECT category_id FROM categories WHERE category_name = 'Food/Canteen'),
    (SELECT status_id FROM status WHERE status_name = 'Resolved'),
    2,
    'Food quality concern',
    'The quality of food served in the canteen on October 22nd was not up to the mark. The rice was undercooked and the dal was too watery. Several students complained of stomach issues.',
    'high',
    'The issue was investigated. The canteen contractor has been warned and additional quality checks have been implemented. A dietician will now inspect the food daily.',
    CURRENT_TIMESTAMP - INTERVAL '3 days'
);

-- Grievance 8: IT/Technical (In Progress)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority)
VALUES (
    8,
    (SELECT category_id FROM categories WHERE category_name = 'IT/Technical'),
    (SELECT status_id FROM status WHERE status_name = 'In Progress'),
    1,
    'Unable to access online portal',
    'I am unable to log in to the student portal (portal.college.edu). The page shows "Invalid credentials" even though I am using the correct password. I have tried resetting the password but the reset link is not working.',
    'high'
);

-- Grievance 9: Sports (Pending)
INSERT INTO grievances (student_id, category_id, status_id, title, description, priority)
VALUES (
    9,
    (SELECT category_id FROM categories WHERE category_name = 'Sports/Extra-curricular'),
    (SELECT status_id FROM status WHERE status_name = 'Pending'),
    'Basketball court maintenance required',
    'The basketball court surface has developed cracks and uneven patches. This is causing a safety hazard during practice sessions. Request urgent maintenance.',
    'medium'
);

-- Grievance 10: Medical (In Progress)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority)
VALUES (
    10,
    (SELECT category_id FROM categories WHERE category_name = 'Medical'),
    (SELECT status_id FROM status WHERE status_name = 'In Progress'),
    5,
    'Medical center operating hours',
    'The medical center closes at 5 PM on weekdays. Students attending evening classes (6-8 PM) have no access to medical facilities in case of emergencies. Request to extend operating hours.',
    'medium'
);

-- Grievance 11: Administrative (Pending)
INSERT INTO grievances (student_id, category_id, status_id, title, description, priority)
VALUES (
    1,
    (SELECT category_id FROM categories WHERE category_name = 'Administrative'),
    (SELECT status_id FROM status WHERE status_name = 'Pending'),
    'Delay in issuing bonafide certificate',
    'I applied for a bonafide certificate on October 10th for a bank loan application. It has been 15 days and I have not received it yet. My loan application deadline is November 5th.',
    'high'
);

-- Grievance 12: Academic (Resolved)
INSERT INTO grievances (student_id, category_id, status_id, assigned_to, title, description, priority, resolution_notes, resolved_at)
VALUES (
    2,
    (SELECT category_id FROM categories WHERE category_name = 'Academic Issues'),
    (SELECT status_id FROM status WHERE status_name = 'Resolved'),
    6,
    'Lab equipment malfunction',
    'The oscilloscope (Model: DSO-2000) in Electronics Lab is not functioning properly. The display is flickering and measurements are inaccurate. This is affecting our practical experiments.',
    'high',
    'The oscilloscope has been repaired. It was a calibration issue. The equipment is now working properly and has been tested.',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);

-- ============================================================
-- INSERT SAMPLE MESSAGES
-- ============================================================

-- Messages for Grievance 1 (Resolved)
INSERT INTO messages (grievance_id, sender_id, sender_type, message_text, is_read, created_at)
VALUES 
(1, 1, 'student', 'I have attached a photo of the question paper showing the error.', TRUE, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(1, 1, 'faculty', 'Thank you for bringing this to our attention. We are reviewing the question paper.', TRUE, CURRENT_TIMESTAMP - INTERVAL '9 days'),
(1, 1, 'student', 'Has any decision been made regarding this?', TRUE, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(1, 1, 'faculty', 'Yes, we have decided to award grace marks. The marks will be updated in the system by tomorrow.', TRUE, CURRENT_TIMESTAMP - INTERVAL '6 days');

-- Messages for Grievance 2 (In Progress)
INSERT INTO messages (grievance_id, sender_id, sender_type, message_text, is_read, created_at)
VALUES 
(2, 2, 'student', 'The issue is still persisting. Can someone please check the router in our block?', TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 2, 'faculty', 'We have informed the IT department. A technician will visit your hostel tomorrow.', TRUE, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(2, 2, 'student', 'The technician visited but the issue is only partially resolved. Speed is still slow.', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Messages for Grievance 4 (Resolved)
INSERT INTO messages (grievance_id, sender_id, sender_type, message_text, is_read, created_at)
VALUES 
(4, 4, 'student', 'This is urgent as I need to pay my hostel fees. Please expedite.', TRUE, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(4, 3, 'faculty', 'I am checking with the accounts department. Will update you soon.', TRUE, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(4, 3, 'faculty', 'The amount has been processed. Please check your account in 24 hours.', TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days');

-- Messages for Grievance 7 (Resolved)
INSERT INTO messages (grievance_id, sender_id, sender_type, message_text, is_read, created_at)
VALUES 
(7, 7, 'student', 'Multiple students have reported this issue. Please take immediate action.', TRUE, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(7, 2, 'faculty', 'We are conducting an inspection of the canteen facilities today.', TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(7, 7, 'student', 'Thank you for the quick response. Hope the quality improves.', TRUE, CURRENT_TIMESTAMP - INTERVAL '4 days');

-- Messages for Grievance 8 (In Progress)
INSERT INTO messages (grievance_id, sender_id, sender_type, message_text, is_read, created_at)
VALUES 
(8, 8, 'student', 'I urgently need to download my fee receipt for visa application.', TRUE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(8, 1, 'faculty', 'We are resetting your portal credentials. Please check your email for new login details.', TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(8, 8, 'student', 'I received the email but the new password is also not working.', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- ============================================================
-- INSERT SAMPLE FEEDBACK
-- ============================================================

-- Feedback for resolved grievances
INSERT INTO feedback (grievance_id, student_id, rating, comments, created_at)
VALUES 
(1, 1, 5, 'Very satisfied with the resolution. The faculty handled the issue professionally and promptly.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(4, 4, 4, 'Good resolution but it took a bit longer than expected. Overall satisfied.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(7, 7, 5, 'Excellent response time. The issue was investigated thoroughly and resolved quickly.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(12, 2, 5, 'Perfect! The equipment is working fine now. Thank you for the quick repair.', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- ============================================================
-- INSERT SAMPLE NOTIFICATIONS (Auto-created by triggers)
-- Note: Triggers will create these automatically, but including some manual ones for completeness
-- ============================================================

INSERT INTO notifications (user_id, user_type, grievance_id, title, message, notification_type, is_read, created_at)
VALUES 
(1, 'student', 3, 'Reminder', 'Your grievance regarding "Reference books not available" is still pending. We are working on it.', 'reminder', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(6, 'student', 6, 'Reminder', 'Your grievance regarding "Request for additional morning bus" requires additional information.', 'reminder', FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(9, 'student', 9, 'Update', 'Your grievance "Basketball court maintenance required" will be reviewed by the sports committee this week.', 'update', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- ============================================================
-- VERIFICATION QUERIES (Optional - for testing)
-- ============================================================

-- Uncomment to verify data insertion

-- SELECT COUNT(*) AS total_students FROM students;
-- SELECT COUNT(*) AS total_faculty FROM faculty;
-- SELECT COUNT(*) AS total_admins FROM admins;
-- SELECT COUNT(*) AS total_categories FROM categories;
-- SELECT COUNT(*) AS total_grievances FROM grievances;
-- SELECT COUNT(*) AS total_messages FROM messages;
-- SELECT COUNT(*) AS total_notifications FROM notifications;
-- SELECT COUNT(*) AS total_feedback FROM feedback;

-- SELECT * FROM grievance_summary LIMIT 5;
-- SELECT * FROM faculty_workload;
-- SELECT * FROM monthly_statistics;

-- ============================================================
-- SEED DATA INSERTION COMPLETE
-- ============================================================

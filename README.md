# Student Grievance Management System (SGMS)

A comprehensive full-stack web application for managing student grievances in educational institutions. Built with Node.js, Express, PostgreSQL, React, and Tailwind CSS.

---

## 🎯 Project Overview

SGMS is a production-ready grievance management system that digitizes and streamlines the process of raising, tracking, and resolving student complaints in colleges and universities.

### **Key Features:**

- **Three User Roles:** Student, Faculty, and Admin with role-based access control
- **Complete Grievance Lifecycle:** From submission to resolution with status tracking
- **Real-time Updates:** Instant notifications and status changes
- **Internal Messaging:** Communication between students and assigned faculty
- **Advanced Analytics:** Dashboard with charts and statistics
- **File Attachments:** Support for uploading documents and images
- **Feedback System:** Students can rate and comment on resolutions
- **Category Management:** Organize grievances by type (Academic, Hostel, etc.)
- **Responsive Design:** Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### **Backend:**
- Node.js (v16+)
- Express.js
- PostgreSQL (v14+)
- JWT Authentication
- bcrypt (Password Hashing)
- Multer (File Uploads)
- express-validator (Input Validation)

### **Frontend:**
- React 18
- Vite (Build Tool)
- Tailwind CSS
- Axios (HTTP Client)
- React Toastify (Notifications)
- Chart.js (Analytics)

---

## 📁 Project Structure

```
SGMS/
├── database/
│   ├── schema.sql          # Database schema with triggers and views
│   └── seed.sql            # Sample data for testing
├── backend/
│   ├── config/
│   │   ├── database.js     # PostgreSQL connection
│   │   └── jwt.js          # JWT configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & validation middleware
│   ├── routes/             # API route definitions
│   ├── uploads/            # File upload directory
│   ├── server.js           # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Dashboard pages
│   │   ├── services/       # API service layer
│   │   ├── context/        # Auth context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── docs/
├── scripts/
├── README.md
├── .gitignore
└── LICENSE
```

---

## ⚙️ Installation & Setup

### **Prerequisites:**
- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### **Step 1: Clone the Repository**

```bash
git clone <repository-url>
cd SGMS
```

### **Step 2: Database Setup**

1. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE sgms_db;
\q
```

2. Run schema and seed files:
```bash
psql -U postgres -d sgms_db -f database/schema.sql
psql -U postgres -d sgms_db -f database/seed.sql
```

### **Step 3: Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sgms_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Start backend server:
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### **Step 4: Frontend Setup**

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 👤 Default Login Credentials

After running the seed file, use these credentials:

### **Admin:**
- Email: `admin@college.edu`
- Password: `Admin@123`

### **Faculty:**
- Email: `rajesh.kumar@college.edu`
- Password: `Faculty@123`

### **Student:**
- Email: `rahul.sharma@college.edu`
- Password: `Student@123`

---

## 📚 API Endpoints

### **Authentication:**
- `POST /api/auth/register/student` - Register new student
- `POST /api/auth/login` - Login (all roles)
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### **Grievances:**
- `POST /api/grievances` - Create grievance (Student)
- `GET /api/grievances/student` - Get student's grievances
- `GET /api/grievances/:id` - Get grievance details
- `PUT /api/grievances/:id` - Update grievance (Faculty/Admin)
- `DELETE /api/grievances/:id` - Delete grievance (Admin)

### **Faculty:**
- `GET /api/faculty/grievances` - Get assigned grievances
- `GET /api/faculty/stats` - Get workload statistics
- `GET /api/faculty/grievances/:id/messages` - Get messages
- `POST /api/faculty/grievances/:id/messages` - Send message

### **Admin:**
- `GET /api/admin/students` - Get all students
- `GET /api/admin/faculty` - Get all faculty
- `POST /api/admin/students` - Add student
- `POST /api/admin/faculty` - Add faculty
- `GET /api/admin/grievances` - Get all grievances
- `PUT /api/admin/grievances/:id/assign` - Assign grievance
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Add category

---

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication (7-day expiration)
- Role-based access control (RBAC)
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection
- CORS configuration
- Secure file upload validation
- Environment variable management

---

## 📊 Database Features

- **9 Tables:** students, faculty, admins, grievances, categories, status, messages, notifications, feedback
- **Auto-update Triggers:** Timestamps automatically updated
- **Notification Triggers:** Auto-create notifications on status changes
- **Database Views:** grievance_summary, faculty_workload, monthly_statistics
- **Foreign Key Constraints:** Maintain data integrity
- **Indexes:** Optimized query performance

---

## 🎨 UI Features

- Clean, modern design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Color-coded status badges
- Priority indicators
- Real-time toast notifications
- Loading states
- Empty state handling
- Confirmation dialogs

---

## 🚀 Usage Guide

### **For Students:**
1. Register or login with student credentials
2. View dashboard with grievance statistics
3. Submit new grievances with category, priority, and description
4. Track status of submitted grievances
5. Communicate with assigned faculty via messages
6. Provide feedback after resolution

### **For Faculty:**
1. Login with faculty credentials
2. View assigned grievances dashboard
3. See workload statistics
4. Update grievance status (In Progress, Resolved)
5. Add resolution notes
6. Communicate with students

### **For Admins:**
1. Login with admin credentials
2. View system-wide statistics and analytics
3. Manage users (students and faculty)
4. Assign pending grievances to faculty
5. Manage categories
6. Generate reports and view trends

---

## 🧪 Testing

1. Start PostgreSQL database
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`
4. Login with demo credentials
5. Test different user roles and features

---

## 📖 Development

### **Backend Development:**
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### **Frontend Development:**
```bash
cd frontend
npm run dev  # Start Vite dev server with hot reload
```

### **Build for Production:**
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## 🤝 Contributing

This is a college project. Contributions are welcome!

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Authors

SGMS Team

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

## 🎓 Educational Purpose

This project is developed as a college project to demonstrate full-stack development skills using modern web technologies. It serves as a portfolio piece and learning resource.

---

## ✅ Features Checklist

- ✅ User authentication (JWT + bcrypt)
- ✅ Role-based access control
- ✅ Grievance CRUD operations
- ✅ File upload support
- ✅ Internal messaging system
- ✅ Real-time notifications
- ✅ Feedback system
- ✅ Admin dashboard with analytics
- ✅ Category management
- ✅ Responsive design
- ✅ Input validation
- ✅ Error handling
- ✅ Database triggers and views
- ✅ API documentation
- ✅ Comprehensive README

---

**Made with ❤️ for educational purposes**

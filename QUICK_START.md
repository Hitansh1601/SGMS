# 🚀 Quick Start Guide - SGMS

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ installed
- ✅ PostgreSQL v14+ installed and running
- ✅ npm or yarn package manager
- ✅ Git (optional, for cloning)

## Installation Methods

### Method 1: Automated Setup (Recommended for Windows)

```powershell
# Run the automated setup script
cd SGMS
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

The script will:
1. ✅ Check prerequisites
2. ✅ Create database
3. ✅ Apply schema and seed data
4. ✅ Install all dependencies
5. ✅ Create environment files

### Method 2: Manual Setup

#### Step 1: Database Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE sgms_db;
\q

# Run schema
psql -U postgres -d sgms_db -f database/schema.sql

# Insert sample data
psql -U postgres -d sgms_db -f database/seed.sql
```

#### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=sgms_db
```

#### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# .env file is already configured
# VITE_API_URL=http://localhost:5000
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

✅ Backend will run on: **http://localhost:5000**

### Start Frontend Server

```bash
# Open new terminal
cd frontend
npm run dev
```

✅ Frontend will run on: **http://localhost:5173**

## Testing the Application

### Login Credentials

Open http://localhost:5173 in your browser and login with:

**Student Account:**
- Email: `rahul.sharma@college.edu`
- Password: `Student@123`

**Faculty Account:**
- Email: `rajesh.kumar@college.edu`
- Password: `Faculty@123`

**Admin Account:**
- Email: `admin@college.edu`
- Password: `Admin@123`

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Change port in backend/.env
PORT=5001
```

### Issue 2: Database Connection Failed

**Error:** `Database connection failed`

**Solution:**
1. Ensure PostgreSQL is running
2. Check database credentials in `backend/.env`
3. Verify database exists: `psql -U postgres -l`

### Issue 3: Module Not Found

**Error:** `Cannot find module`

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: CORS Error

**Error:** `CORS policy blocked`

**Solution:**
- Ensure frontend URL is correct in `backend/.env`
- Check FRONTEND_URL=http://localhost:5173

## Verifying Installation

### Check Backend Health

Visit: http://localhost:5000/api/health

Expected response:
```json
{
  "success": true,
  "message": "SGMS API is running"
}
```

### Check Database Connection

```bash
psql -U postgres -d sgms_db -c "SELECT COUNT(*) FROM students;"
```

Expected: 10 students

## Next Steps

1. ✅ Login with student account
2. ✅ Create a test grievance
3. ✅ Login with faculty account
4. ✅ View and update grievance
5. ✅ Login with admin account
6. ✅ Explore admin dashboard

## Development Tips

### Backend Development

```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development

```bash
cd frontend
npm run dev  # Hot reload enabled
```

### View Database

```bash
psql -U postgres -d sgms_db
\dt  # List tables
SELECT * FROM grievances;
```

## Production Build

### Build Frontend

```bash
cd frontend
npm run build
# Build output in dist/ folder
```

### Run Backend in Production

```bash
cd backend
NODE_ENV=production npm start
```

## Additional Resources

- 📚 Full Documentation: README.md
- 🔧 API Documentation: docs/API_DOCUMENTATION.md
- 🗄️ Database Schema: database/schema.sql
- 🎯 Sample Data: database/seed.sql

## Support

If you encounter any issues:
1. Check console errors (F12 in browser)
2. Check backend terminal for errors
3. Verify database connection
4. Ensure all dependencies are installed

## Quick Commands Reference

```bash
# Database
psql -U postgres                              # Open PostgreSQL CLI
CREATE DATABASE sgms_db;                      # Create database
\l                                            # List databases
\c sgms_db                                    # Connect to database
\dt                                           # List tables

# Backend
cd backend
npm install                                   # Install dependencies
npm run dev                                   # Start dev server
npm start                                     # Start production server

# Frontend
cd frontend
npm install                                   # Install dependencies
npm run dev                                   # Start dev server
npm run build                                 # Build for production
npm run preview                               # Preview production build
```

---

**Happy Coding! 🚀**

For detailed information, refer to the main README.md file.

# 🚀 SGMS - Complete Setup & Running Guide

## ⚡ Quick Start (Step-by-Step)

### **Prerequisites Check:**
- ✅ Node.js (v16+) installed
- ✅ PostgreSQL (v14+) installed and running
- ✅ Git installed

---

## 📝 Step-by-Step Setup

### **Step 1: Install Backend Dependencies**

Open PowerShell in the project root and run:

```powershell
cd backend
npm install
```

**Expected output:** Installing packages (this may take 2-3 minutes)

---

### **Step 2: Create Backend .env File**

```powershell
# Copy the example file
cd backend
Copy-Item .env.example .env
```

**Then edit `backend/.env` with your PostgreSQL password:**

```env
DB_PASSWORD=your_actual_postgres_password
```

---

### **Step 3: Setup Database**

**Option A: Using psql command line**

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE sgms_db;"

# Run schema
psql -U postgres -d sgms_db -f database/schema.sql

# Run seed data
psql -U postgres -d sgms_db -f database/seed.sql
```

**Option B: Using pgAdmin**
1. Open pgAdmin
2. Create new database: `sgms_db`
3. Open Query Tool
4. Run `database/schema.sql`
5. Run `database/seed.sql`

---

### **Step 4: Start Backend Server**

```powershell
cd backend
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 Server running on port 5000
📍 Local URL: http://localhost:5000
```

**Keep this terminal window open!**

---

### **Step 5: Start Frontend (New Terminal)**

Open a **NEW** PowerShell window:

```powershell
cd frontend
npm run dev
```

**Expected output:**
```
VITE ready in 500ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### **Step 6: Open Browser**

Go to: **http://localhost:5173**

---

## 🔑 Demo Login Credentials

### **Student:**
- Email: `rahul.sharma@college.edu`
- Password: `Student@123`

### **Faculty:**
- Email: `rajesh.kumar@college.edu`
- Password: `Faculty@123`

### **Admin:**
- Email: `admin@college.edu`
- Password: `Admin@123`

---

## ❌ Common Issues & Solutions

### **Issue 1: Backend won't start - "Database connection failed"**

**Problem:** PostgreSQL not running or wrong credentials

**Solution:**
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-14  # Adjust version number

# Verify credentials in backend/.env
# Make sure DB_PASSWORD matches your PostgreSQL password
```

---

### **Issue 2: Frontend shows blank page or connection error**

**Problem:** Backend not running or wrong API URL

**Checklist:**
1. ✅ Is backend running? Check http://localhost:5000/api/health
2. ✅ Is `frontend/.env` correct?
3. ✅ Check browser console (F12) for errors

**Fix:**
```powershell
# Make sure backend/.env has:
PORT=5000

# Make sure frontend/.env has:
VITE_API_URL=http://localhost:5000
```

---

### **Issue 3: "Cannot find module" errors**

**Problem:** Dependencies not installed

**Solution:**
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### **Issue 4: "Port 5000 already in use"**

**Solution:**
```powershell
# Find what's using port 5000
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force

# Or change port in backend/.env
PORT=5001
```

---

### **Issue 5: Database tables not found**

**Problem:** Schema not loaded

**Solution:**
```powershell
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS sgms_db;"
psql -U postgres -c "CREATE DATABASE sgms_db;"

# Run schema and seed again
psql -U postgres -d sgms_db -f database/schema.sql
psql -U postgres -d sgms_db -f database/seed.sql
```

---

### **Issue 6: Login fails with "Invalid credentials"**

**Problem:** Seed data not loaded or password mismatch

**Solution:**
```powershell
# Check if seed data is loaded
psql -U postgres -d sgms_db -c "SELECT COUNT(*) FROM students;"

# If count is 0, run seed file
psql -U postgres -d sgms_db -f database/seed.sql
```

---

## 🔍 Verify Installation

### **Test Backend:**
```powershell
# Test health endpoint
Invoke-WebRequest http://localhost:5000/api/health
```

**Expected:** `{"success":true,"message":"Server is running"}`

### **Test Database:**
```powershell
# Check students table
psql -U postgres -d sgms_db -c "SELECT name, email FROM students LIMIT 3;"
```

**Expected:** List of 3 students

### **Test Frontend:**
- Go to http://localhost:5173
- Should see login page
- Try logging in with demo credentials

---

## 📊 Complete Terminal Output Examples

### **Successful Backend Start:**
```
PS C:\...\SGMS\backend> npm run dev

> backend@1.0.0 dev
> nodemon server.js

[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
✅ Database connected successfully
==================================================
  STUDENT GRIEVANCE MANAGEMENT SYSTEM (SGMS)
==================================================
🚀 Server running on port 5000
📍 Local URL: http://localhost:5000
🔒 Environment: development
📊 Database: sgms_db
==================================================

API Endpoints:
  - Auth:       http://localhost:5000/api/auth
  - Grievances: http://localhost:5000/api/grievances
  - Student:    http://localhost:5000/api/student
  - Faculty:    http://localhost:5000/api/faculty
  - Admin:      http://localhost:5000/api/admin
  - Health:     http://localhost:5000/api/health
```

### **Successful Frontend Start:**
```
PS C:\...\SGMS\frontend> npm run dev

> frontend@0.0.0 dev
> vite


  VITE v5.0.8  ready in 512 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🛠️ Development Tips

### **Auto-reload:**
- Backend: Uses nodemon - saves in `.js` files trigger restart
- Frontend: Uses Vite HMR - instant hot module replacement

### **View Logs:**
- Backend: Check terminal where `npm run dev` is running
- Frontend: Browser Console (F12 → Console tab)
- Database: Check PostgreSQL logs

### **Stop Servers:**
- Press `Ctrl + C` in the terminal windows

---

## 📁 Project Structure Check

Your project should look like this:

```
SGMS/
├── backend/
│   ├── node_modules/     ← Should exist after npm install
│   ├── uploads/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env              ← Create this from .env.example
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── node_modules/     ← Should exist after npm install
│   ├── src/
│   ├── .env              ← Should exist
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

---

## 🎯 Quick Commands Reference

### **Setup (One-time):**
```powershell
# Backend
cd backend
npm install
Copy-Item .env.example .env
# Edit .env with your DB password

# Database
psql -U postgres -c "CREATE DATABASE sgms_db;"
psql -U postgres -d sgms_db -f ../database/schema.sql
psql -U postgres -d sgms_db -f ../database/seed.sql

# Frontend (already done if node_modules exists)
cd ../frontend
npm install
```

### **Daily Development:**
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Browser
# Open http://localhost:5173
```

---

## 🆘 Still Having Issues?

### **Check these in order:**

1. **PostgreSQL Service:**
   ```powershell
   Get-Service postgresql*
   ```
   Should show "Running"

2. **Database exists:**
   ```powershell
   psql -U postgres -l | Select-String "sgms_db"
   ```
   Should show sgms_db

3. **Backend .env file:**
   ```powershell
   Test-Path backend\.env
   ```
   Should return True

4. **Backend dependencies:**
   ```powershell
   Test-Path backend\node_modules
   ```
   Should return True

5. **Frontend dependencies:**
   ```powershell
   Test-Path frontend\node_modules
   ```
   Should return True

6. **Ports available:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5000,5173 -ErrorAction SilentlyContinue
   ```
   Should return nothing (ports free)

---

## 📞 Need Help?

If you're still stuck, check:
1. Backend terminal for error messages
2. Browser console (F12) for frontend errors
3. PostgreSQL logs for database issues

Common error messages and their solutions are in the sections above!

---

**Last Updated:** November 5, 2025  
**Project:** SGMS - Student Grievance Management System  
**Repository:** https://github.com/Hitansh1601/SGMS

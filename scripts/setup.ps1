# ============================================================
# SGMS - Automated Setup Script for Windows (PowerShell)
# ============================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Student Grievance Management System (SGMS)" -ForegroundColor Cyan
Write-Host "  Automated Setup Script" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js v16 or higher." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL is installed: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PostgreSQL is not installed. Please install PostgreSQL v14 or higher." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Step 1: Database Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Get database credentials
$dbName = Read-Host "Enter database name (default: sgms_db)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "sgms_db" }

$dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "Enter PostgreSQL password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

Write-Host ""
Write-Host "Creating database: $dbName..." -ForegroundColor Yellow

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $dbPasswordPlain

# Create database
$createDbCommand = "CREATE DATABASE $dbName;"
Write-Output $createDbCommand | psql -U $dbUser -h localhost 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database created successfully" -ForegroundColor Green
} else {
    Write-Host "Note: Database may already exist or creation failed" -ForegroundColor Yellow
}

# Run schema
Write-Host "Running database schema..." -ForegroundColor Yellow
psql -U $dbUser -h localhost -d $dbName -f database/schema.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Schema applied successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Schema application failed" -ForegroundColor Red
    exit 1
}

# Run seed data
Write-Host "Inserting sample data..." -ForegroundColor Yellow
psql -U $dbUser -h localhost -d $dbName -f database/seed.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Sample data inserted successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Sample data insertion failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Step 2: Backend Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Create backend .env file
Write-Host "Creating backend .env file..." -ForegroundColor Yellow

$backendEnv = @"
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$dbName
DB_USER=$dbUser
DB_PASSWORD=$dbPasswordPlain
JWT_SECRET=sgms_secret_key_2024_change_in_production
FRONTEND_URL=http://localhost:5173
"@

Set-Content -Path "backend/.env" -Value $backendEnv
Write-Host "✓ Backend .env file created" -ForegroundColor Green

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Backend dependency installation failed" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Step 3: Frontend Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend dependency installation failed" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  ✓ Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start backend:  cd backend && npm run dev" -ForegroundColor Yellow
Write-Host "2. Start frontend: cd frontend && npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Default credentials:" -ForegroundColor Cyan
Write-Host "  Student: rahul.sharma@college.edu / Student@123" -ForegroundColor Yellow
Write-Host "  Faculty: rajesh.kumar@college.edu / Faculty@123" -ForegroundColor Yellow
Write-Host "  Admin:   admin@college.edu / Admin@123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green

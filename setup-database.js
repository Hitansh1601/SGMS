// ============================================================
// Automated Database Setup Script
// Handles database creation and initialization
// ============================================================

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
    console.log('\n' + '='.repeat(60));
    console.log('  SGMS - Automated Database Setup');
    console.log('='.repeat(60) + '\n');

    // Get PostgreSQL credentials
    const dbUser = await question('PostgreSQL Username (default: postgres): ') || 'postgres';
    const dbPassword = await question('PostgreSQL Password: ');
    const dbHost = await question('PostgreSQL Host (default: localhost): ') || 'localhost';
    const dbPort = await question('PostgreSQL Port (default: 5432): ') || '5432';
    const dbName = await question('Database Name (default: sgms_db): ') || 'sgms_db';

    console.log('\n📡 Testing connection...');

    // Create connection to default postgres database
    const pool = new Pool({
        user: dbUser,
        host: dbHost,
        database: 'postgres',
        password: dbPassword,
        port: parseInt(dbPort),
    });

    try {
        // Test connection
        await pool.query('SELECT version()');
        console.log('✅ Connection successful!');

        // Check if database exists
        const dbCheck = await pool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [dbName]
        );

        if (dbCheck.rows.length > 0) {
            console.log(`\n⚠️  Database "${dbName}" already exists.`);
            const overwrite = await question('Do you want to drop and recreate it? (yes/no): ');
            
            if (overwrite.toLowerCase() === 'yes' || overwrite.toLowerCase() === 'y') {
                console.log(`\n🗑️  Dropping existing database...`);
                await pool.query(`DROP DATABASE ${dbName}`);
                console.log('✅ Database dropped');
            } else {
                console.log('\n❌ Setup cancelled.');
                await pool.end();
                rl.close();
                return;
            }
        }

        // Create database
        console.log(`\n🔨 Creating database "${dbName}"...`);
        await pool.query(`CREATE DATABASE ${dbName}`);
        console.log('✅ Database created');

        await pool.end();

        // Connect to new database
        const newPool = new Pool({
            user: dbUser,
            host: dbHost,
            database: dbName,
            password: dbPassword,
            port: parseInt(dbPort),
        });

        // Run schema
        console.log('\n📄 Loading schema...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        await newPool.query(schemaSQL);
        console.log('✅ Schema loaded');

        // Run seed data
        console.log('\n🌱 Loading seed data...');
        const seedPath = path.join(__dirname, 'database', 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await newPool.query(seedSQL);
        console.log('✅ Seed data loaded');

        // Verify data
        const studentCount = await newPool.query('SELECT COUNT(*) FROM students');
        const facultyCount = await newPool.query('SELECT COUNT(*) FROM faculty');
        const grievanceCount = await newPool.query('SELECT COUNT(*) FROM grievances');

        console.log('\n' + '='.repeat(60));
        console.log('  ✅ Database Setup Complete!');
        console.log('='.repeat(60));
        console.log(`\n📊 Statistics:`);
        console.log(`   Students: ${studentCount.rows[0].count}`);
        console.log(`   Faculty: ${facultyCount.rows[0].count}`);
        console.log(`   Sample Grievances: ${grievanceCount.rows[0].count}`);

        // Update .env file
        console.log('\n📝 Updating backend/.env file...');
        const envPath = path.join(__dirname, 'backend', '.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
            envContent = envContent.replace(/DB_HOST=.*/,  `DB_HOST=${dbHost}`);
            envContent = envContent.replace(/DB_PORT=.*/,  `DB_PORT=${dbPort}`);
            envContent = envContent.replace(/DB_NAME=.*/,  `DB_NAME=${dbName}`);
            envContent = envContent.replace(/DB_USER=.*/,  `DB_USER=${dbUser}`);
            envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${dbPassword}`);
        } else {
            envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}

# JWT Configuration
JWT_SECRET=sgms_secret_key_2024_change_in_production
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Environment file updated');

        console.log('\n' + '='.repeat(60));
        console.log('  🎉 Setup Complete! You can now run:');
        console.log('='.repeat(60));
        console.log('\n  Backend:  cd backend && npm run dev');
        console.log('  Frontend: cd frontend && npm run dev\n');
        console.log('  Access: http://localhost:5173\n');

        console.log('  Demo Credentials:');
        console.log('  Student: rahul.sharma@college.edu / Student@123');
        console.log('  Faculty: rajesh.kumar@college.edu / Faculty@123');
        console.log('  Admin:   admin@college.edu / Admin@123\n');

        await newPool.end();
        rl.close();

    } catch (error) {
        console.error('\n❌ Error during setup:', error.message);
        console.error('\nPlease check:');
        console.error('  - PostgreSQL is running');
        console.error('  - Credentials are correct');
        console.error('  - You have permission to create databases');
        await pool.end();
        rl.close();
        process.exit(1);
    }
}

// Run setup
setupDatabase();

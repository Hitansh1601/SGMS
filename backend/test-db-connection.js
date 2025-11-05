// Simple Database Test Script
// Run this to test your PostgreSQL connection

const { Pool } = require('pg');

// Try different passwords
const passwords = ['postgres', 'admin', 'root', 'password', '123456', ''];

async function testConnection(password) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres', // Connect to default postgres database
        password: password,
        port: 5432,
    });

    try {
        const result = await pool.query('SELECT version()');
        console.log('✅ SUCCESS! Password is:', password || '(empty)');
        console.log('PostgreSQL version:', result.rows[0].version);
        
        // Try to create database
        try {
            await pool.query('CREATE DATABASE sgms_db;');
            console.log('✅ Database sgms_db created successfully!');
        } catch (err) {
            if (err.code === '42P04') {
                console.log('ℹ️  Database sgms_db already exists');
            } else {
                console.log('⚠️  Could not create database:', err.message);
            }
        }
        
        await pool.end();
        return true;
    } catch (err) {
        await pool.end();
        return false;
    }
}

async function findPassword() {
    console.log('🔍 Testing PostgreSQL passwords...\n');
    
    for (const pwd of passwords) {
        process.stdout.write(`Testing password: "${pwd || '(empty)'}"... `);
        const success = await testConnection(pwd);
        if (success) {
            console.log('\n\n🎉 Found working password!');
            console.log('\nUpdate your backend/.env file with:');
            console.log(`DB_PASSWORD=${pwd}`);
            return;
        } else {
            console.log('❌');
        }
    }
    
    console.log('\n❌ None of the common passwords worked.');
    console.log('Please check your PostgreSQL installation or reset password.');
}

findPassword();

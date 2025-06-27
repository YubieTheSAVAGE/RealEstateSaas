#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("🔧 Setting up Admin User for Real Estate SaaS");
console.log("=============================================");

// Set environment variables
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/mydb";

console.log("📋 Admin user details:");
console.log("   Email: test@immo360.com");
console.log("   Password: test123");
console.log("   Role: ADMIN");
console.log("");

console.log("🗄️ Database URL:", process.env.DATABASE_URL);
console.log("");

// Check if we're in the right directory
if (!fs.existsSync('back-end/package.json')) {
    console.error("❌ Please run this script from the project root directory");
    process.exit(1);
}

// Change to backend directory
process.chdir('back-end');

try {
    console.log("📦 Installing dependencies if needed...");
    if (!fs.existsSync('node_modules')) {
        execSync('npm install', { stdio: 'inherit' });
    }

    console.log("🔧 Generating Prisma client...");
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log("🗄️ Running database migrations...");
    try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    } catch (error) {
        console.log("⚠️ Migration failed, but continuing...");
    }

    console.log("👤 Creating admin user...");
    execSync('npm run create-admin', { stdio: 'inherit' });

    console.log("");
    console.log("🎯 Setup complete!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Start the database: docker compose up -d db (or use Docker Desktop)");
    console.log("2. Start the backend: cd back-end && npm run dev");
    console.log("3. Start the frontend: cd front-end && npm run dev");
    console.log("4. Open http://localhost:3000 and login with test@immo360.com / test123");

} catch (error) {
    console.error("❌ Setup failed:", error.message);
    console.log("");
    console.log("💡 Manual steps:");
    console.log("1. Make sure PostgreSQL is running on localhost:5432");
    console.log("2. Run: cd back-end");
    console.log("3. Run: export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/mydb'");
    console.log("4. Run: npx prisma migrate deploy");
    console.log("5. Run: npm run create-admin");
    process.exit(1);
}

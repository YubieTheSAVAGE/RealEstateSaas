#!/bin/bash

# Quick Setup Script for Enhanced Real Estate Backend
# This script will get your backend working with enhanced project and property CRUD

echo "🚀 Quick Setup for Enhanced Real Estate Backend"
echo "=============================================="

# Change to backend directory
cd "$(dirname "$0")/.."

# Step 1: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb
JWT_SECRET=your-secret-key-here
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 3: Reset database and apply new schema
echo "🗑️  Resetting database with enhanced schema..."
npx prisma migrate reset --force

# Step 4: Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Step 5: Create admin user
echo "👤 Creating admin user..."
node scripts/create-admin.js

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 What's been set up:"
echo "   ✅ Enhanced Project model with all frontend fields"
echo "   ✅ Extended Property types (13 types supported)"
echo "   ✅ Database reset with new schema"
echo "   ✅ Admin user created"
echo ""
echo "🏠 Supported Property Types:"
echo "   - Residential: APARTMENT, DUPLEX, VILLA, PENTHOUSE, STUDIO, LOFT, TOWNHOUSE"
echo "   - Commercial: STORE, OFFICE, WAREHOUSE"
echo "   - Land: LAND"
echo "   - Parking: GARAGE, PARKING"
echo ""
echo "📍 Enhanced Project Fields:"
echo "   - Location: latitude, longitude"
echo "   - Financial: folderFees, commissionPerM2, totalSales"
echo "   - Status: PLANIFICATION, CONSTRUCTION, DONE"
echo "   - Progress: 0-100%"
echo "   - Media: constructionPhotos array"
echo ""
echo "🎯 Next Steps:"
echo "   1. Start the server: npm run dev"
echo "   2. Test the API: node scripts/test-enhanced-project.js"
echo "   3. Access your app at: http://localhost:3001"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email: admin@realestate.com"
echo "   Password: admin123"
echo ""
echo "Ready for your demo! 🎬"

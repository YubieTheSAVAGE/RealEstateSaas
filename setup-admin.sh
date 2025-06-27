#!/bin/bash

echo "🔧 Setting up Admin User for Real Estate SaaS"
echo "============================================="

# Set the DATABASE_URL for local development
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"

echo "📋 Admin user details:"
echo "   Email: test@immo360.com"
echo "   Password: test123"
echo "   Role: ADMIN"
echo ""

echo "🗄️ Database URL: $DATABASE_URL"
echo ""

# Check if we're in the right directory
if [ ! -f "back-end/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Go to backend directory
cd back-end

echo "📦 Installing dependencies if needed..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "👤 Creating admin user..."
npm run create-admin

echo ""
echo "🎯 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the database: docker compose up -d db (or use Docker Desktop)"
echo "2. Start the backend: cd back-end && npm run dev"
echo "3. Start the frontend: cd front-end && npm run dev"
echo "4. Open http://localhost:3000 and login with test@immo360.com / test123"

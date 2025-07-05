#!/bin/bash

# Script to reset database and apply new schema
# This will delete all data and recreate the database with the new schema

echo "🔄 Resetting database and applying new schema..."

# Change to backend directory
cd "$(dirname "$0")/.."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found. Creating one..."
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb" > .env
    echo "JWT_SECRET=your-secret-key-here" >> .env
    echo "PORT=3001" >> .env
    echo "NODE_ENV=development" >> .env
    echo "BASE_URL=http://localhost:3001" >> .env
fi

# Reset the database (this will delete all data)
echo "🗑️  Resetting database..."
npx prisma migrate reset --force

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo "✅ Database reset and migration completed successfully!"
    echo ""
    echo "📋 Enhanced Project model now includes:"
    echo "   - latitude/longitude for map integration"
    echo "   - folderFees and commissionPerM2 for financial tracking"
    echo "   - totalSales for revenue tracking"
    echo "   - status (PLANIFICATION, CONSTRUCTION, DONE)"
    echo "   - progress (0-100%) for project tracking"
    echo "   - constructionPhotos array for multiple images"
    echo ""
    echo "🏠 Enhanced Property types now include:"
    echo "   - Residential: APARTMENT, DUPLEX, VILLA, PENTHOUSE, STUDIO, LOFT, TOWNHOUSE"
    echo "   - Commercial: STORE, OFFICE, WAREHOUSE"
    echo "   - Land: LAND"
    echo "   - Parking: GARAGE, PARKING"
    echo ""
    echo "🎯 Ready to test! You can now:"
    echo "   1. Start your development server: npm run dev"
    echo "   2. Create projects with all enhanced fields"
    echo "   3. Add properties of different types to projects"
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi

#!/bin/bash

# Script to ensure database schema is correct and fix common issues
echo "🔧 Ensuring database schema is correct..."

# Change to backend directory
cd "$(dirname "$0")/.."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found. Please create one with DATABASE_URL"
    exit 1
fi

echo "📋 Current migration status:"
npx prisma migrate status

echo ""
echo "🔄 Deploying any pending migrations..."
npx prisma migrate deploy

echo ""
echo "🔄 Generating Prisma client..."
npx prisma generate

echo ""
echo "🧪 Running ClientStatus enum fix script..."
node scripts/fix-client-status-enum.js

echo ""
echo "✅ Database schema check completed!"
echo ""
echo "💡 If you're still having issues:"
echo "   1. Check that your database is running"
echo "   2. Verify DATABASE_URL in .env is correct"
echo "   3. Consider running: npx prisma migrate reset --force (⚠️ This will delete all data)"
echo "   4. Check the logs above for any specific errors"

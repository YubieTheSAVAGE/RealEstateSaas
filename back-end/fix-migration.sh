#!/bin/bash

# Fix Migration Script
# This script resolves the failed migration issue and applies the new schema

echo "🔧 Fixing migration issues..."

# Change to backend directory
cd "$(dirname "$0")"

# Step 1: Mark the failed migration as resolved (if it exists in DB)
echo "📝 Resolving failed migration state..."
npx prisma migrate resolve --rolled-back 20250702000001_enhance_project_model 2>/dev/null || echo "Migration not found in DB, continuing..."

# Step 2: Reset the database completely to clean state
echo "🗑️  Resetting database to clean state..."
npx prisma migrate reset --force

# Step 3: Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

echo "✅ Migration issues fixed!"
echo "🎯 Database is now ready with enhanced schema"

#!/bin/bash
set -e

echo "🚀 Starting Real Estate SaaS Backend (Development Mode)..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h db -p 5432 -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma client (in case schema changed)
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations in development
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init || echo "Migration failed or already exists, continuing..."

# Create uploads directory if it doesn't exist
mkdir -p src/uploads

# Start the application in development mode
echo "🎯 Starting application in development mode..."
npm run dev

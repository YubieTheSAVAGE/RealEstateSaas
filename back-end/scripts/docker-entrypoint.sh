#!/bin/bash
set -e

echo "🚀 Starting Real Estate SaaS Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h db -p 5432 -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Create uploads directory if it doesn't exist
mkdir -p src/uploads

# Start the application
echo "🎯 Starting application..."
if [ "$NODE_ENV" = "production" ]; then
  npm start
else
  npm run dev
fi

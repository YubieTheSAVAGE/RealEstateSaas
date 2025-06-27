#!/bin/bash

echo "🚀 Starting Real Estate SaaS - Local Development"
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start only database and MinIO with Docker
echo "🗄️ Starting database and MinIO..."
docker-compose -f docker-compose.simple.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Setup backend
echo "🔧 Setting up backend..."
cd back-end

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Set environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"
export PORT=3001
export JWT_SECRET="your-secret-key-here"
export NODE_ENV=development

# Generate Prisma client and run migrations
echo "🔄 Setting up database..."
npx prisma generate
npx prisma migrate deploy

# Start backend in background
echo "🚀 Starting backend..."
npm run dev &
BACKEND_PID=$!

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../front-end

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Set environment variables
export NEXT_PUBLIC_API_URL="http://localhost:3001"

# Start frontend
echo "🚀 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "🗄️ Database: localhost:5432"
echo "📁 MinIO: http://localhost:9000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; docker-compose -f docker-compose.simple.yml down; exit" INT
wait

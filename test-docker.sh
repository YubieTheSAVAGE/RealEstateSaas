#!/bin/bash

echo "🧪 Testing Docker Compose Setup..."

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down -v

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

echo "Frontend (port 3000):"
curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Frontend is running" || echo "❌ Frontend is not responding"

echo "Backend health check (port 3001):"
curl -f http://localhost:3001/health > /dev/null 2>&1 && echo "✅ Backend is running" || echo "❌ Backend is not responding"

echo "Database (port 5432):"
docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1 && echo "✅ Database is running" || echo "❌ Database is not responding"

echo "MinIO (port 9000):"
curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1 && echo "✅ MinIO is running" || echo "❌ MinIO is not responding"

# Show logs for debugging
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo "🎯 Test complete! Check the output above for any issues."

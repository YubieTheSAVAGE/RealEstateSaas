#!/bin/bash

echo "🧪 Testing bcrypt fix..."

# Clean up
echo "🧹 Cleaning up..."
docker-compose down -v

# Remove old node_modules to ensure clean install
echo "🗑️ Removing old node_modules..."
rm -rf back-end/node_modules
rm -rf front-end/node_modules

# Build and start
echo "🏗️ Building and starting services..."
docker-compose up --build -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Test backend
echo "🔍 Testing backend..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running successfully!"
else
    echo "❌ Backend failed to start"
    echo "📋 Backend logs:"
    docker-compose logs backend
    exit 1
fi

# Test frontend
echo "🔍 Testing frontend..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running successfully!"
else
    echo "❌ Frontend failed to start"
    echo "📋 Frontend logs:"
    docker-compose logs frontend
fi

echo "🎯 Test complete!"

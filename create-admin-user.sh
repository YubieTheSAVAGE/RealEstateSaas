#!/bin/bash

echo "🔧 Creating Admin User for Real Estate SaaS"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "📋 Admin user details:"
echo "   Email: test@immo360.com"
echo "   Password: test123"
echo "   Role: ADMIN"
echo ""

# Option 1: If containers are running, use docker exec
if docker-compose ps | grep -q "backend.*Up"; then
    echo "🐳 Using running Docker container..."
    docker-compose exec backend npm run create-admin
elif [ -d "back-end/node_modules" ]; then
    # Option 2: Run locally if node_modules exists
    echo "💻 Running locally..."
    cd back-end
    export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"
    npm run create-admin
    cd ..
else
    # Option 3: Start containers and run
    echo "🚀 Starting containers and creating user..."
    docker-compose up -d db
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    # Run the script in a temporary container
    docker-compose run --rm backend npm run create-admin
fi

echo ""
echo "🎯 Next steps:"
echo "1. Start the application: docker-compose up"
echo "2. Open http://localhost:3000"
echo "3. Login with test@immo360.com / test123"

#!/bin/bash

echo "🔧 Docker Credential Helper Fix Script"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "1️⃣ Attempting to fix Docker credentials..."

# Create Docker config directory
mkdir -p ~/.docker

# Create or update Docker config
cat > ~/.docker/config.json << EOF
{
  "auths": {},
  "credsStore": ""
}
EOF

echo "✅ Updated Docker config to disable credential store"

# Restart Docker (if possible)
echo "2️⃣ Please restart Docker Desktop manually:"
echo "   - Quit Docker Desktop completely"
echo "   - Start Docker Desktop again"
echo "   - Wait for it to fully load"

echo ""
echo "3️⃣ Alternative options if the issue persists:"
echo ""
echo "Option A - Use simple setup (database only):"
echo "   docker-compose -f docker-compose.simple.yml up -d"
echo "   cd back-end && npm run dev"
echo "   cd front-end && npm run dev"
echo ""
echo "Option B - Pre-pull images manually:"
echo "   docker pull node:20-slim"
echo "   docker pull postgres:15"
echo "   docker pull minio/minio:latest"
echo ""
echo "Option C - Use local Dockerfiles:"
echo "   # Edit docker-compose.yml to use Dockerfile.local"
echo ""
echo "🎯 Try running: docker-compose up --build"

#!/bin/bash

echo "🐳 Creating Admin User in Docker PostgreSQL"
echo "=========================================="

echo "📋 Admin user details:"
echo "   Email: test@immo360.com"
echo "   Password: test123"
echo "   Role: ADMIN"
echo ""

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    echo "🔍 Using docker-compose..."
    
    # Check if db service is running
    if docker-compose ps | grep -q "db.*Up"; then
        echo "✅ Database container is running"
        echo "🚀 Creating admin user..."
        
        docker-compose exec db psql -U postgres -d mydb -c "
        INSERT INTO \"User\" (
            name,
            email,
            \"phoneNumber\",
            status,
            role,
            \"passwordHash\",
            \"createdAt\",
            \"updatedAt\"
        ) VALUES (
            'Admin User',
            'test@immo360.com',
            '1234567890',
            'ACTIVE',
            'ADMIN',
            '\$2a\$10\$NV7LB8LQgLZfMf2rPbOWj.BJ8mJM1Ru2Yo0tHnkyZ6dgAtVKIDzGy',
            NOW(),
            NOW()
        ) ON CONFLICT (email) DO NOTHING;
        "
        
        echo ""
        echo "🔍 Verifying user creation..."
        docker-compose exec db psql -U postgres -d mydb -c "
        SELECT id, name, email, role, status, \"createdAt\" FROM \"User\" WHERE email = 'test@immo360.com';
        "
        
    else
        echo "❌ Database container is not running"
        echo "💡 Start it with: docker-compose up -d db"
        exit 1
    fi
    
elif command -v docker &> /dev/null; then
    echo "🔍 Using docker directly..."
    
    # Find PostgreSQL container
    POSTGRES_CONTAINER=$(docker ps --filter "ancestor=postgres" --format "{{.Names}}" | head -n1)
    
    if [ -z "$POSTGRES_CONTAINER" ]; then
        echo "❌ No running PostgreSQL container found"
        echo "💡 Make sure your PostgreSQL container is running"
        exit 1
    fi
    
    echo "✅ Found PostgreSQL container: $POSTGRES_CONTAINER"
    echo "🚀 Creating admin user..."
    
    docker exec -i $POSTGRES_CONTAINER psql -U postgres -d mydb << 'EOF'
INSERT INTO "User" (
    name,
    email,
    "phoneNumber",
    status,
    role,
    "passwordHash",
    "createdAt",
    "updatedAt"
) VALUES (
    'Admin User',
    'test@immo360.com',
    '1234567890',
    'ACTIVE',
    'ADMIN',
    '$2a$10$NV7LB8LQgLZfMf2rPbOWj.BJ8mJM1Ru2Yo0tHnkyZ6dgAtVKIDzGy',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

SELECT id, name, email, role, status, "createdAt" FROM "User" WHERE email = 'test@immo360.com';
EOF

else
    echo "❌ Docker not found"
    echo "💡 Please install Docker or use the manual SQL method"
    exit 1
fi

echo ""
echo "✅ Admin user setup complete!"
echo ""
echo "🎯 Login credentials:"
echo "   Email: test@immo360.com"
echo "   Password: test123"
echo ""
echo "🚀 Next steps:"
echo "1. Start your application: docker-compose up"
echo "2. Open http://localhost:3000"
echo "3. Login with the credentials above"

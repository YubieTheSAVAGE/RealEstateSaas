#!/bin/bash

echo "🗄️ Creating Admin User via SQL"
echo "=============================="

# Database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="mydb"
DB_USER="postgres"
DB_PASSWORD="postgres"

echo "📋 Admin user details:"
echo "   Email: test@immo360.com"
echo "   Password: test123"
echo "   Role: ADMIN"
echo ""

echo "🔗 Connecting to database: postgresql://$DB_USER:***@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql command not found. Please install PostgreSQL client."
    echo ""
    echo "💡 Alternative methods:"
    echo "1. Use Docker to run psql:"
    echo "   docker run --rm -it --network host postgres:15 psql -h localhost -U postgres -d mydb -f /path/to/create-admin-user.sql"
    echo ""
    echo "2. Use a database GUI tool (pgAdmin, DBeaver, etc.) and run the SQL manually:"
    echo "   File: create-admin-user.sql"
    echo ""
    echo "3. Copy and paste this SQL into your database tool:"
    echo ""
    cat create-admin-user.sql
    exit 1
fi

# Run the SQL file
echo "🚀 Executing SQL script..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f create-admin-user.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Admin user created successfully!"
    echo ""
    echo "🎯 You can now login with:"
    echo "   Email: test@immo360.com"
    echo "   Password: test123"
else
    echo ""
    echo "❌ Failed to create admin user"
    echo ""
    echo "💡 Manual steps:"
    echo "1. Connect to your PostgreSQL database"
    echo "2. Run the SQL commands from create-admin-user.sql"
fi

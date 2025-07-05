#!/bin/bash

# Database Reset Script for Docker
# This script resets the database and applies the new schema

echo "🔄 Resetting database..."

# Reset database and apply new schema
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate

echo "✅ Database reset completed!"
echo "🎯 Enhanced project schema is now active"

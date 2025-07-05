#!/bin/bash

# Script to start the backend server and display documentation info
echo "🚀 Starting Real Estate SaaS API Server..."
echo ""
echo "📚 API Documentation will be available at:"
echo "   • Swagger UI: http://localhost:3001/docs"
echo "   • API Base URL: http://localhost:3001/api"
echo ""
echo "🔑 Authentication:"
echo "   • Login endpoint: POST /auth/login"
echo "   • Use Bearer token in Authorization header"
echo ""
echo "👥 Default Users (if seeded):"
echo "   • Admin: admin@example.com / password123"
echo "   • Agent: agent@example.com / password123"
echo "   • Client: client@example.com / password123"
echo ""
echo "📖 Full Documentation:"
echo "   • See API_DOCUMENTATION.md for complete guide"
echo "   • Interactive testing available in Swagger UI"
echo ""
echo "🔧 Development Commands:"
echo "   • npm run dev - Start with nodemon"
echo "   • npm run migrate:dev - Run database migrations"
echo "   • npm run seed - Seed database with sample data"
echo ""
echo "Starting server..."
echo "=================================="

# Start the server
npm run dev

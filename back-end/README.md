# Real Estate SaaS Backend

Enhanced backend with complete project and property CRUD operations, ready for your demo!

## 🚀 Quick Start

```bash
# Run the quick setup script
chmod +x scripts/quick-setup.sh
./scripts/quick-setup.sh

# Start the development server
npm run dev
```

## ✨ Enhanced Features

### 📍 **Enhanced Projects**
- **Location**: latitude, longitude for map integration
- **Financial**: folderFees, commissionPerM2, totalSales tracking
- **Status**: PLANIFICATION → CONSTRUCTION → DONE workflow
- **Progress**: 0-100% completion tracking
- **Media**: constructionPhotos array support

### 🏠 **Complete Property Types**
- **Residential**: APARTMENT, DUPLEX, VILLA, PENTHOUSE, STUDIO, LOFT, TOWNHOUSE
- **Commercial**: STORE, OFFICE, WAREHOUSE
- **Land**: LAND
- **Parking**: GARAGE, PARKING

## 📋 API Endpoints

### Projects
```
GET    /api/projects              - Get all projects
GET    /api/projects/:id          - Get project by ID
POST   /api/projects              - Create project (with all enhanced fields)
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project
```

### Properties
```
GET    /api/apartments                    - Get all properties
GET    /api/projects/:id/apartments       - Get properties by project
POST   /api/projects/:id/apartments       - Create property in project
PUT    /api/apartments/:id                - Update property
DELETE /api/apartments/:id               - Delete property
POST   /api/apartments/:id/assign        - Assign property to client
```

## 🧪 Testing

```bash
# Test the enhanced functionality
node scripts/test-enhanced-project.js

# Check server health
curl http://localhost:3001/health
```

## 📊 Example Project Creation

```json
{
  "name": "Résidence Al Manar",
  "address": "Boulevard Mohammed V, Casablanca",
  "numberOfApartments": 50,
  "totalSurface": 5000,
  "latitude": 33.5731,
  "longitude": -7.5898,
  "folderFees": 15000,
  "commissionPerM2": 500,
  "status": "PLANIFICATION",
  "progress": 25,
  "constructionPhotos": [
    "https://example.com/photo1.jpg"
  ]
}
```

## 🏠 Example Property Creation

```json
{
  "number": "A-101",
  "type": "APARTMENT",
  "floor": 1,
  "area": 85,
  "price": 850000,
  "pricePerM2": 10000,
  "zone": "A",
  "status": "AVAILABLE"
}
```

## 🔧 Database Schema

The database includes all enhanced fields:

- **Projects**: Enhanced with location, financial data, status, progress
- **Properties**: Support for 13+ property types with flexible validation
- **Users**: Admin/Agent role management
- **Clients**: Complete client management with document support

## 🎯 Demo Ready Features

✅ **Complete Project CRUD** with all enhanced fields  
✅ **Complete Property CRUD** for all property types  
✅ **File upload** for images and documents  
✅ **Role-based authentication** (Admin/Agent)  
✅ **Client management** with property assignment  
✅ **Database relationships** and data integrity  

## 🔑 Default Admin Account

- **Email**: admin@realestate.com
- **Password**: admin123

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database completely
npx prisma migrate reset --force
npx prisma generate
```

### Migration Conflicts
```bash
# If you have migration conflicts, run:
./scripts/quick-setup.sh
```

### Server Not Starting
```bash
# Check if PostgreSQL is running
docker-compose up db

# Check environment variables
cat .env
```

## 📁 Project Structure

```
back-end/
├── src/
│   ├── controllers/     # API controllers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── utils/           # Helper utilities
├── prisma/
│   ├── schema.prisma    # Enhanced database schema
│   └── migrations/      # Database migrations
└── scripts/
    ├── quick-setup.sh   # Quick setup script
    └── test-enhanced-project.js  # Test script
```

## 🎬 Ready for Demo!

Your backend now supports:
- ✅ All frontend project requirements
- ✅ Complete property type system
- ✅ Enhanced CRUD operations
- ✅ File upload capabilities
- ✅ Authentication and authorization

Start the server and you're ready to demo! 🚀

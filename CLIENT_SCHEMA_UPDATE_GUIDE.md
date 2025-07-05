# Client Schema Update Guide

## 🎯 **Overview**
This guide documents the addition of `firstName`, `lastName`, and `whatsappNumber` fields to the Client schema in the Real Estate SaaS application.

## 📋 **Changes Made**

### 🗄️ **Database Schema Changes**

#### **Prisma Schema Updates** (`back-end/prisma/schema.prisma`)
- ✅ Added `firstName` (required) field
- ✅ Added `lastName` (required) field  
- ✅ Added `whatsappNumber` (optional) field
- ✅ Kept `name` field for backward compatibility

#### **Migration File** (`back-end/prisma/migrations/20250105000000_add_client_name_fields/migration.sql`)
- ✅ Created migration to add new columns
- ✅ Includes data migration to populate firstName/lastName from existing name field
- ✅ Sets NOT NULL constraints after data migration

### 🔧 **Backend API Changes**

#### **Routes Documentation** (`back-end/src/routes/clients.routes.js`)
- ✅ Updated Swagger schemas for all client endpoints
- ✅ Added firstName, lastName, whatsappNumber to request/response schemas
- ✅ Updated validation rules and descriptions

#### **Controller Updates** (`back-end/src/controllers/clients.controller.js`)
- ✅ Updated `createClient` to handle new fields
- ✅ Updated `updateClient` to handle new fields
- ✅ Added validation for firstName, lastName (required)
- ✅ Added validation for whatsappNumber (optional but must be valid format)
- ✅ Auto-compute full name from firstName + lastName

#### **Service Updates** (`back-end/src/services/clients.service.js`)
- ✅ Updated `addNewClient` to include new fields
- ✅ Updated `updateClient` to handle new fields
- ✅ Updated User creation for CLIENT status to use computed name

### 🎨 **Frontend Changes**

#### **Type Definitions** (`front-end/src/types/client.ts`)
- ✅ Updated Client interface to include firstName, lastName, whatsappNumber
- ✅ Changed status enum from 'LEAD' to 'PROSPECT'

#### **Add Client Modal** (`front-end/src/components/example/ModalExample/AddClientModal.tsx`)
- ✅ Updated FormData interface
- ✅ Replaced single name field with firstName/lastName fields
- ✅ Added whatsappNumber field
- ✅ Updated validation logic
- ✅ Updated form submission data

#### **Edit Client Modal** (`front-end/src/components/example/ModalExample/EditClientModal.tsx`)
- ✅ Updated form state and validation
- ✅ Replaced single name field with firstName/lastName fields
- ✅ Added whatsappNumber field
- ✅ Updated client data preparation

#### **Client Data Table** (`front-end/src/components/tables/DataTables/Clients/ClientsDataTable.tsx`)
- ✅ Updated data mapping to include new fields
- ✅ Fixed table header labels
- ✅ Maintained backward compatibility with name field

#### **Client API Functions** (`front-end/src/app/(admin)/clients/`)
- ✅ Updated addClient.tsx interface
- ✅ Updated updateClient.ts interface

## 🚀 **Deployment Instructions**

### **1. Database Migration**
```bash
# Start the database (if using Docker)
docker compose up -d db

# Run the migration
cd back-end
npx prisma migrate dev --name add-client-name-fields

# Or apply existing migration
npx prisma migrate deploy
```

### **2. Backend Deployment**
```bash
cd back-end
npm install  # Install any new dependencies
npm run build  # If applicable
npm start  # Start the server
```

### **3. Frontend Deployment**
```bash
cd front-end
npm install  # Install any new dependencies
npm run build  # Build for production
npm start  # Start the frontend
```

## 🔍 **Testing Checklist**

### **Backend API Testing**
- [ ] Test POST /api/clients with firstName, lastName, whatsappNumber
- [ ] Test PUT /api/clients/:id with new fields
- [ ] Test GET /api/clients returns new fields
- [ ] Test validation errors for missing firstName/lastName
- [ ] Test whatsappNumber validation (optional but valid format)
- [ ] Test PROSPECT to CLIENT conversion still works

### **Frontend Testing**
- [ ] Test Add Client modal with new fields
- [ ] Test Edit Client modal with new fields
- [ ] Test client list displays names correctly
- [ ] Test form validation for required fields
- [ ] Test WhatsApp number field (optional)
- [ ] Test backward compatibility with existing clients

### **Data Migration Testing**
- [ ] Verify existing clients have firstName/lastName populated
- [ ] Verify name field is still populated for backward compatibility
- [ ] Verify no data loss during migration

## 📝 **API Documentation**

### **Updated Client Schema**
```json
{
  "id": 1,
  "firstName": "Jean",
  "lastName": "Dupont", 
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "phoneNumber": "06-12-34-56-78",
  "whatsappNumber": "06-12-34-56-78",
  "status": "PROSPECT",
  "notes": "Interested in 3-bedroom apartments",
  "provenance": "Google search",
  "userId": null,
  "createdById": 1,
  "createdAt": "2025-01-05T10:00:00Z",
  "updatedAt": "2025-01-05T10:00:00Z"
}
```

### **Required Fields**
- `firstName` (string, required)
- `lastName` (string, required)
- `email` (string, required)
- `phoneNumber` (string, required)
- `provenance` (string, required)

### **Optional Fields**
- `whatsappNumber` (string, optional, must be valid phone format if provided)
- `notes` (string, optional)
- `status` (enum: PROSPECT|CLIENT, defaults to PROSPECT)

## 🔄 **Backward Compatibility**

- ✅ Existing `name` field is maintained and auto-computed
- ✅ Existing API endpoints continue to work
- ✅ Frontend gracefully handles clients with/without new fields
- ✅ Database migration preserves existing data

## 📚 **Documentation Updated**

- ✅ Swagger/OpenAPI documentation includes new fields
- ✅ API documentation reflects new schema
- ✅ Frontend component documentation updated

## 🎉 **Summary**

The Client schema has been successfully updated to include:
- **firstName** and **lastName** as separate required fields
- **whatsappNumber** as an optional field
- Full backward compatibility with existing data
- Updated frontend forms and validation
- Comprehensive API documentation

All changes maintain backward compatibility while providing enhanced client data management capabilities.

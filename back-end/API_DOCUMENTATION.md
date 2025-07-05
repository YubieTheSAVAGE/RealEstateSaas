# Real Estate SaaS API Documentation

## Overview

This is the comprehensive API documentation for the Real Estate SaaS platform. The API provides endpoints for managing users, clients, projects, properties, and more.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.realestate-saas.com`

## Interactive Documentation

Visit the Swagger UI for interactive API documentation:
- **Development**: `http://localhost:3001/docs`
- **Production**: `https://api.realestate-saas.com/docs`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

## User Roles

- **ADMIN**: Full access to all endpoints
- **AGENT**: Limited access, can manage clients and view projects/properties
- **CLIENT**: Access to client portal (limited endpoints)

## Core Entities

### User
- **id**: Integer (Primary Key)
- **name**: String (Full name)
- **email**: String (Unique email address)
- **phoneNumber**: String
- **role**: Enum (ADMIN, AGENT, CLIENT)
- **status**: Enum (ACTIVE, INACTIVE)

### Client
- **id**: Integer (Primary Key)
- **name**: String (Full name)
- **email**: String (Unique email address)
- **phoneNumber**: String
- **status**: Enum (PROSPECT, CLIENT)
- **notes**: String (Optional)
- **provenance**: String (How they found us)
- **userId**: Integer (Optional - linked User account for CLIENT status)
- **createdById**: Integer (User who created this client)

### Project
- **id**: Integer (Primary Key)
- **name**: String (Project name)
- **address**: String (Project address)
- **totalSurface**: Integer (Total area in m²)
- **numberOfApartments**: Integer
- **status**: Enum (PLANIFICATION, CONSTRUCTION, DONE)
- **progress**: Integer (0-100%)
- **image**: String (Image URL)
- **latitude/longitude**: Number (GPS coordinates)
- **folderFees**: Number (Folder fees amount)
- **commissionPerM2**: Number (Commission per m²)
- **totalSales**: Number (Total sales amount)

### Property (Apartment)
- **id**: Integer (Primary Key)
- **number**: String (Property identifier)
- **floor**: Integer (Floor number - not applicable for LAND, GARAGE, PARKING)
- **type**: Enum (APARTMENT, DUPLEX, VILLA, PENTHOUSE, STUDIO, LOFT, TOWNHOUSE, STORE, OFFICE, WAREHOUSE, LAND, GARAGE, PARKING)
- **area**: Number (Area in m²)
- **price**: Number (Total price)
- **pricePerM2**: Number (Price per m²)
- **status**: Enum (AVAILABLE, RESERVED, SOLD)
- **prixType**: Enum (FIXE, M2)
- **projectId**: Integer (Associated project)
- **clientId**: Integer (Optional - associated client)

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (Admin only)
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)

### Properties
- `GET /api/apartments` - Get all properties
- `GET /api/apartments/:id` - Get property by ID
- `GET /api/projects/:projectId/apartments` - Get properties by project
- `POST /api/projects/:projectId/apartments` - Create property in project (Admin only)
- `PUT /api/apartments/:id` - Update property
- `DELETE /api/apartments/:id` - Delete property (Admin only)
- `POST /api/apartments/:id/assign` - Assign property to client

## Example Requests

### Create a Client

```bash
POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "phoneNumber": "+33 6 12 34 56 78",
  "status": "PROSPECT",
  "provenance": "Google search",
  "notes": "Interested in 3-bedroom apartments"
}
```

### Convert PROSPECT to CLIENT

```bash
PUT /api/clients/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "CLIENT",
  "password": "securePassword123"
}
```

### Create a Project

```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=Résidence Les Jardins
address=123 Rue de la Paix, 75001 Paris
numberOfApartments=50
totalSurface=5000
status=PLANIFICATION
progress=0
image=<file>
```

### Create a Property

```bash
POST /api/projects/1/apartments
Authorization: Bearer <token>
Content-Type: multipart/form-data

number=A101
floor=1
type=APARTMENT
area=85.5
price=250000
prixType=FIXE
zone=Zone A
image=<file>
```

### Assign Property to Client

```bash
POST /api/apartments/1/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientId": 1,
  "status": "RESERVED"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## Property Type Validation

### Floor Field Requirements
The `floor` field is **required** for these property types:
- APARTMENT, DUPLEX, VILLA, PENTHOUSE, STUDIO, LOFT, TOWNHOUSE, OFFICE, WAREHOUSE

The `floor` field is **not applicable** for these property types:
- LAND, GARAGE, PARKING

### Status Transitions
- **AVAILABLE** → **RESERVED** (when client reserves)
- **RESERVED** → **SOLD** (when sale is completed)
- **AVAILABLE** → **SOLD** (direct sale)

## Client Status Workflow

1. **PROSPECT**: Initial lead/contact
   - Basic contact information
   - No user account
   - Can be interested in properties

2. **CLIENT**: Converted customer
   - Has user account for portal access
   - Can log into client portal
   - Requires password when converting from PROSPECT

## File Uploads

For endpoints that accept file uploads (projects and properties), use `multipart/form-data`:

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "name=Project Name" \
  -F "address=Project Address" \
  -F "image=@/path/to/image.jpg" \
  http://localhost:3001/api/projects
```

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- **100 requests per minute** per IP address
- **1000 requests per hour** per authenticated user

## Support

For API support and questions:
- **Email**: support@realestate-saas.com
- **Documentation**: Visit `/docs` for interactive Swagger UI
- **GitHub**: [Repository Link]

## Changelog

### Version 1.0.0
- Initial API release
- Authentication system
- Client management
- Project management
- Property management
- Client portal integration

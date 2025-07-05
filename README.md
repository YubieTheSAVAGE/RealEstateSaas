# Real Estate SaaS Backend API Requirements

## Overview

This document outlines the complete backend API requirements for the Real Estate SaaS application based on the frontend implementation analysis. The frontend is built with **Next.js 15** using TypeScript and requires a backend API running on `http://localhost:3001` (configurable via `NEXT_PUBLIC_API_URL`).

## Table of Contents

- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [File Upload Requirements](#file-upload-requirements)
- [Query Parameters & Filtering](#query-parameters--filtering)
- [Security Requirements](#security-requirements)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Additional Features](#additional-features)

## Authentication & Authorization

### User Roles
The application supports three user roles:
- **ADMIN**: Full access to all endpoints
- **AGENT**: Limited access (cannot delete, limited admin functions)
- **CLIENT**: Only access to own data via `/api/client/*` endpoints

### Authentication Endpoints
```
POST /auth/login              - User login with email/password
POST /auth/client/login       - Client-specific login (optional, same as regular login)
```

### JWT Token Requirements
- JWT tokens must include `role`, `id`, `exp`, `iat` fields
- Tokens are stored in HTTP-only cookies named `auth-token`
- Role-based access control with middleware protection

## API Endpoints

### User/Agent Management
```
GET    /api/agents                    - Get all agents (Admin only)
GET    /api/agents/top-performing     - Get top performing agents (with limit query param)
GET    /api/agents/:agentId           - Get agent by ID (Admin only)
POST   /api/agents                    - Create new agent (Admin only)
PUT    /api/agents/:agentId           - Update agent (Admin only)
DELETE /api/agents/:agentId           - Delete agent (Admin only)
```

### Client Management
```
GET    /api/clients                   - Get all clients (Agent/Admin)
GET    /api/clients/:clientId         - Get client by ID (Agent/Admin)
POST   /api/clients                   - Create new client (Agent/Admin)
PUT    /api/clients/:clientId         - Update client (Agent/Admin)
DELETE /api/clients/:clientId         - Delete client (Agent/Admin)
```

### Project Management
```
GET    /api/projects                  - Get all projects (Agent/Admin)
GET    /api/projects/:projectId       - Get project by ID (Agent/Admin)
POST   /api/projects                  - Create new project (Admin only)
PUT    /api/projects/:projectId       - Update project (Admin only)
DELETE /api/projects/:projectId       - Delete project (Admin only)
```

### Property/Apartment Management
```
GET    /api/apartments                - Get all apartments (Agent/Admin)
GET    /api/apartments/user           - Get apartments by current user
GET    /api/apartments/:apartmentId   - Get apartment by ID (Agent/Admin)
PUT    /api/apartments/:apartmentId   - Update apartment (Agent/Admin)
DELETE /api/apartments/:apartmentId   - Delete apartment (Admin only)
POST   /api/apartments/:apartmentId/assign - Assign apartment to client

GET    /api/projects/:projectId/apartments - Get apartments by project
POST   /api/projects/:projectId/apartments - Create apartment in project (Admin only)

# Property aliases (same functionality as apartments)
GET    /api/property                  - Alias for apartments
GET    /api/property/:propertyId      - Alias for apartment by ID
PUT    /api/property/:propertyId      - Alias for apartment update
DELETE /api/property/:propertyId      - Alias for apartment delete
POST   /api/property/:propertyId/assign - Alias for apartment assignment
GET    /api/projects/:projectId/property - Alias for apartments by project
POST   /api/projects/:projectId/property - Alias for apartment creation
```

### Task Management
```
GET    /api/tasks                     - Get all tasks (Agent/Admin)
GET    /api/tasks/stats               - Get task statistics (Admin only)
GET    /api/tasks/:id                 - Get task by ID (Agent/Admin)
POST   /api/tasks                     - Create new task (Agent/Admin)
PUT    /api/tasks/:id                 - Update task (Agent/Admin)
DELETE /api/tasks/:id                 - Delete task (Admin only)
PATCH  /api/tasks/:id/status          - Update task status (Agent/Admin)

GET    /api/tasks/:taskId/comments    - Get task comments (Agent/Admin)
POST   /api/tasks/:taskId/comments    - Add comment to task (Agent/Admin)
DELETE /api/tasks/comments/:commentId - Delete comment (Agent/Admin)
```

### Activity & Analytics
```
GET    /api/activity/recent           - Get recent activity (with limit query param)
GET    /api/activity                  - Get activity (Admin only)
GET    /api/monthly-target            - Get monthly target (Agent/Admin)
POST   /api/monthly-target            - Set monthly target (Admin only)
```

### Client Dashboard (for CLIENT role)
```
GET    /api/client/properties         - Get client's own properties (Client only)
GET    /api/client/profile            - Get client's own profile (Client only)
```

### Health Check
```
GET    /health                        - Health check endpoint
```

## Data Models

### User/Agent Model
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
  role: 'ADMIN' | 'AGENT' | 'CLIENT';
  passwordHash: string;
  
  // Relationships
  clients?: Client[];
  apartments?: Property[];
  createdTasks?: Task[];
}
```

### Client Model
```typescript
interface Client {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  notes?: string;
  provenance: string;
  status: 'LEAD' | 'CLIENT';
  createdById: number;
  
  // Identity document fields (for CLIENT status)
  identityType?: 'Carte d\'identité' | 'Passport';
  identityNumber?: string;
  identityRecto?: string; // File path or URL
  identityVerso?: string; // File path or URL (only for Carte d'identité)
  
  // Relationships
  apartments?: Property[];
  interestedApartments?: Property[];
  payments?: Payment[];
}
```

### Property Model (Complex Type System)

#### Property Types
- **Residential**: `APARTMENT`, `DUPLEX`, `VILLA`, `PENTHOUSE`, `STUDIO`, `LOFT`, `TOWNHOUSE`
- **Commercial**: `STORE`, `OFFICE`, `WAREHOUSE`
- **Land**: `LAND`
- **Parking**: `GARAGE`, `PARKING`

#### Base Property Fields
```typescript
interface BaseProperty {
  id: number;
  number: string;
  type: PropertyType;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  
  // Location and structural information
  floor?: number;
  zone?: string;
  
  // Media and documentation
  image?: string | null;
  notes?: string | null;
  
  // Basic pricing
  prixType?: 'FIXE' | 'M2';
  prixTotal: number;
  prixM2?: number;
  
  // Relationships
  project: Project;
  client?: Client | null;
  userId?: number | null;
  interestedClients?: Client[] | null;
  
  // Timestamps
  updatedAt?: Date | string;
}
```

#### Type-Specific Fields

**Residential Properties:**
```typescript
interface ResidentialFields {
  // Surface measurements (m²)
  habitable: number; // Required
  balcon?: number;
  terrasse?: number;
  jardin?: number; // For villas
  piscine?: number;
  
  // Room counts
  bedrooms?: number;
  bathrooms?: number;
  livingRooms?: number;
  kitchens?: number;
  
  // Pricing percentages for annexes
  prixBalconPct?: number;
  prixTerrassePct?: number;
  prixJardinPct?: number;
  prixPiscine?: number;
  
  // Amenities
  hasElevator?: boolean;
  hasBalcony?: boolean;
  hasTerrace?: boolean;
  hasGarden?: boolean;
  hasPool?: boolean;
  furnished?: boolean;
  orientation?: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'NORTH_EAST' | 'NORTH_WEST' | 'SOUTH_EAST' | 'SOUTH_WEST';
}
```

**Commercial Properties:**
```typescript
interface CommercialFields {
  totalArea: number; // Required
  mezzanineArea?: number;
  storageArea?: number;
  officeArea?: number;
  
  // Features
  storefront?: boolean;
  loadingDock?: boolean;
  airConditioning?: boolean;
  securitySystem?: boolean;
  
  // Pricing
  mezzaninePrice?: number;
  storagePrice?: number;
  
  // Details
  businessType?: string;
  operatingHours?: string;
  maxOccupancy?: number;
}
```

**Land Properties:**
```typescript
interface LandFields {
  totalArea: number; // Required
  buildableArea?: number;
  
  // Characteristics
  landType?: 'URBAN' | 'RURAL' | 'INDUSTRIAL' | 'AGRICULTURAL';
  soilType?: string;
  slope?: 'FLAT' | 'SLIGHT' | 'MODERATE' | 'STEEP';
  access?: 'DIRECT' | 'SHARED' | 'PRIVATE_ROAD';
  
  // Utilities
  hasWater?: boolean;
  hasElectricity?: boolean;
  hasSewage?: boolean;
  hasGas?: boolean;
  hasInternet?: boolean;
  
  // Planning
  buildingPermit?: boolean;
  zoningRestrictions?: string;
  maxBuildingHeight?: number;
  maxCoverageRatio?: number;
}
```

**Parking Properties:**
```typescript
interface ParkingFields {
  totalArea?: number;
  
  // Features
  parkingType?: 'COVERED' | 'OPEN' | 'UNDERGROUND' | 'GARAGE';
  vehicleType?: 'CAR' | 'MOTORCYCLE' | 'TRUCK' | 'MIXED';
  securityLevel?: 'BASIC' | 'GATED' | 'SURVEILLANCE' | 'PREMIUM';
  
  // Amenities
  hasElectricCharging?: boolean;
  hasWashStation?: boolean;
  hasStorage?: boolean;
  
  // Access
  accessHours?: '24H' | 'BUSINESS' | 'RESTRICTED';
  monthlyRate?: number;
  dailyRate?: number;
  hourlyRate?: number;
}
```

### Project Model
```typescript
interface Project {
  id: number;
  name: string;
  numberOfProperties: number;
  totalSurface: number;
  address: string;
  latitude: number;
  longitude: number;

  // Financial information
  folderFees: number;
  commissionPerM2: number;
  totalSales?: number;

  // Project status and progress
  status: 'planification' | 'construction' | 'done';
  progress: number; // Percentage (0-100)

  // Media and documentation
  image?: File | null;
  constructionPhotos?: File[];
  notes?: string | null;

  // Related data
  properties?: Property[];

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdate?: string | Date;
  statusDates?: {
    planification?: string | Date;
    construction?: string | Date;
    done?: string | Date;
  };
}
```

### Task Model
```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  createdById?: number;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
}

interface Comment {
  id: number;
  content: string;
  taskId: number;
  createdAt: Date;
}
```

### Payment Model (Partially Implemented)
```typescript
interface Payment {
  id: number;
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'LATE';
  proofOfPayment: File | null;
  contract?: Contract;
  property: Property;
  createdAt: Date;
  updatedAt: Date;
  isFirstPayment?: boolean;
  percentageOfTotal?: number;
}
```

### Contract Model (Types Defined)
```typescript
interface Contract {
  id: number;
  template: ContractTemplate;
  status: 'WAITING_CVALIDATION' | 'VALIDATED_BY_CLIENT' | 'LEGALIZED' | 'VALIDATED';
  client: Client;
  property: Property;
  createdAt: Date;
  updatedAt: Date;
}
```

## File Upload Requirements

### Supported File Types
- **Images**: JPEG, PNG, JPG, WEBP
- **File Size Limit**: 5MB
- **Upload Directory**: `/uploads/` (served statically)

### File Upload Configuration
```javascript
// Fastify multipart configuration
{
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  attachFieldsToBody: 'keyValues'
}
```

### File Naming Convention
- **Projects**: `project_{timestamp}.{extension}`
- **Properties**: `property_{timestamp}.{extension}`
- **General**: `{timestamp}-{originalFilename}`

### File URL Format
```
{BASE_URL}/uploads/{filename}
```

## Query Parameters & Filtering

### Common Query Parameters
- `limit` - For pagination (activity, agents, etc.)
- `userId` - For filtering by user
- `summary` - For summary data only
- `projectId` - For filtering by project

### Dashboard Optimizations
The frontend uses parallel API calls for dashboard data:
```typescript
Promise.all([
  '/api/apartments?summary=true',
  '/api/activity/recent?limit=5',
  '/api/agents/top-performing?limit=5',
  '/api/monthly-target'
])
```

## Security Requirements

### JWT Configuration
- **Secret**: Configurable via `JWT_SECRET` environment variable
- **Cookie Name**: `auth-token`
- **Cookie Settings**:
  - HttpOnly: true
  - Secure: true (in production)
  - SameSite: 'lax'
  - Path: '/'

### Middleware Requirements
1. **Authentication Middleware**: Verify JWT tokens on protected routes
2. **Role-Based Authorization**:
   - `isAdmin` - Admin-only endpoints
   - `isAgentOrAdmin` - Agent and Admin access
   - `isClient` - Client-only endpoints
3. **CORS Configuration**: Allow frontend domain

### Role-Based Access Control
```javascript
// Example middleware usage
fastify.get('/api/agents', {
  onRequest: [fastify.authenticate],
  preHandler: [fastify.isAdmin]
}, controller.getAllAgents);
```

## Error Handling

### Error Response Format
```typescript
{
  error: string;
  statusCode?: number;
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient role permissions)
- `404` - Not Found
- `500` - Internal Server Error

### File Upload Errors
- Invalid file type: `400` with message "Only JPEG, PNG, JPG, or WEBP allowed."
- File too large: `400` with appropriate message
- Upload directory issues: `500` with error details

## Environment Variables

### Backend Environment Variables
```bash
# Required
JWT_SECRET=your-jwt-secret-key
DATABASE_URL=your-database-connection-string

# Optional
BASE_URL=http://localhost:3001  # For file URLs, defaults to localhost:3001
NODE_ENV=development            # development|production
PORT=3001                      # Server port, defaults to 3001
```

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend API URL
```

## Additional Features

### Payment System (Partially Implemented)
The frontend includes payment validation logic:
- **Minimum first payment**: 20% of property price
- **Payment amount limits**: 1,000 - 10,000,000 MAD
- **Payment plan validation**: Server-side validation required
- **Payment status tracking**: PENDING, PAID, LATE

### Contract Management (Types Defined)
Contract functionality is defined but not fully implemented:
- Contract templates
- Contract status workflow
- Contract-client-property relationships
- Document generation capabilities

### Property Assignment Logic
When agents assign properties to clients:
1. Property status should automatically change to 'RESERVED'
2. Client account creation should be triggered if needed
3. Activity logging for tracking changes

### Validation Requirements

#### Property Type Validation
- Different property types require different fields
- Type-specific validation rules must be enforced
- Floor field required for apartments but not for land/villas

#### Client Validation
- Email uniqueness
- Phone number format validation
- Identity document validation for CLIENT status

#### Project Validation
- Coordinate validation for latitude/longitude
- Progress percentage (0-100)
- Status workflow validation

## API Documentation

### Swagger/OpenAPI
The backend should include API documentation accessible at `/docs` endpoint with:
- Complete endpoint documentation
- Request/response schemas
- Authentication requirements
- Example requests and responses

### Testing Requirements
- Unit tests for all controllers and services
- Integration tests for API endpoints
- File upload testing
- Authentication and authorization testing
- Role-based access testing

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd RealEstateSaas
```

2. Install dependencies for both frontend and backend
```bash
# Frontend
cd front-end
npm install

# Backend
cd ../back-end
npm install
```

3. Set up environment variables
```bash
# Backend (.env)
DATABASE_URL="postgresql://username:password@localhost:5432/realestate"
JWT_SECRET="your-jwt-secret"
BASE_URL="http://localhost:3001"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

4. Run database migrations
```bash
cd back-end
npx prisma migrate dev
```

5. Start the applications
```bash
# Backend (Terminal 1)
cd back-end
npm run dev

# Frontend (Terminal 2)
cd front-end
npm run dev
```

## Project Structure

```
RealEstateSaas/
├── front-end/          # Next.js frontend application
├── back-end/           # Fastify backend API
└── README.md          # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

---

This README provides a comprehensive guide for implementing the backend API that supports the Real Estate SaaS frontend application. All endpoints, data models, and requirements are based on the actual frontend implementation analysis.

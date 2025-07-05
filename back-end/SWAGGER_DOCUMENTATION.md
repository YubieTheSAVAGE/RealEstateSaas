# Real Estate SaaS API Documentation

## 🎉 **Comprehensive Swagger/OpenAPI Documentation Successfully Implemented!**

### 📚 **Access the Documentation**
- **URL**: `http://localhost:3001/docs` (when server runs on default port)
- **Alternative**: `http://localhost:3003/docs` (current test instance)
- **Interactive**: Full Swagger UI with "Try it out" functionality

---

## 🛣️ **Documented API Routes**

### 🔐 **Authentication** (`/auth`)
- `POST /auth/login` - User authentication with email/password

### 👥 **Clients** (`/api/clients`)
- `GET /api/clients` - Get all clients (role-based filtering)
- `GET /api/clients/:clientId` - Get client by ID
- `POST /api/clients` - Create new client (supports PROSPECT to CLIENT conversion)
- `PUT /api/clients/:clientId` - Update client (supports status change with password)
- `DELETE /api/clients/:clientId` - Delete client

### 🏢 **Projects** (`/api/projects`)
- `GET /api/projects` - Get all projects with apartments
- `GET /api/projects/:projectId` - Get project by ID
- `POST /api/projects` - Create new project (Admin only, supports file upload)
- `PUT /api/projects/:projectId` - Update project (Admin only)
- `DELETE /api/projects/:projectId` - Delete project (Admin only)

### 🏠 **Properties/Apartments** (`/api/apartments`)
- `GET /api/apartments` - Get all properties
- `GET /api/apartments/:apartmentId` - Get property by ID
- `GET /api/projects/:projectId/apartments` - Get properties by project
- `POST /api/projects/:projectId/apartments` - Create property (Admin only)
- `PUT /api/apartments/:apartmentId` - Update property
- `DELETE /api/apartments/:apartmentId` - Delete property (Admin only)
- `POST /api/apartments/:apartmentId/assign` - Assign property to client

### 👨‍💼 **Users/Agents** (`/api/agents`)
- `GET /api/agents` - Get all agents (Admin only)
- `GET /api/agents/:agentId` - Get agent by ID (Admin only)
- `GET /api/agents/top-performing` - Get top performing agents
- `POST /api/agents` - Create new agent (Admin only)
- `PUT /api/agents/:agentId` - Update agent (Admin only)
- `DELETE /api/agents/:agentId` - Delete agent (Admin only)

### ✅ **Tasks** (`/api/tasks`)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/stats` - Get task statistics (Admin only)
- `GET /api/tasks/:id` - Get task by ID

### 📊 **Activity** (`/api/activity`)
- `GET /api/activity/recent` - Get recent activity logs
- `GET /api/activity` - Get all activity (Admin only)
- `GET /api/monthly-target` - Get monthly sales target
- `POST /api/monthly-target` - Set monthly sales target (Admin only)

---

## 🔧 **Technical Implementation**

### ✅ **Schema Configuration**
- **Fastify-Compatible**: Uses only JSON Schema syntax (no OpenAPI-specific keywords)
- **No Examples**: Removed all "example" properties that caused validation errors
- **Inline Schemas**: Uses inline schemas instead of $ref references
- **Proper Validation**: Request/response schema validation for all endpoints
- **HTTP Status Codes**: Comprehensive status codes (200, 201, 400, 401, 403, 404, 500)

### 🔒 **Security & Authentication**
- **JWT Bearer Token**: Configured security scheme for JWT authentication
- **Role-Based Access**: Clear documentation of role requirements (ADMIN, AGENT, CLIENT)
- **Middleware Documentation**: Proper reference to authenticate, isAdmin, isAgentOrAdmin

### 📝 **Documentation Quality**
- **Clear Descriptions**: Detailed endpoint summaries and descriptions
- **Parameter Documentation**: All path parameters, query strings, and request bodies
- **Data Types**: Proper data types, required fields, and validation rules
- **File Upload Support**: Multipart/form-data documentation for image uploads
- **Enum Values**: Documented enum values for status fields, property types, etc.

---

## 🚀 **Key Features Documented**

### 🔄 **PROSPECT to CLIENT Conversion**
- Password requirements for CLIENT status
- User account creation workflow
- Status change validation

### 🏠 **Property Type Validation**
- Floor field requirements by property type
- LAND, GARAGE, PARKING don't require floor
- APARTMENT, DUPLEX, VILLA, etc. support floor field

### 📁 **File Upload Support**
- Project image uploads (multipart/form-data)
- Property image handling
- Proper content-type documentation

### 🎯 **Role-Based Access Control**
- Admin-only endpoints clearly marked
- Agent access restrictions documented
- Client portal access documented

---

## 🛠️ **Server Status**

### ✅ **Successfully Running**
- Server starts without schema validation errors
- All routes register successfully
- Swagger UI loads and displays all endpoints
- Interactive "Try it out" functionality works

### 📊 **Validation Results**
- All route schemas are Fastify-compatible
- No "unknown keyword" errors
- No "$ref resolution" errors
- Clean server startup logs

---

## 🎯 **Next Steps**

1. **Test API Endpoints**: Use Swagger UI to test all documented endpoints
2. **Authentication Testing**: Test JWT token authentication flow
3. **Role-Based Testing**: Verify role-based access controls
4. **File Upload Testing**: Test project and property image uploads
5. **Client Conversion Testing**: Test PROSPECT to CLIENT conversion workflow

---

## 📞 **Support**

- **Documentation URL**: `http://localhost:3001/docs`
- **API Base URL**: `http://localhost:3001`
- **Health Check**: `GET /health`

The comprehensive Swagger/OpenAPI documentation is now fully functional and provides complete API reference for the Real Estate SaaS platform! 🎉

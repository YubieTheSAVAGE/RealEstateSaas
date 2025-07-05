require('dotenv').config();
const Fastify = require('fastify');
const multipart = require('@fastify/multipart');
const authRoutes   = require('./routes/auth.routes');
const agentRoutes  = require('./routes/agents.routes');
const clientRoutes = require('./routes/clients.routes');
const projectRoutes = require('./routes/projects.routes');
const apartmentRoutes = require('./routes/apartments.routes');
const taskRoutes = require('./routes/tasks.routes');
const activityRoutes = require('./routes/activity.routes');

const static = require('@fastify/static');
const path = require('path');

const { jwtPlugin, corsPlugin } = require('./plugins');

const app = Fastify({
  logger: {
    level: 'info'
  }
});

// Add request logging
app.addHook('onRequest', async (request, reply) => {
  console.log(`🌐 [Request] ${request.method} ${request.url}`);
  console.log(`🌐 [Request] Headers:`, {
    'content-type': request.headers['content-type'],
    'authorization': request.headers.authorization ? '[PRESENT]' : '[MISSING]',
    'user-agent': request.headers['user-agent']
  });
});

app.register(static, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', 
});

app.register(require('./middleware/auth.middleware'))

// Swagger/OpenAPI Configuration
console.log('📚 [Swagger] Initializing API documentation...');

const swaggerConfig = {
  openapi: {
    info: {
      title: 'Real Estate SaaS API',
      description: 'Comprehensive API for Real Estate SaaS platform with authentication, client management, project management, property management, and more.',
      version: '1.0.0',
      contact: {
        name: 'Real Estate SaaS Team',
        email: 'support@realestate-saas.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /auth/login endpoint'
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Clients', description: 'Client management (PROSPECT and CLIENT status)' },
      { name: 'Projects', description: 'Real estate project management' },
      { name: 'Properties', description: 'Property/apartment management within projects' },
      { name: 'Users', description: 'User and agent management' },
      { name: 'Tasks', description: 'Task management and tracking' },
      { name: 'Activity', description: 'Activity tracking and analytics' }
    ]
  }
};

// Register Swagger
app.register(require('@fastify/swagger'), swaggerConfig);

// Register Swagger UI
app.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true,
  transformSpecificationClone: true
});

console.log('✅ [Swagger] API documentation configured');
console.log('📚 [Swagger] Documentation will be available at: http://localhost:3001/docs');

app.register(multipart, {
  limits: { fileSize: 5 * 1024 * 1024 },
  attachFieldsToBody: 'keyValues',
  
  onFile: async (part) => {
    part.value = {
      filename: part.filename, 
      mimetype: part.mimetype,
      buffer: await part.toBuffer(),     
    };
  }
});

// Register CORS plugin
app.register(corsPlugin);

app.register(jwtPlugin, { secret: process.env.JWT_SECRET });

// Health check endpoint
app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes with enhanced debugging
console.log('🛣️ [Routes] Starting route registration...');

const routes = [
  { name: 'auth', module: authRoutes, prefix: '/auth' },
  { name: 'agents', module: agentRoutes, prefix: '/api' },
  { name: 'clients', module: clientRoutes, prefix: '/api' },
  { name: 'projects', module: projectRoutes, prefix: '/api' },
  { name: 'apartments', module: apartmentRoutes, prefix: '/api' },
  { name: 'tasks', module: taskRoutes, prefix: '/api' },
  { name: 'activity', module: activityRoutes, prefix: '/api' }
];

for (const route of routes) {
  app.register(async function routePlugin(fastify) {
    try {
      console.log(`🔌 [Routes] Registering ${route.name} routes with prefix ${route.prefix}...`);
      await fastify.register(route.module, { prefix: route.prefix });
      console.log(`✅ [Routes] ${route.name} routes registered successfully`);
    } catch (error) {
      console.error(`❌ [Routes] Failed to register ${route.name} routes:`);
      console.error('   Error:', error.message);
      throw error;
    }
  });
}

module.exports = app;

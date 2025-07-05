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

// Swagger/OpenAPI documentation temporarily disabled
console.log('📚 [Info] API documentation temporarily disabled');
console.log('� [Info] API endpoints available without documentation');

app.register(multipart, {
  limits: { fileSize: 5 * 1024 * 1024 },
  attachFieldsToBody: 'keyValues',
  
  onFile: async (part) => {
    part.value = {
      filename: part.filename, 
      mimetype: part.mimetype,
      // encoding: part.encoding,
      buffer: await part.toBuffer(),     
    };
  }
});


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
      SwaggerErrorHandler.analyzeError(error, `${route.name} Routes Registration`);
      throw error;
    }
  });
}

module.exports = app;
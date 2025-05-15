require('dotenv').config();
const Fastify = require('fastify');
const multipart = require('@fastify/multipart');
const authRoutes   = require('./routes/auth.routes');
const agentRoutes  = require('./routes/agents.routes');
const clientRoutes = require('./routes/clients.routes');
const projectRoutes = require('./routes/projects.routes');
const apartmentRoutes = require('./routes/apartments.routes');
const taskRoutes = require('./routes/tasks.routes');

const static = require('@fastify/static');
const path = require('path');


const { jwtPlugin, corsPlugin } = require('./plugins');

const app = Fastify({ logger: true });

app.register(static, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', 
});

app.register(require('./middleware/auth.middleware'))

app.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Auth API',
      description: 'API documentation for authentication system',
      version: '1.0.0',
    },
  },
});
app.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
});

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


app.register(authRoutes, { prefix: '/auth' });

app.register(agentRoutes, { prefix: '/api' });

app.register(clientRoutes, { prefix: '/api' });

app.register(projectRoutes, { prefix: '/api' });

app.register(apartmentRoutes, { prefix: '/api' });

app.register(taskRoutes, { prefix: '/api' });

module.exports = app;
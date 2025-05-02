require('dotenv').config();
const Fastify = require('fastify');
const multipart = require('@fastify/multipart');
const authRoutes   = require('./routes/auth.routes');
const agentRoutes  = require('./routes/agents.routes');

const { jwtPlugin, corsPlugin } = require('./plugins');

const app = Fastify({ logger: true });

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

module.exports = app;
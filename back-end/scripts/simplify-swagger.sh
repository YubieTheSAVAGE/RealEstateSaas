#!/bin/bash

# Script to simplify Swagger schemas to basic documentation only
echo "🔧 Simplifying Swagger schemas to avoid validation errors..."

# Backup original files
cp -r src/routes src/routes.backup

# Create simplified route files
cat > src/routes/auth.routes.js << 'EOF'
const controller = require("../controllers/auth.controller");

module.exports = async function (fastify) {
  fastify.post("/login", {
    schema: {
      tags: ['Authentication'],
      summary: 'User login',
      description: 'Authenticate user with email and password to receive JWT token'
    }
  }, controller.login);
};
EOF

cat > src/routes/clients.routes.js << 'EOF'
const controller = require('../controllers/clients.controller')

module.exports = async function (fastify) {
  fastify.get('/clients', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Get all clients',
      description: 'Retrieve a list of all clients'
    }
  }, controller.getAllClients)

  fastify.get('/clients/:clientId', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Get client by ID',
      description: 'Retrieve a specific client by their ID'
    }
  }, controller.getClientById)

  fastify.post('/clients', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Create new client',
      description: 'Create a new client. If status is CLIENT and password is provided, a user account will also be created.'
    }
  }, controller.createClient)

  fastify.put('/clients/:clientId', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Update client',
      description: 'Update an existing client. Can convert PROSPECT to CLIENT by providing password.'
    }
  }, controller.updateClient)

  fastify.delete('/clients/:clientId', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Delete client',
      description: 'Delete a client'
    }
  }, controller.deleteClient)
}
EOF

cat > src/routes/projects.routes.js << 'EOF'
const controller = require("../controllers/projects.controller");

module.exports = async function (fastify) {
  fastify.get("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Get all projects',
      description: 'Retrieve a list of all projects with their associated apartments'
    }
  }, controller.getAllProjects);

  fastify.get("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Get project by ID',
      description: 'Retrieve a specific project by its ID'
    }
  }, controller.getProjectById);

  fastify.post("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Create new project',
      description: 'Create a new real estate project. Only admins can create projects.'
    }
  }, controller.createProject);

  fastify.put("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Update project',
      description: 'Update an existing project. Only admins can update projects.'
    }
  }, controller.updateProject);

  fastify.delete("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Delete project',
      description: 'Delete a project and all its associated apartments. Only admins can delete projects.'
    }
  }, controller.deleteProject);
};
EOF

echo "✅ Simplified all Swagger schemas"
echo "🚀 Server should now start without validation errors"
echo "📚 Basic API documentation will be available at /docs"

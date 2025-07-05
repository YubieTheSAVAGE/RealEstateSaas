const controller = require("../controllers/agents.controller");

module.exports = async function (fastify) {
  fastify.get("/agents/top-performing", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Users'],
      summary: 'Get top performing agents',
      description: 'Retrieve a list of top performing agents based on sales metrics',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of top performing agents',
          type: 'array',
          items: {
            allOf: [
              { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string' } } },
              {
                type: 'object',
                properties: {
                  totalSales: { type: 'number', description: 'Total sales amount' },
                  clientsCount: { type: 'integer', description: 'Number of clients' },
                  propertiesSold: { type: 'integer', description: 'Number of properties sold' }
                }
              }
            ]
          }
        },
        401: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.getTopPerformingAgents);

  fastify.get("/agents", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Get all agents',
      description: 'Retrieve a list of all agents. Admin only.',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of agents',
          type: 'array',
          items: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string' } } }
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.getAllAgents);

  fastify.get("/agents/:agentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Get agent by ID',
      description: 'Retrieve a specific agent by ID. Admin only.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['agentId'],
        properties: {
        }
      },
      response: {
        200: {
          description: 'Agent details',
          type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string' } }
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.getAgentById);

  fastify.post("/agents", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Create new agent',
      description: 'Create a new agent user. Admin only.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'email', 'phoneNumber', 'password'],
        properties: {
        }
      },
      response: {
        201: {
          description: 'Agent created successfully',
          type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string' } }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.createAgent);

  fastify.put("/agents/:agentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Update agent',
      description: 'Update an existing agent. Admin only.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['agentId'],
        properties: {
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Agent full name' },
          email: { type: 'string', format: 'email', description: 'Agent email' },
          phoneNumber: { type: 'string', description: 'Agent phone number' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], description: 'Agent status' }
        }
      },
      response: {
        200: {
          description: 'Agent updated successfully',
          type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string' } }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.updateAgent);

  fastify.delete("/agents/:agentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Users'],
      summary: 'Delete agent',
      description: 'Delete an agent user. Admin only.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['agentId'],
        properties: {
        }
      },
      response: {
        204: { description: 'Agent deleted successfully' },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.deleteAgent);
};

const controller = require('../controllers/clients.controller')

module.exports = async function (fastify) {
  fastify.get('/clients', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Get all clients',
      description: 'Retrieve a list of all clients. Agents can only see clients they created, while admins can see all clients.',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of clients retrieved successfully',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Client ID' },
              name: { type: 'string', description: 'Client full name' },
              email: { type: 'string', description: 'Client email address' },
              phoneNumber: { type: 'string', description: 'Client phone number' },
              status: {
                type: 'string',
                enum: ['PROSPECT', 'CLIENT'],
                description: 'Client status - PROSPECT for leads, CLIENT for registered users'
              },
              notes: { type: 'string', description: 'Additional notes about the client' },
              provenance: { type: 'string', description: 'How the client found us' },
              userId: { type: 'integer', description: 'Linked user account ID (for CLIENT status)' },
              createdById: { type: 'integer', description: 'ID of user who created this client' },
              createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
              updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
            }
          }
        },
        401: {
          description: 'Unauthorized - invalid or missing token',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden - insufficient permissions',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getAllClients)

  fastify.get('/clients/:clientId', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Get client by ID',
      description: 'Retrieve a specific client by their ID. Agents can only access clients they created.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['clientId'],
        properties: {
          clientId: {
            type: 'integer',
            description: 'Client ID'
          }
        }
      },
      response: {
        200: {
          description: 'Client details retrieved successfully',
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Client ID' },
            name: { type: 'string', description: 'Client full name' },
            email: { type: 'string', description: 'Client email address' },
            phoneNumber: { type: 'string', description: 'Client phone number' },
            status: {
              type: 'string',
              enum: ['PROSPECT', 'CLIENT'],
              description: 'Client status'
            },
            notes: { type: 'string', description: 'Additional notes' },
            provenance: { type: 'string', description: 'How client found us' },
            userId: { type: 'integer', description: 'Linked user account ID' },
            createdById: { type: 'integer', description: 'Creator user ID' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        404: {
          description: 'Client not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getClientById)

  fastify.post('/clients', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Create new client',
      description: 'Create a new client. If status is CLIENT and password is provided, a user account will also be created for portal access.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'email', 'phoneNumber', 'provenance'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            description: 'Client full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Client email address'
          },
          phoneNumber: {
            type: 'string',
            pattern: '^[+\\d\\s\\-()]{7,20}$',
            description: 'Client phone number'
          },
          status: {
            type: 'string',
            enum: ['PROSPECT', 'CLIENT'],
            description: 'Client status - PROSPECT for leads, CLIENT for registered users'
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the client'
          },
          provenance: {
            type: 'string',
            description: 'How the client found us'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Password for client portal access (required when status is CLIENT)'
          }
        }
      },
      response: {
        201: {
          description: 'Client created successfully',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            phoneNumber: { type: 'string' },
            status: { type: 'string' },
            notes: { type: 'string' },
            provenance: { type: 'string' },
            userId: { type: 'integer' },
            createdById: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Bad request - validation error',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.createClient)

  fastify.put('/clients/:clientId', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Update client',
      description: 'Update an existing client. Can convert PROSPECT to CLIENT by providing password. Agents can only update clients they created.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['clientId'],
        properties: {
          clientId: {
            type: 'integer',
            description: 'Client ID to update'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Client full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Client email address'
          },
          phoneNumber: {
            type: 'string',
            description: 'Client phone number'
          },
          status: {
            type: 'string',
            enum: ['PROSPECT', 'CLIENT'],
            description: 'Client status'
          },
          notes: {
            type: 'string',
            description: 'Additional notes'
          },
          provenance: {
            type: 'string',
            description: 'How client found us'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Password for client portal (required when converting to CLIENT status)'
          }
        }
      },
      response: {
        200: {
          description: 'Client updated successfully',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            phoneNumber: { type: 'string' },
            status: { type: 'string' },
            notes: { type: 'string' },
            provenance: { type: 'string' },
            userId: { type: 'integer' },
            createdById: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Bad request',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        404: {
          description: 'Client not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.updateClient)

  fastify.delete('/clients/:clientId', {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Clients'],
      summary: 'Delete client',
      description: 'Delete a client. Agents can only delete clients they created.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['clientId'],
        properties: {
          clientId: {
            type: 'integer',
            description: 'Client ID to delete'
          }
        }
      },
      response: {
        204: {
          description: 'Client deleted successfully'
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        404: {
          description: 'Client not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.deleteClient)
}

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
      description: 'Retrieve a specific client by their ID',
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
          description: 'Client retrieved successfully',
          allOf: [
            { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, status: { type: 'string' } } },
            {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  nullable: true,
                  description: 'Linked user account (for CLIENT status)'
                },
                createdBy: {
                  type: 'object',
                  description: 'User who created this client'
                },
                interestedApartments: {
                  type: 'array',
                  description: 'Properties the client is interested in'
                }
              }
            }
          ]
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
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
            default: 'PROSPECT',
            description: 'Client status. PROSPECT for leads, CLIENT for customers with portal access'
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the client'
          },
          provenance: {
            type: 'string',
            description: 'How the client found us'
          },
          apartmentId: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'ID(s) of apartments the client is interested in'
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
          allOf: [
            { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, status: { type: 'string' } } },
            {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  nullable: true,
                  description: 'Created user account (if status is CLIENT)'
                }
              }
            }
          ]
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } }
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
            description: 'Client status. When changing from PROSPECT to CLIENT, password is required'
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the client'
          },
          provenance: {
            type: 'string',
            description: 'How the client found us'
          },
          apartmentId: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'ID(s) of apartments the client is interested in'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Password for client portal access (required when converting PROSPECT to CLIENT)'
          }
        }
      },
      response: {
        200: {
          description: 'Client updated successfully',
          type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, status: { type: 'string' } }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
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
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.deleteClient)
}

const controller = require("../controllers/activity.controller");

module.exports = async function (fastify) {
  fastify.get("/activity/recent", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Activity'],
      summary: 'Get recent activity',
      description: 'Retrieve recent activity logs and events',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 20,
            description: 'Number of activities to retrieve (default: 10)'
          }
        }
      },
      response: {
        200: {
          description: 'List of recent activities',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Activity ID' },
              type: {
                type: 'string',
                enum: ['CLIENT_CREATED', 'PROPERTY_ASSIGNED', 'PROJECT_CREATED', 'TASK_COMPLETED'],
                description: 'Activity type'
              },
              description: { type: 'string', description: 'Activity description' },
              userId: { type: 'integer', description: 'User who performed the activity' },
              entityId: { type: 'integer', description: 'Related entity ID' },
              entityType: { type: 'string', description: 'Related entity type' },
              createdAt: { type: 'string', format: 'date-time', description: 'Activity timestamp' }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getRecentActivity);

  fastify.get("/monthly-target", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Activity'],
      summary: 'Get monthly target',
      description: 'Get current monthly sales target and progress',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Monthly target information',
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Target ID' },
            target: { type: 'number', description: 'Target amount' },
            current: { type: 'number', description: 'Current progress' },
            percentage: { type: 'number', description: 'Progress percentage' },
            startDate: { type: 'string', format: 'date', description: 'Target start date' },
            endDate: { type: 'string', format: 'date', description: 'Target end date' },
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
        }
      }
    }
  }, controller.getMonthlyTarget);

  fastify.post("/monthly-target", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Activity'],
      summary: 'Set monthly target',
      description: 'Set a new monthly sales target. Admin only.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['target', 'startDate', 'endDate'],
        properties: {
          target: {
            type: 'number',
            minimum: 0,
            description: 'Target sales amount'
          },
          startDate: {
            type: 'string',
            format: 'date',
            description: 'Target start date'
          },
          endDate: {
            type: 'string',
            format: 'date',
            description: 'Target end date'
          }
        }
      },
      response: {
        201: {
          description: 'Monthly target set successfully',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            target: { type: 'number' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
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
        }
      }
    }
  }, controller.setMonthlyTarget);

  fastify.get("/activity", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Activity'],
      summary: 'Get all activity (Admin)',
      description: 'Retrieve all activity logs. Admin only.',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 20,
            description: 'Number of activities to retrieve'
          }
        }
      },
      response: {
        200: {
          description: 'List of all activities',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Activity ID' },
              type: { type: 'string', description: 'Activity type' },
              description: { type: 'string', description: 'Activity description' },
              userId: { type: 'integer', description: 'User who performed the activity' },
              entityId: { type: 'integer', description: 'Related entity ID' },
              entityType: { type: 'string', description: 'Related entity type' },
              createdAt: { type: 'string', format: 'date-time', description: 'Activity timestamp' }
            }
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
        }
      }
    }
  }, controller.getRecentActivity);
};

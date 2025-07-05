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
            default: 10,
            description: 'Number of activities to retrieve'
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
              id: { type: 'integer' },
              type: { type: 'string' },
              description: { type: 'string' },
              userId: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        401: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.getRecentActivity);
  fastify.get(
    "/monthly-target",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            limit: { type: 'integer', minimum: 1, maximum: 20 }
          }
        }
      }
    },
    controller.getMonthlyTarget
  );
  fastify.post(
    "/monthly-target",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
      schema: {
        body: {
          type: 'object',
          properties: {
            target : { type: 'number' },
            startDate: {type : 'string', format: 'date'},
            endDate: {type : 'string', format: 'date'},
          },
          required: ['target', 'startDate', 'endDate']
        }
      }
    },
    controller.setMonthlyTarget
  );
  fastify.get(
    "/activity",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            limit: { type: 'integer', minimum: 1, maximum: 20 }
          }
        }
      }
    },
    controller.getRecentActivity
  );
};

const controller = require("../controllers/activity.controller");

module.exports = async function (fastify) {
  fastify.get(
    "/activity/recent",
    {
      onRequest: [fastify.authenticate],
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

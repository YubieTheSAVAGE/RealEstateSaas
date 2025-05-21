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
            month: { type: 'integer', minimum: 1, maximum: 12 },
            year: { type: 'integer', minimum: 2000, maximum: 2100 },
            target: { type: 'number' }
          },
          required: ['month', 'year', 'target']
        }
      }
    },
    controller.setMonthlyTarget
  );
};

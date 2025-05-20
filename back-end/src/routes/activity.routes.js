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
};

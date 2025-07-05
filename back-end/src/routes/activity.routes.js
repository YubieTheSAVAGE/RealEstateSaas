const controller = require("../controllers/activity.controller");

module.exports = async function (fastify) {
  fastify.get("/activity/recent", {
    onRequest: [fastify.authenticate],
  }, controller.getRecentActivity);
  fastify.get(
    "/monthly-target",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.getMonthlyTarget
  );
  fastify.post(
    "/monthly-target",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.setMonthlyTarget
  );
  fastify.get(
    "/activity",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.getRecentActivity
  );
};

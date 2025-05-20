const controller = require("../controllers/agents.controller");

module.exports = async function (fastify) {
  fastify.get(
    "/agents/top-performing",
    {
      onRequest: [fastify.authenticate],
    },
    controller.getTopPerformingAgents
  );

  fastify.get(
    "/agents",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.getAllAgents
  );

  fastify.get(
    "/agents/:agentId",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.getAgentById
  );

  fastify.post(
    "/agents",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.createAgent
  );

  fastify.put(
    "/agents/:agentId",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.updateAgent
  );

  fastify.delete(
    "/agents/:agentId",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.deleteAgent
  );
};

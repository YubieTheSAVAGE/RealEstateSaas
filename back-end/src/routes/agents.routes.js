const controller = require("../controllers/agents.controller");

module.exports = async function (fastify) {
  fastify.post(
    '/agents',
    {
      onRequest: [fastify.authenticate],
      preHandler: [     
        fastify.isAdmin,
      ],
    },
    controller.createAgent
  )
};
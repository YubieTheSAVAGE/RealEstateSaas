const controller = require('../controllers/clients.controller')

module.exports = async function (fastify) {
  fastify.get(
    '/clients',
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.getAllClients
  )

  fastify.get(
    '/clients/:clientId',
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.getClientById
  )

  fastify.post(
    '/clients',
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.createClient
  )

  fastify.put(
    '/clients/:clientId',
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.updateClient
  )

  fastify.delete(
    '/clients/:clientId',
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.deleteClient
  )
}

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {

  fastify.decorate('isAdmin', async function (request, reply) {
    if (request.user.role !== 'ADMIN') {
      return reply.code(403).send({ error: 'Admin only' })
    }
  })
})
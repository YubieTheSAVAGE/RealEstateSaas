const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {

  fastify.decorate('isAdmin', async function (request, reply) {
    if (request.user.role !== 'ADMIN') {
      return reply.code(403).send({ error: 'Admin only' })
    }
  })

  fastify.decorate('isAgent', async function (request, reply) {
    if (request.user.role !== 'AGENT') {
      return reply.code(403).send({ error: 'Agent only' })
    }
  })

  fastify.decorate('isAgentOrAdmin', async function (request, reply) {
    console.log("🛡️ [Auth] isAgentOrAdmin middleware called");
    console.log("🛡️ [Auth] User role:", request.user?.role);

    if (request.user.role !== 'ADMIN' && request.user.role !== 'AGENT') {
      console.log("❌ [Auth] Access denied - insufficient role:", request.user.role);
      return reply.code(403).send({ error: 'Agent or Admin only' })
    }

    console.log("✅ [Auth] Role authorization passed");
  })
})
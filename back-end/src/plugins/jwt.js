const fp = require("fastify-plugin");
const fastifyJwt = require("@fastify/jwt");

module.exports = fp(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: opts.secret,
    sign: { algorithm: "HS256", expiresIn: "15m" },
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
      if (!request.user || !request.user.id) {
        throw new Error("Invalid token structure");
      }
    } catch (err) {
      request.log.error("Authentication error:", err);
      reply.status(401).send({ error: "Unauthorized" });
    }
  });
});
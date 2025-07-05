const fp = require("fastify-plugin");
const fastifyJwt = require("@fastify/jwt");

module.exports = fp(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: opts.secret,
    sign: { algorithm: "HS256", expiresIn: "15m" },
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      console.log("🔐 [Auth] Authentication middleware called");
      console.log("🔐 [Auth] Request headers:", {
        authorization: request.headers.authorization ? "[PRESENT]" : "[MISSING]",
        'content-type': request.headers['content-type']
      });

      await request.jwtVerify();

      if (!request.user || !request.user.id) {
        console.log("❌ [Auth] Invalid token structure:", request.user);
        throw new Error("Invalid token structure");
      }

      console.log("✅ [Auth] Authentication successful:", {
        id: request.user.id,
        email: request.user.email,
        role: request.user.role
      });
    } catch (err) {
      console.error("💥 [Auth] Authentication error:", err.message);
      request.log.error("Authentication error:", err);
      reply.status(401).send({ error: "Unauthorized" });
    }
  });
});
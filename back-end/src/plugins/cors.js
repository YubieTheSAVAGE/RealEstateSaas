// import fastifyCors from "@fastify/cors";
const fastifyCors = require("@fastify/cors");

module.exports = async function (fastify) {
  fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5555",
        "http://127.0.0.1:3000",
        "https://real-estate-saas-xi.vercel.app/"
      ];

      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });
}

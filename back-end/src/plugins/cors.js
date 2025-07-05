// import fastifyCors from "@fastify/cors";
const fastifyCors = require("@fastify/cors");

module.exports = async function (fastify) {
  fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like cURL, Postman, mobile apps)
      if (!origin) return cb(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001", // Add backend port for testing
        "http://localhost:5555",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://real-estate-saas-xi.vercel.app/"
      ];

      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        console.log(`🚫 [CORS] Blocked origin: ${origin}`);
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });
}

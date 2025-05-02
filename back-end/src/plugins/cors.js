import fastifyCors from "@fastify/cors";

export default async function (fastify) {
  fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5555",
        "http://127.0.0.1:3000",
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
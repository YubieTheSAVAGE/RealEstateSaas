const controller = require("../controllers/auth.controller");

module.exports = async function (fastify) {
  fastify.post("/login", controller.login);
};

const controller = require("../controllers/projects.controller");

module.exports = async function (fastify) {
  fastify.get("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
  }, controller.getAllProjects);

  fastify.get("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
  }, controller.getProjectById);

  fastify.post("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
  }, controller.createProject);

  fastify.put("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
  }, controller.updateProject);

  fastify.delete("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
  }, controller.deleteProject);
};

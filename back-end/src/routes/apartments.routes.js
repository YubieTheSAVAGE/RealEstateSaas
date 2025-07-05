const controller = require("../controllers/apartments.controller");

module.exports = async function (fastify) {

  fastify.get("/projects/:projectId/apartments", {
    onRequest: [fastify.authenticate],
  }, controller.listByProject);

  fastify.post("/projects/:projectId/apartments", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
  }, controller.createApartment);

  fastify.get("/apartments", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
  }, controller.getAllApartments);

  fastify.get("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
  }, controller.getApartmentById);

  fastify.put("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
  }, controller.updateApartment);

  fastify.delete("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
  }, controller.deleteApartment);

  fastify.post("/apartments/:apartmentId/assign", {
    onRequest: [fastify.authenticate],
  }, controller.assignApartment);
};

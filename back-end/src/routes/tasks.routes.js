const controller = require("../controllers/task.controller");

module.exports = async function (fastify) {
  // Task routes
  fastify.get("/tasks", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
  }, controller.getAllTasks);

  fastify.get(
    "/tasks/stats",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.getTasksCount
  );

  fastify.get(
    "/tasks/:id",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.getTaskById
  );

  fastify.post(
    "/tasks",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.createTask
  );

  fastify.put(
    "/tasks/:id",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.updateTask
  );

  fastify.delete(
    "/tasks/:id",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    controller.deleteTask
  );

  fastify.patch(
    "/tasks/:id/status",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.updateTaskStatus
  );

  // Comment routes
  fastify.get(
    "/tasks/:taskId/comments",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.getTaskComments
  );

  fastify.post(
    "/tasks/:taskId/comments",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.addComment
  );

  fastify.delete(
    "/tasks/comments/:commentId",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.deleteComment
  );
  fastify.get(
    "/tasks/user/:userId",
    {
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAgentOrAdmin],
    },
    controller.getTaskByUser
  );
};

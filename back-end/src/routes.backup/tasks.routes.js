const controller = require("../controllers/task.controller");

module.exports = async function (fastify) {
  // Task routes
  fastify.get("/tasks", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Tasks'],
      summary: 'Get all tasks',
      description: 'Retrieve all tasks for agents and admins',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of tasks',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              priority: { type: 'string' },
              dueDate: { type: 'string', format: 'date-time' },
              assignedTo: { type: 'integer' },
              createdBy: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
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

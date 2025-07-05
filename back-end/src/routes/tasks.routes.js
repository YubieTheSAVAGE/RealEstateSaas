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
              id: { type: 'integer', description: 'Task ID' },
              title: { type: 'string', description: 'Task title' },
              description: { type: 'string', description: 'Task description' },
              status: {
                type: 'string',
                enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
                description: 'Task status'
              },
              priority: {
                type: 'string',
                enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
                description: 'Task priority'
              },
              dueDate: { type: 'string', format: 'date-time', description: 'Task due date' },
              assignedTo: { type: 'integer', description: 'Assigned user ID' },
              createdBy: { type: 'integer', description: 'Creator user ID' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getAllTasks);

  fastify.get("/tasks/stats", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Tasks'],
      summary: 'Get task statistics',
      description: 'Get task count and statistics. Admin only.',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Task statistics',
          type: 'object',
          properties: {
            total: { type: 'integer', description: 'Total number of tasks' },
            pending: { type: 'integer', description: 'Number of pending tasks' },
            inProgress: { type: 'integer', description: 'Number of in-progress tasks' },
            completed: { type: 'integer', description: 'Number of completed tasks' },
            cancelled: { type: 'integer', description: 'Number of cancelled tasks' }
          }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getTasksCount);

  fastify.get("/tasks/:id", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Tasks'],
      summary: 'Get task by ID',
      description: 'Retrieve a specific task by its ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'integer',
            description: 'Task ID'
          }
        }
      },
      response: {
        200: {
          description: 'Task details',
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Task ID' },
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Task description' },
            status: { type: 'string', description: 'Task status' },
            priority: { type: 'string', description: 'Task priority' },
            dueDate: { type: 'string', format: 'date-time', description: 'Task due date' },
            assignedTo: { type: 'integer', description: 'Assigned user ID' },
            createdBy: { type: 'integer', description: 'Creator user ID' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        404: {
          description: 'Task not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getTaskById);

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

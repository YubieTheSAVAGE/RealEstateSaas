const controller = require("../controllers/auth.controller");

module.exports = async function (fastify) {
  fastify.post("/login", {
    schema: {
      tags: ['Authentication'],
      summary: 'User login',
      description: 'Authenticate user with email and password to receive JWT token',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password (minimum 6 characters)'
          }
        }
      },
      response: {
        200: {
          description: 'Login successful',
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'User ID' },
                name: { type: 'string', description: 'User full name' },
                email: { type: 'string', description: 'User email' },
                role: {
                  type: 'string',
                  enum: ['ADMIN', 'AGENT', 'CLIENT'],
                  description: 'User role'
                }
              }
            }
          }
        },
        400: {
          description: 'Bad request - missing email or password',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        401: {
          description: 'Unauthorized - invalid credentials',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, controller.login);
};

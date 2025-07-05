const controller = require("../controllers/projects.controller");

module.exports = async function (fastify) {
  fastify.get("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Get all projects',
      description: 'Retrieve a list of all real estate projects with their associated apartments',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of projects retrieved successfully',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Project ID' },
              name: { type: 'string', description: 'Project name' },
              image: { type: 'string', description: 'Project image URL' },
              address: { type: 'string', description: 'Project address' },
              totalSurface: { type: 'integer', description: 'Total surface area in m²' },
              numberOfApartments: { type: 'integer', description: 'Number of apartments' },
              notes: { type: 'string', description: 'Additional notes' },
              latitude: { type: 'number', description: 'Latitude coordinate' },
              longitude: { type: 'number', description: 'Longitude coordinate' },
              folderFees: { type: 'number', description: 'Folder fees amount' },
              commissionPerM2: { type: 'number', description: 'Commission per m²' },
              totalSales: { type: 'number', description: 'Total sales amount' },
              status: {
                type: 'string',
                enum: ['PLANIFICATION', 'CONSTRUCTION', 'DONE'],
                description: 'Project status'
              },
              progress: { type: 'integer', minimum: 0, maximum: 100, description: 'Progress percentage' },
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
  }, controller.getAllProjects);

  fastify.get("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Get project by ID',
      description: 'Retrieve a specific project by its ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: {
          projectId: {
            type: 'integer',
            description: 'Project ID'
          }
        }
      },
      response: {
        200: {
          description: 'Project details retrieved successfully',
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Project ID' },
            name: { type: 'string', description: 'Project name' },
            image: { type: 'string', description: 'Project image URL' },
            address: { type: 'string', description: 'Project address' },
            totalSurface: { type: 'integer', description: 'Total surface area in m²' },
            numberOfApartments: { type: 'integer', description: 'Number of apartments' },
            notes: { type: 'string', description: 'Additional notes' },
            latitude: { type: 'number', description: 'Latitude coordinate' },
            longitude: { type: 'number', description: 'Longitude coordinate' },
            folderFees: { type: 'number', description: 'Folder fees amount' },
            commissionPerM2: { type: 'number', description: 'Commission per m²' },
            totalSales: { type: 'number', description: 'Total sales amount' },
            status: {
              type: 'string',
              enum: ['PLANIFICATION', 'CONSTRUCTION', 'DONE'],
              description: 'Project status'
            },
            progress: { type: 'integer', minimum: 0, maximum: 100, description: 'Progress percentage' },
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
          description: 'Project not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getProjectById);

  fastify.post("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Create new project',
      description: 'Create a new real estate project. Only admins can create projects. Supports file upload for project images.',
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        required: ['name', 'address', 'numberOfApartments', 'totalSurface'],
        properties: {
          name: {
            type: 'string',
            description: 'Project name'
          },
          address: {
            type: 'string',
            description: 'Project address'
          },
          numberOfApartments: {
            type: 'integer',
            minimum: 1,
            description: 'Total number of apartments in the project'
          },
          totalSurface: {
            type: 'integer',
            minimum: 1,
            description: 'Total surface area in m²'
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the project'
          },
          latitude: {
            type: 'number',
            description: 'Latitude coordinate'
          },
          longitude: {
            type: 'number',
            description: 'Longitude coordinate'
          },
          folderFees: {
            type: 'number',
            minimum: 0,
            description: 'Folder fees amount'
          },
          commissionPerM2: {
            type: 'number',
            minimum: 0,
            description: 'Commission per m²'
          },
          totalSales: {
            type: 'number',
            minimum: 0,
            description: 'Total sales amount'
          },
          status: {
            type: 'string',
            enum: ['PLANIFICATION', 'CONSTRUCTION', 'DONE'],
            description: 'Project status'
          },
          progress: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            description: 'Progress percentage'
          }
        }
      },
      response: {
        201: {
          description: 'Project created successfully',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            image: { type: 'string' },
            address: { type: 'string' },
            totalSurface: { type: 'integer' },
            numberOfApartments: { type: 'integer' },
            notes: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            folderFees: { type: 'number' },
            commissionPerM2: { type: 'number' },
            totalSales: { type: 'number' },
            status: { type: 'string' },
            progress: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Bad request - validation error',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: { error: { type: 'string' } }
        },
        403: {
          description: 'Forbidden - admin access required',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.createProject);

  fastify.put("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Update project',
      description: 'Update an existing project. Only admins can update projects.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: {
          projectId: {
            type: 'integer',
            description: 'Project ID to update'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Project name' },
          address: { type: 'string', description: 'Project address' },
          numberOfApartments: { type: 'integer', minimum: 1, description: 'Number of apartments' },
          totalSurface: { type: 'integer', minimum: 1, description: 'Total surface area in m²' },
          notes: { type: 'string', description: 'Additional notes' },
          latitude: { type: 'number', description: 'Latitude coordinate' },
          longitude: { type: 'number', description: 'Longitude coordinate' },
          folderFees: { type: 'number', minimum: 0, description: 'Folder fees amount' },
          commissionPerM2: { type: 'number', minimum: 0, description: 'Commission per m²' },
          totalSales: { type: 'number', minimum: 0, description: 'Total sales amount' },
          status: { type: 'string', enum: ['PLANIFICATION', 'CONSTRUCTION', 'DONE'], description: 'Project status' },
          progress: { type: 'integer', minimum: 0, maximum: 100, description: 'Progress percentage' }
        }
      },
      response: {
        200: {
          description: 'Project updated successfully',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            image: { type: 'string' },
            address: { type: 'string' },
            totalSurface: { type: 'integer' },
            numberOfApartments: { type: 'integer' },
            notes: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            folderFees: { type: 'number' },
            commissionPerM2: { type: 'number' },
            totalSales: { type: 'number' },
            status: { type: 'string' },
            progress: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        400: { description: 'Bad request', type: 'object', properties: { error: { type: 'string' } } },
        401: { description: 'Unauthorized', type: 'object', properties: { error: { type: 'string' } } },
        403: { description: 'Forbidden', type: 'object', properties: { error: { type: 'string' } } },
        404: { description: 'Project not found', type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.updateProject);

  fastify.delete("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Delete project',
      description: 'Delete a project and all its associated apartments. Only admins can delete projects.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: {
          projectId: {
            type: 'integer',
            description: 'Project ID to delete'
          }
        }
      },
      response: {
        204: { description: 'Project deleted successfully' },
        401: { description: 'Unauthorized', type: 'object', properties: { error: { type: 'string' } } },
        403: { description: 'Forbidden', type: 'object', properties: { error: { type: 'string' } } },
        404: { description: 'Project not found', type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.deleteProject);
};

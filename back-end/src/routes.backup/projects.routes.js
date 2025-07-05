const controller = require("../controllers/projects.controller");

module.exports = async function (fastify) {
  fastify.get("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Get all projects',
      description: 'Retrieve a list of all projects with their associated apartments',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of projects retrieved successfully',
          type: 'array',
          items: {
            allOf: [
              { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, address: { type: 'string' } } },
              {
                type: 'object',
                properties: {
                  apartments: {
                    type: 'array',
                    description: 'Apartments in this project',
                    items: { type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } } }
                  }
                }
              }
            ]
          }
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.getAllProjects);

  fastify.get("/projects/:projectId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Get project by ID',
      description: 'Retrieve a specific project by its ID with all associated apartments',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: {
          projectId: {
            type: 'integer',
            description: 'Project ID',
          }
        }
      },
      response: {
        200: {
          description: 'Project retrieved successfully',
          allOf: [
            { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, address: { type: 'string' } } },
            {
              type: 'object',
              properties: {
                apartments: {
                  type: 'array',
                  description: 'Apartments in this project',
                  items: { type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } } }
                }
              }
            }
          ]
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.getProjectById);

  fastify.post("/projects", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Projects'],
      summary: 'Create new project',
      description: 'Create a new real estate project. Only admins can create projects.',
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        required: ['name', 'address', 'numberOfApartments', 'totalSurface'],
        properties: {
          name: {
            type: 'string',
            description: 'Project name',
          },
          address: {
            type: 'string',
            description: 'Project address',
          },
          numberOfApartments: {
            type: 'integer',
            minimum: 1,
            description: 'Total number of apartments in the project',
          },
          totalSurface: {
            type: 'integer',
            minimum: 1,
            description: 'Total surface area in m²',
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the project',
          },
          latitude: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            description: 'Latitude coordinate for map display',
          },
          longitude: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            description: 'Longitude coordinate for map display',
          },
          folderFees: {
            type: 'number',
            minimum: 0,
            description: 'Folder fees amount',
          },
          commissionPerM2: {
            type: 'number',
            minimum: 0,
            description: 'Commission per m²',
          },
          totalSales: {
            type: 'number',
            minimum: 0,
            description: 'Total sales amount',
          },
          status: {
            type: 'string',
            enum: ['PLANIFICATION', 'CONSTRUCTION', 'DONE'],
            default: 'PLANIFICATION',
            description: 'Project status'
          },
          progress: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            default: 0,
            description: 'Project completion percentage'
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Project image file'
          }
        }
      },
      response: {
        201: {
          description: 'Project created successfully',
          type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, address: { type: 'string' } }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } }
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
            description: 'Project ID to update',
          }
        }
      },
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
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
            minimum: -90,
            maximum: 90,
            description: 'Latitude coordinate'
          },
          longitude: {
            type: 'number',
            minimum: -180,
            maximum: 180,
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
            description: 'Project completion percentage'
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Project image file'
          }
        }
      },
      response: {
        200: {
          description: 'Project updated successfully',
          type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, address: { type: 'string' } }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
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
            description: 'Project ID to delete',
          }
        }
      },
      response: {
        204: {
          description: 'Project deleted successfully'
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.deleteProject);
};

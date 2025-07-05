const controller = require("../controllers/apartments.controller");

module.exports = async function (fastify) {

  fastify.get("/projects/:projectId/apartments", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Properties'],
      summary: 'Get apartments by project',
      description: 'Retrieve all apartments/properties within a specific project',
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
          description: 'List of apartments in the project',
          type: 'array',
          items: {
            allOf: [
              { type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } } },
              {
                type: 'object',
                properties: {
                  project: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' }
                    }
                  },
                  client: {
                    type: 'object',
                    nullable: true,
                    description: 'Associated client (if property is reserved/sold)',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      email: { type: 'string' }
                    }
                  }
                }
              }
            ]
          }
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.listByProject);

  fastify.post("/projects/:projectId/apartments", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Create apartment in project',
      description: 'Create a new apartment/property within a specific project. Only admins can create properties.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: {
          projectId: {
            type: 'integer',
            description: 'Project ID where the apartment will be created',
          }
        }
      },
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        required: ['number', 'type', 'price', 'prixType'],
        properties: {
          number: {
            type: 'string',
            description: 'Apartment number/identifier',
          },
          floor: {
            type: 'integer',
            description: 'Floor number (not applicable for LAND, GARAGE, PARKING)',
          },
          type: {
            type: 'string',
            enum: ['APARTMENT', 'DUPLEX', 'VILLA', 'PENTHOUSE', 'STUDIO', 'LOFT', 'TOWNHOUSE', 'STORE', 'OFFICE', 'WAREHOUSE', 'LAND', 'GARAGE', 'PARKING'],
            description: 'Property type'
          },
          area: {
            type: 'number',
            minimum: 0,
            description: 'Area in m²',
          },
          threeDViewUrl: {
            type: 'string',
            format: 'uri',
            description: '3D view URL',
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Total price or price per m² depending on prixType',
          },
          pricePerM2: {
            type: 'number',
            minimum: 0,
            description: 'Price per m² (calculated automatically)',
          },
          zone: {
            type: 'string',
            description: 'Zone/location within project',
          },
          notes: {
            type: 'string',
            description: 'Additional notes about the property'
          },
          prixType: {
            type: 'string',
            enum: ['FIXE', 'M2'],
            description: 'Price type: FIXE for fixed price, M2 for price per square meter'
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Property image file'
          }
        }
      },
      response: {
        201: {
          description: 'Apartment created successfully',
          type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.createApartment);

  fastify.get("/apartments", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Get all apartments',
      description: 'Retrieve all apartments/properties across all projects',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of all apartments',
          type: 'array',
          items: {
            allOf: [
              { type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } } },
              {
                type: 'object',
                properties: {
                  project: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' }
                    }
                  },
                  client: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      email: { type: 'string' }
                    }
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
  }, controller.getAllApartments);

  fastify.get("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Get apartment by ID',
      description: 'Retrieve a specific apartment/property by its ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Apartment ID',
          }
        }
      },
      response: {
        200: {
          description: 'Apartment retrieved successfully',
          allOf: [
            { type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } } },
            {
              type: 'object',
              properties: {
                project: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' }
                  }
                },
                client: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string' }
                  }
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
  }, controller.getApartmentById);

  fastify.put("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Update apartment',
      description: 'Update an existing apartment/property',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Apartment ID to update',
          }
        }
      },
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          number: {
            type: 'string',
            description: 'Apartment number/identifier'
          },
          floor: {
            type: 'integer',
            description: 'Floor number'
          },
          type: {
            type: 'string',
            enum: ['APARTMENT', 'DUPLEX', 'VILLA', 'PENTHOUSE', 'STUDIO', 'LOFT', 'TOWNHOUSE', 'STORE', 'OFFICE', 'WAREHOUSE', 'LAND', 'GARAGE', 'PARKING'],
            description: 'Property type'
          },
          area: {
            type: 'number',
            minimum: 0,
            description: 'Area in m²'
          },
          threeDViewUrl: {
            type: 'string',
            format: 'uri',
            description: '3D view URL'
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Total price or price per m²'
          },
          pricePerM2: {
            type: 'number',
            minimum: 0,
            description: 'Price per m²'
          },
          zone: {
            type: 'string',
            description: 'Zone/location within project'
          },
          notes: {
            type: 'string',
            description: 'Additional notes'
          },
          status: {
            type: 'string',
            enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
            description: 'Property status'
          },
          prixType: {
            type: 'string',
            enum: ['FIXE', 'M2'],
            description: 'Price type'
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'Property image file'
          }
        }
      },
      response: {
        200: {
          description: 'Apartment updated successfully',
          type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.updateApartment);

  fastify.delete("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Delete apartment',
      description: 'Delete an apartment/property. Only admins can delete properties.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Apartment ID to delete',
          }
        }
      },
      response: {
        204: {
          description: 'Apartment deleted successfully'
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        403: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.deleteApartment);

  fastify.post("/apartments/:apartmentId/assign", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Properties'],
      summary: 'Assign apartment to client',
      description: 'Assign an apartment to a client and update its status to RESERVED or SOLD. Creates client account if needed.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Apartment ID to assign',
          }
        }
      },
      body: {
        type: 'object',
        required: ['clientId', 'status'],
        properties: {
          clientId: {
            type: 'integer',
            description: 'Client ID to assign the apartment to',
          },
          status: {
            type: 'string',
            enum: ['RESERVED', 'SOLD'],
            description: 'New status for the apartment',
          }
        }
      },
      response: {
        200: {
          description: 'Apartment assigned successfully',
          type: 'object',
          properties: {
            apartment: { type: 'object', properties: { id: { type: 'integer' }, number: { type: 'string' }, type: { type: 'string' }, status: { type: 'string' } } },
            client: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' }, status: { type: 'string' } } },
            message: {
              type: 'string',
            }
          }
        },
        400: { type: 'object', properties: { error: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.assignApartment);
};

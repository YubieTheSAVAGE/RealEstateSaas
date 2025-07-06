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
            description: 'Project ID'
          }
        }
      },
      response: {
        200: {
          description: 'List of apartments in the project',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Property ID' },
              number: { type: 'string', description: 'Property number/identifier' },
              floor: { type: 'integer', description: 'Floor number (null for LAND, GARAGE, PARKING)' },
              type: {
                type: 'string',
                enum: ['APARTMENT', 'DUPLEX', 'VILLA', 'PENTHOUSE', 'STUDIO', 'LOFT', 'TOWNHOUSE', 'STORE', 'OFFICE', 'WAREHOUSE', 'LAND', 'GARAGE', 'PARKING'],
                description: 'Property type'
              },
              area: { type: 'number', description: 'Area in m²' },
              threeDViewUrl: { type: 'string', description: '3D view URL' },
              price: { type: 'number', description: 'Total price' },
              pricePerM2: { type: 'number', description: 'Price per m²' },
              zone: { type: 'string', description: 'Zone/location within project' },
              image: { type: 'string', description: 'Property image URL' },
              status: {
                type: 'string',
                enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
                description: 'Property status'
              },
              notes: { type: 'string', description: 'Additional notes' },
              prixType: {
                type: 'string',
                enum: ['FIXE', 'M2'],
                description: 'Price type - FIXE for fixed price, M2 for price per m²'
              },
              projectId: { type: 'integer', description: 'Associated project ID' },
              clientId: { type: 'integer', description: 'Associated client ID (if reserved/sold)' },
              userId: { type: 'integer', description: 'Associated user ID' },
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
        404: {
          description: 'Project not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.listByProject);

  fastify.post("/projects/:projectId/apartments", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Create new apartment/property',
      description: 'Create a new apartment/property within a project. Only admins can create properties. Floor field is not required for LAND, GARAGE, PARKING types.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: {
          projectId: {
            type: 'integer',
            description: 'Project ID where the property will be created'
          }
        }
      },
      body: {
        type: 'object',
        required: ['number', 'type', 'price', 'prixType'],
        properties: {
          number: {
            type: 'string',
            description: 'Property number/identifier'
          },
          floor: {
            type: 'integer',
            description: 'Floor number (not required for LAND, GARAGE, PARKING types)'
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
            description: '3D view URL'
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Total price'
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
          prixType: {
            type: 'string',
            enum: ['FIXE', 'M2'],
            description: 'Price type - FIXE for fixed price, M2 for price per m²'
          },
          status: {
            type: 'string',
            enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
            description: 'Property status'
          },
          // Surface measurements for Villa, Apartment, Duplex
          habitable: {
            type: 'number',
            minimum: 0,
            description: 'Habitable surface in m²'
          },
          balcon: {
            type: 'number',
            minimum: 0,
            description: 'Balcony surface in m²'
          },
          terrasse: {
            type: 'number',
            minimum: 0,
            description: 'Terrace surface in m²'
          },
          piscine: {
            type: 'number',
            minimum: 0,
            description: 'Pool surface in m²'
          },
          // Land and Store specific measurements
          totalArea: {
            type: 'number',
            minimum: 0,
            description: 'Total area for Land and Store types in m²'
          },
          mezzanineArea: {
            type: 'number',
            minimum: 0,
            description: 'Mezzanine area for Store type in m²'
          },
          mezzaninePrice: {
            type: 'number',
            minimum: 0,
            description: 'Mezzanine price for Store type'
          },
          // Commission
          commissionPerM2: {
            type: 'number',
            minimum: 0,
            description: 'Commission per m²'
          },
          // Percentage-based pricing for annexes
          prixBalconPct: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Balcony price percentage of habitable m² price'
          },
          prixTerrassePct: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Terrace price percentage of habitable m² price'
          },
          prixPiscine: {
            type: 'number',
            minimum: 0,
            description: 'Pool price per m²'
          },
          // Parking configuration and pricing
          parkingDisponible: {
            type: 'boolean',
            description: 'Whether parking is available'
          },
          parkingInclus: {
            type: 'boolean',
            description: 'Whether parking is included in price'
          },
          prixParking: {
            type: 'number',
            minimum: 0,
            description: 'Parking price'
          }
        }
      },
      response: {
        201: {
          description: 'Property created successfully',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            number: { type: 'string' },
            floor: { type: 'integer' },
            type: { type: 'string' },
            area: { type: 'number' },
            threeDViewUrl: { type: 'string' },
            price: { type: 'number' },
            pricePerM2: { type: 'number' },
            zone: { type: 'string' },
            image: { type: 'string' },
            status: { type: 'string' },
            notes: { type: 'string' },
            prixType: { type: 'string' },
            projectId: { type: 'integer' },
            clientId: { type: 'integer' },
            userId: { type: 'integer' },
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
        },
        404: {
          description: 'Project not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.createApartment);

  fastify.get("/apartments", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Get all apartments/properties',
      description: 'Retrieve all apartments/properties across all projects',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of all properties',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Property ID' },
              number: { type: 'string', description: 'Property number/identifier' },
              floor: { type: 'integer', description: 'Floor number' },
              type: { type: 'string', description: 'Property type' },
              area: { type: 'number', description: 'Area in m²' },
              threeDViewUrl: { type: 'string', description: '3D view URL' },
              price: { type: 'number', description: 'Total price' },
              pricePerM2: { type: 'number', description: 'Price per m²' },
              zone: { type: 'string', description: 'Zone/location within project' },
              image: { type: 'string', description: 'Property image URL' },
              status: { type: 'string', description: 'Property status' },
              notes: { type: 'string', description: 'Additional notes' },
              prixType: { type: 'string', description: 'Price type' },
              projectId: { type: 'integer', description: 'Associated project ID' },
              clientId: { type: 'integer', description: 'Associated client ID' },
              userId: { type: 'integer', description: 'Associated user ID' },
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
  }, controller.getAllApartments);

  fastify.get("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Get apartment/property by ID',
      description: 'Retrieve a specific apartment/property by its ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Property ID'
          }
        }
      },
      response: {
        200: {
          description: 'Property details',
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Property ID' },
            number: { type: 'string', description: 'Property number/identifier' },
            floor: { type: 'integer', description: 'Floor number' },
            type: { type: 'string', description: 'Property type' },
            area: { type: 'number', description: 'Area in m²' },
            threeDViewUrl: { type: 'string', description: '3D view URL' },
            price: { type: 'number', description: 'Total price' },
            pricePerM2: { type: 'number', description: 'Price per m²' },
            zone: { type: 'string', description: 'Zone/location within project' },
            image: { type: 'string', description: 'Property image URL' },
            status: { type: 'string', description: 'Property status' },
            notes: { type: 'string', description: 'Additional notes' },
            prixType: { type: 'string', description: 'Price type' },
            projectId: { type: 'integer', description: 'Associated project ID' },
            clientId: { type: 'integer', description: 'Associated client ID' },
            userId: { type: 'integer', description: 'Associated user ID' },
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
          description: 'Property not found',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.getApartmentById);

  fastify.put("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAgentOrAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Update apartment/property',
      description: 'Update an existing apartment/property',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Property ID to update'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          number: { type: 'string', description: 'Property number/identifier' },
          floor: { type: 'integer', description: 'Floor number' },
          type: {
            type: 'string',
            enum: ['APARTMENT', 'DUPLEX', 'VILLA', 'PENTHOUSE', 'STUDIO', 'LOFT', 'TOWNHOUSE', 'STORE', 'OFFICE', 'WAREHOUSE', 'LAND', 'GARAGE', 'PARKING'],
            description: 'Property type'
          },
          area: { type: 'number', minimum: 0, description: 'Area in m²' },
          threeDViewUrl: { type: 'string', description: '3D view URL' },
          price: { type: 'number', minimum: 0, description: 'Total price' },
          pricePerM2: { type: 'number', minimum: 0, description: 'Price per m²' },
          zone: { type: 'string', description: 'Zone/location within project' },
          notes: { type: 'string', description: 'Additional notes' },
          prixType: { type: 'string', enum: ['FIXE', 'M2'], description: 'Price type' },
          status: { type: 'string', enum: ['AVAILABLE', 'RESERVED', 'SOLD'], description: 'Property status' },
          // Surface measurements for Villa, Apartment, Duplex
          habitable: { type: 'number', minimum: 0, description: 'Habitable surface in m²' },
          balcon: { type: 'number', minimum: 0, description: 'Balcony surface in m²' },
          terrasse: { type: 'number', minimum: 0, description: 'Terrace surface in m²' },
          piscine: { type: 'number', minimum: 0, description: 'Pool surface in m²' },
          // Land and Store specific measurements
          totalArea: { type: 'number', minimum: 0, description: 'Total area for Land and Store types in m²' },
          mezzanineArea: { type: 'number', minimum: 0, description: 'Mezzanine area for Store type in m²' },
          mezzaninePrice: { type: 'number', minimum: 0, description: 'Mezzanine price for Store type' },
          // Commission
          commissionPerM2: { type: 'number', minimum: 0, description: 'Commission per m²' },
          // Percentage-based pricing for annexes
          prixBalconPct: { type: 'number', minimum: 0, maximum: 100, description: 'Balcony price percentage of habitable m² price' },
          prixTerrassePct: { type: 'number', minimum: 0, maximum: 100, description: 'Terrace price percentage of habitable m² price' },
          prixPiscine: { type: 'number', minimum: 0, description: 'Pool price per m²' },
          // Parking configuration and pricing
          parkingDisponible: { type: 'boolean', description: 'Whether parking is available' },
          parkingInclus: { type: 'boolean', description: 'Whether parking is included in price' },
          prixParking: { type: 'number', minimum: 0, description: 'Parking price' }
        }
      },
      response: {
        200: {
          description: 'Property updated successfully',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            number: { type: 'string' },
            floor: { type: 'integer' },
            type: { type: 'string' },
            area: { type: 'number' },
            threeDViewUrl: { type: 'string' },
            price: { type: 'number' },
            pricePerM2: { type: 'number' },
            zone: { type: 'string' },
            image: { type: 'string' },
            status: { type: 'string' },
            notes: { type: 'string' },
            prixType: { type: 'string' },
            projectId: { type: 'integer' },
            clientId: { type: 'integer' },
            userId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        400: { description: 'Bad request', type: 'object', properties: { error: { type: 'string' } } },
        401: { description: 'Unauthorized', type: 'object', properties: { error: { type: 'string' } } },
        403: { description: 'Forbidden', type: 'object', properties: { error: { type: 'string' } } },
        404: { description: 'Property not found', type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.updateApartment);

  fastify.delete("/apartments/:apartmentId", {
    onRequest: [fastify.authenticate],
    preHandler: [fastify.isAdmin],
    schema: {
      tags: ['Properties'],
      summary: 'Delete apartment/property',
      description: 'Delete an apartment/property. Only admins can delete properties.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Property ID to delete'
          }
        }
      },
      response: {
        204: { description: 'Property deleted successfully' },
        401: { description: 'Unauthorized', type: 'object', properties: { error: { type: 'string' } } },
        403: { description: 'Forbidden', type: 'object', properties: { error: { type: 'string' } } },
        404: { description: 'Property not found', type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.deleteApartment);

  fastify.post("/apartments/:apartmentId/assign", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['Properties'],
      summary: 'Assign property to client',
      description: 'Assign a property to a client. Changes property status to RESERVED and creates CLIENT account if needed.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['apartmentId'],
        properties: {
          apartmentId: {
            type: 'integer',
            description: 'Property ID to assign'
          }
        }
      },
      body: {
        type: 'object',
        required: ['clientId'],
        properties: {
          clientId: {
            type: 'integer',
            description: 'Client ID to assign the property to'
          }
        }
      },
      response: {
        200: {
          description: 'Property assigned successfully',
          type: 'object',
          properties: {
            message: { type: 'string' },
            property: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                number: { type: 'string' },
                status: { type: 'string' },
                clientId: { type: 'integer' }
              }
            }
          }
        },
        400: { description: 'Bad request', type: 'object', properties: { error: { type: 'string' } } },
        401: { description: 'Unauthorized', type: 'object', properties: { error: { type: 'string' } } },
        404: { description: 'Property or client not found', type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, controller.assignApartment);
};

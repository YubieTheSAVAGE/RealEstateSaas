// const { setMonthlyTarget } = require("../controllers/activity.controller");
const prisma = require("../utils/prisma");

async function getAllApartments() {
  return prisma.apartment.findMany({
    include: {
      project: true,
      client: true,
      interestedClients: true
    },
  });
}

/**
 * Get recent activity related to apartments
 * Shows the most recently updated apartments with their status
 * @param {number} limit - Maximum number of activities to return
 * @returns {Promise<Array>} - Recent apartment activities
 */
async function getRecentActivity(limit = 5) {
  return prisma.apartment.findMany({
    take: limit,
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      project: true,
      client: true,
    },
  });
}

async function listByProject(projectId) {
  return prisma.apartment.findMany({
    where: { projectId },
    include: { client: true, project: true, interestedClients: true },
  });
}

async function create(projectId, data) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }
  
  // Prepare the apartment data
  const apartmentData = {
    number: parseInt(data.number, 10),
    floor: parseInt(data.floor, 10),
    type: data.type,
    area: parseFloat(data.area),
    threeDViewUrl: data.threeDViewUrl,
    price: parseFloat(data.price),
    status: data.status,
    notes: data.notes,
    pricePerM2: parseFloat(data.pricePerM2),
    zone: data.zone,
    image: data.image,
    project: {
      connect: { id: projectId }
    }
  };
  
  // Only connect to a client if clientId is provided
  if (data.clientId) {
    apartmentData.client = {
      connect: { id: data.clientId }
    };
    if (data.status === "SOLD" || data.status === "RESERVED") {
      await prisma.client.update({
        where: {
          id: data.clientId
        },
        data: {
          status: "CLIENT"
        }
      });
    }
  }

  const apartment = await prisma.apartment.create({
    data: apartmentData
  });
  
  return apartment;
}

async function update(apartmentId, data) {
  const existing = await prisma.apartment.findUnique({
    where: { id: apartmentId },
  });
  if (!existing) {
    const err = new Error("Apartment not found");
    err.statusCode = 404;
    throw err;
  }

  // Prepare update data
  const updateData = {
    number: data.number ? parseInt(data.number, 10) : existing.number,
    floor: data.floor ? parseInt(data.floor, 10) : existing.floor,
    type: data.type || existing.type,
    area: data.area ? parseFloat(data.area) : existing.area,
    threeDViewUrl: data.threeDViewUrl || existing.threeDViewUrl,
    price: data.price ? parseFloat(data.price) : existing.price,
    status: data.status || existing.status,
    notes: data.notes !== undefined ? data.notes : existing.notes,
    pricePerM2: data.pricePerM2 ? parseFloat(data.pricePerM2) : existing.pricePerM2,
    zone: data.zone || existing.zone,
    image: data.image || existing.image,
  };

  // Handle client association based on status
  if (data.status && (data.status !== "SOLD" && data.status !== "RESERVED")) {
    // If status is not SOLD or RESERVED, disconnect any client association
    updateData.client = {
      disconnect: true
    };

  } else if (data.clientId) {
    // If clientId is provided, connect to that client
    updateData.client = {
      connect: { id: parseInt(data.clientId, 10) }
    };
    if (data.status === "SOLD" || data.status === "RESERVED") {
      await prisma.client.update({
        where: {
          id: data.clientId
        },
        data: {
          status: "CLIENT"
        }
      });
    }
  }



  const updated = await prisma.apartment.update({
    where: { id: apartmentId },
    data: updateData,
    include: {
      project: true,
      client: true
    }
  });
  
  return updated;
}

async function remove(apartmentId) {
  const existing = await prisma.apartment.findUnique({
    where: { id: apartmentId },
  });
  if (!existing) {
    const err = new Error("Apartment not found");
    err.statusCode = 404;
    throw err;
  }
  await prisma.apartment.delete({ where: { id: apartmentId } });
}

async function assignToClient(apartmentId, clientId, user) {
  const apartment = await prisma.apartment.findUnique({
    where: { id: apartmentId },
  });
  if (!apartment) {
    const err = new Error("Apartment not found");
    err.statusCode = 404;
    throw err;
  }
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    const err = new Error("Client not found");
    err.statusCode = 404;
    throw err;
  }

  const updated = await prisma.apartment.update({
    where: { id: apartmentId },
    data: { clientId },
  });
  return updated;
}

async function getApartmentById(apartmentId) {
  const apartment = await prisma.apartment.findUnique({
    where: { id: apartmentId },
    include: {
      project: true,
      client: true,
      interestedClients: true,
    },
  });
  if (!apartment) {
    const err = new Error("Apartment not found");
    err.statusCode = 404;
    throw err;
  }
  return apartment;
}

async function getMonthlyTarget() {
  const date = new Date();
  // If no date is provided, use current date
  const targetDate = date ? new Date(date) : new Date();
  
  // Try to find a target where the provided date falls between startDate and endDate
  let target = await prisma.monthlyTarget.findFirst({
    where: {
      startDate: { lte: targetDate },
      endDate: { gte: targetDate }
    }
  });
  
  // If no target found for the exact period, find the closest one
  if (!target) {
    // Get all targets
    const allTargets = await prisma.monthlyTarget.findMany({
      orderBy: { startDate: 'desc' }
    });
    
    if (allTargets.length > 0) {
      // Find the closest target by date proximity
      target = allTargets.reduce((closest, current) => {
        const currentStart = new Date(current.startDate);
        const closestStart = closest ? new Date(closest.startDate) : null;
        
        // If no closest yet, use current
        if (!closest) return current;
        
        // Calculate date differences
        const currentDiff = Math.abs(currentStart.getTime() - targetDate.getTime());
        const closestDiff = Math.abs(closestStart.getTime() - targetDate.getTime());
        
        // Return the closest one
        return currentDiff < closestDiff ? current : closest;
      }, null);
    }
  }
  
  return target;
}


async function setMonthlyTarget(target, startDate, endDate) {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  const existingTarget = await prisma.monthlyTarget.findFirst({
    where: {
      startDate: { gte: startDateObj, lte: endDateObj },
    },
  });
  if (existingTarget) {
    const err = new Error("Monthly target already exists for the given date range");
    err.statusCode = 400;
    throw err;
  }
  const newTarget = await prisma.monthlyTarget.create({
    data: {
      target,
      startDate,
      endDate,
    },
  });
  return newTarget;

}

module.exports = {
  getAllApartments,
  listByProject,
  create,
  update,
  remove,
  assignToClient,
  getRecentActivity,
  getApartmentById,
  getMonthlyTarget,
  setMonthlyTarget,
};

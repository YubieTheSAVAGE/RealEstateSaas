// const { setMonthlyTarget } = require("../controllers/activity.controller");
const prisma = require("../utils/prisma");

async function getAllApartments() {
  return prisma.apartment.findMany({
    include: {
      project: true,
      client: true,
      interestedClients: true,
      user: true,
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
  
  // Validate required fields
  if (!data.price || isNaN(parseFloat(data.price))) {
    const err = new Error("Price is required and must be a valid number");
    err.statusCode = 400;
    throw err;
  }

  // Define property types that can have floors
  const typesWithFloor = [
    "APARTMENT", "DUPLEX", "VILLA", "PENTHOUSE",
    "STUDIO", "LOFT", "TOWNHOUSE", "OFFICE", "WAREHOUSE"
  ];

  // Prepare the apartment data
  const apartmentData = {
    number: data.number,
    floor: typesWithFloor.includes(data.type) && data.floor ? parseInt(data.floor, 10) : null,
    type: data.type,
    area: data.area ? parseFloat(data.area) : null,
    threeDViewUrl: data.threeDViewUrl || null,
    price: parseFloat(data.price),
    status: data.status,
    notes: data.notes || null,
    pricePerM2: data.pricePerM2 ? parseFloat(data.pricePerM2) : null,
    prixType: data.prixType || "FIXE",
    zone: data.zone || null,
    image: data.image || null,
    // Surface measurements for Villa, Apartment, Duplex
    habitable: data.habitable ? parseFloat(data.habitable) : null,
    balcon: data.balcon ? parseFloat(data.balcon) : null,
    terrasse: data.terrasse ? parseFloat(data.terrasse) : null,
    piscine: data.piscine ? parseFloat(data.piscine) : null,
    // Land and Store specific measurements
    totalArea: data.totalArea ? parseFloat(data.totalArea) : null,
    mezzanineArea: data.mezzanineArea ? parseFloat(data.mezzanineArea) : null,
    mezzaninePrice: data.mezzaninePrice ? parseFloat(data.mezzaninePrice) : null,
    // Commission
    commissionPerM2: data.commissionPerM2 ? parseFloat(data.commissionPerM2) : null,
    // Percentage-based pricing for annexes
    prixBalconPct: data.prixBalconPct ? parseFloat(data.prixBalconPct) : null,
    prixTerrassePct: data.prixTerrassePct ? parseFloat(data.prixTerrassePct) : null,
    prixPiscine: data.prixPiscine ? parseFloat(data.prixPiscine) : null,
    // Parking configuration and pricing
    parkingDisponible: data.parkingDisponible || false,
    parkingInclus: data.parkingInclus || false,
    prixParking: data.prixParking ? parseFloat(data.prixParking) : null,
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
    number: data.number ? data.number : existing.number,
    floor: data.floor ? parseInt(data.floor, 10) : existing.floor,
    type: data.type || existing.type,
    area: data.area ? parseFloat(data.area) : existing.area,
    threeDViewUrl: data.threeDViewUrl || existing.threeDViewUrl,
    price: data.price ? parseFloat(data.price) : existing.price,
    status: data.status || existing.status,
    notes: data.notes !== undefined ? data.notes : existing.notes,
    pricePerM2: data.pricePerM2 ? parseFloat(data.pricePerM2) : existing.pricePerM2,
    prixType: data.prixType || existing.prixType,
    zone: data.zone || existing.zone,
    image: data.image || existing.image,
    // Surface measurements for Villa, Apartment, Duplex
    habitable: data.habitable !== undefined ? (data.habitable ? parseFloat(data.habitable) : null) : existing.habitable,
    balcon: data.balcon !== undefined ? (data.balcon ? parseFloat(data.balcon) : null) : existing.balcon,
    terrasse: data.terrasse !== undefined ? (data.terrasse ? parseFloat(data.terrasse) : null) : existing.terrasse,
    piscine: data.piscine !== undefined ? (data.piscine ? parseFloat(data.piscine) : null) : existing.piscine,
    // Land and Store specific measurements
    totalArea: data.totalArea !== undefined ? (data.totalArea ? parseFloat(data.totalArea) : null) : existing.totalArea,
    mezzanineArea: data.mezzanineArea !== undefined ? (data.mezzanineArea ? parseFloat(data.mezzanineArea) : null) : existing.mezzanineArea,
    mezzaninePrice: data.mezzaninePrice !== undefined ? (data.mezzaninePrice ? parseFloat(data.mezzaninePrice) : null) : existing.mezzaninePrice,
    // Commission
    commissionPerM2: data.commissionPerM2 !== undefined ? (data.commissionPerM2 ? parseFloat(data.commissionPerM2) : null) : existing.commissionPerM2,
    // Percentage-based pricing for annexes
    prixBalconPct: data.prixBalconPct !== undefined ? (data.prixBalconPct ? parseFloat(data.prixBalconPct) : null) : existing.prixBalconPct,
    prixTerrassePct: data.prixTerrassePct !== undefined ? (data.prixTerrassePct ? parseFloat(data.prixTerrassePct) : null) : existing.prixTerrassePct,
    prixPiscine: data.prixPiscine !== undefined ? (data.prixPiscine ? parseFloat(data.prixPiscine) : null) : existing.prixPiscine,
    // Parking configuration and pricing
    parkingDisponible: data.parkingDisponible !== undefined ? data.parkingDisponible : existing.parkingDisponible,
    parkingInclus: data.parkingInclus !== undefined ? data.parkingInclus : existing.parkingInclus,
    prixParking: data.prixParking !== undefined ? (data.prixParking ? parseFloat(data.prixParking) : null) : existing.prixParking,
  };

  // Handle client association based on status
  if (data.status && (data.status !== "SOLD" && data.status !== "RESERVED")) {
    // If status is not SOLD or RESERVED, disconnect any client association
    updateData.client = {
      disconnect: true
    };
    updateData.user = {
      disconnect: true
    };

  } else if (data.clientId) {
    // If clientId is provided, connect to that client
    updateData.client = {
      connect: { id: parseInt(data.clientId, 10) }
    };
    updateData.user = {
      connect: { id: parseInt(data.user.id, 10) }
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
      client: true,
      user: true,
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
  const currentDate = new Date(); // Always use current system time

  // Try to find a target where the current date is between startDate and endDate
  let target = await prisma.monthlyTarget.findFirst({
    where: {
      startDate: { lte: currentDate },
      endDate: { gte: currentDate },
    },
  });

  // If no exact match, find the closest target (by proximity to current date)
  if (!target) {
    const allTargets = await prisma.monthlyTarget.findMany({
      orderBy: { startDate: 'desc' },
    });

    if (allTargets.length > 0) {
      target = allTargets.reduce((closest, current) => {
        const currentDiff = Math.abs(new Date(current.startDate).getTime() - currentDate.getTime());
        const closestDiff = Math.abs(new Date(closest.startDate).getTime() - currentDate.getTime());
        return currentDiff < closestDiff ? current : closest;
      }, allTargets[0]); // Start with the first target as initial "closest"
    }
  }

  return target;
}

async function setMonthlyTarget(target, startDate, endDate) {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  // Check if there's a monthly target for the same month and year
  const existingTarget = await prisma.monthlyTarget.findFirst({
    where: {
      startDate: {
        gte: new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1),
        lt: new Date(startDateObj.getFullYear(), startDateObj.getMonth() + 1, 1)
      }
    },
  });

  // If target exists for the same month, update it
  if (existingTarget) {
    const updatedTarget = await prisma.monthlyTarget.update({
      where: { id: existingTarget.id },
      data: {
        target,
        startDate,
        endDate,
        updatedAt: new Date()
      },
    });
    return updatedTarget;
  }
  
  // If no target exists for this month, create a new one
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

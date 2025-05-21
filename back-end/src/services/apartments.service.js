// const { setMonthlyTarget } = require("../controllers/activity.controller");
const prisma = require("../utils/prisma");

async function getAllApartments() {
  return prisma.apartment.findMany({
    include: {
      project: true,
      client: true,
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
    include: { client: true },
  });
}

async function create(projectId, data) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }
  const apartment = await prisma.apartment.create({
    data: {
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
      },
      client: {
        connect: { id: data.clientId }
      },
    },
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
  const updated = await prisma.apartment.update({
    where: { id: apartmentId },
    data: {
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
      client: {
        connect: { id: data.clientId }
      },
    },
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
  const target = await prisma.monthlyTarget.findFirst({
    orderBy: { month: 'desc' },
  });
  return target;
}

async function setMonthlyTarget(month, year, target) {
  const existing = await prisma.monthlyTarget.findFirst({
    where: { month: String(month), year: Number(year) },
  });
  if (existing) {
    const updated = await prisma.monthlyTarget.update({
      where: { id: existing.id },
      data: { target: Number(target) },
    });
    return updated;
  } else {
    const newTarget = await prisma.monthlyTarget.create({
      data: { month: String(month), year: Number(year), target: Number(target) },
    });
    return newTarget;
  }
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

const prisma = require("../utils/prisma");

async function getAllApartments() {
  return prisma.apartment.findMany({
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
      number: data.number,
      floor: data.floor,
      type: data.type,
      area: data.area,
      threeDViewUrl: data.threeDViewUrl,
      price: data.price,
      status: data.status,
      notes: data.notes,
      projectId,
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
      number: data.number,
      floor: data.floor,
      type: data.type,
      area: data.area,
      threeDViewUrl: data.threeDViewUrl,
      price: data.price,
      status: data.status,
      notes: data.notes,
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

module.exports = {
  getAllApartments,
  listByProject,
  create,
  update,
  remove,
  assignToClient,
};

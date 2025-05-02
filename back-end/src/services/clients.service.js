const prisma = require("../utils/prisma");

async function findAllClients(user) {
  return prisma.client.findMany({
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });
}

async function findClientById(clientId, user) {
 
  const client = await prisma.client.findUnique(
    {
      where: { id: clientId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    }
  );
  if (!client) {
    const err = new Error("Client not found");
    err.statusCode = 404;
    throw err;
  }
  return client;
}


async function addNewClient(data, user) {
  const existing = await prisma.client.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw new Error("Email already in use");
  }

  const client = await prisma.client.create({
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      status: data.status || "ACTIVE",
      notes: data.notes,
      createdById: user.id,
    },
  });
  return client;
}

async function updateClient(clientId, data, user) {
  const existing = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, email: true, createdById: true },
  });
  if (!existing) {
    const err = new Error("Client not found");
    err.statusCode = 404;
    throw err;
  }
  if (user.role === "AGENT" && existing.createdById !== user.id) {
    const err = new Error("Not authorized to update this client");
    err.statusCode = 403;
    throw err;
  }

  if (data.email && data.email !== existing.email) {
    const emailTaken = await prisma.client.findUnique({
      where: { email: data.email },
    });
    if (emailTaken) {
      const err = new Error("Email already in use");
      err.statusCode = 400;
      throw err;
    }
  }

  const updated = await prisma.client.update({
    where: { id: clientId },
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      status: data.status,
      notes: data.notes,
    },
  });
  return updated;
}

async function removeClient(clientId, user) {
  const existing = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, createdById: true },
  });
  if (!existing) {
    const err = new Error("Client not found");
    err.statusCode = 404;
    throw err;
  }
  if (user.role === "AGENT" && existing.createdById !== user.id) {
    const err = new Error("Not authorized to delete this client");
    err.statusCode = 403;
    throw err;
  }

  await prisma.client.delete({ where: { id: clientId } });
}

module.exports = {
  findAllClients,
  findClientById,
  addNewClient,
  updateClient,
  removeClient,
};

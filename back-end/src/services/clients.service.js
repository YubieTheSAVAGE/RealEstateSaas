const prisma = require("../utils/prisma");

async function findAllClients(user) {
  return prisma.client.findMany({
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      apartments: {
        include: {
          project: {
            select: { name: true },
          },
        },
      },
      interestedApartments: {
        include: {
          project: {
            select: { name: true },
          },
        },
      },
    },
  });
}

async function findClientById(clientId, user) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      interestedApartments: {
        include: {
          project: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
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
  
  // Prepare data for client creation
  const clientData = {
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    status: data.status || "CLIENT",
    notes: data.notes,
    provenance: data.provenance,
    createdById: user.id,

  };

  // Handle the apartment connection if an apartmentId is provided
  // if (data.apartmentId) {
  //   clientData.apartments = {
  //     connect: { id: parseInt(data.apartmentId) }
  //   };
  // }

  // Process interested apartments
  if (data.interestedApartments) {
    try {
      const interestedApartments = data.interestedApartments;
      if (Array.isArray(interestedApartments) && interestedApartments.length > 0) {
        clientData.interestedApartments = {
          connect: interestedApartments.map(apt => ({ id: parseInt(apt) }))
        };
      }
    } catch (err) {
      console.error("Error parsing interestedApartments:", err);
    }
  }
  
  // Create client with all related data
  const client = await prisma.client.create({
    data: clientData,
    include: {
      apartments: true,
      interestedApartments: {
        include: {
          project: {
            select: { id: true, name: true }
          }
        }
      },
    }
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
      provenance: data.provenance,
      interestedApartments: data.apartmentId ? {
        connect: { id: parseInt(data.apartmentId) }
      } : undefined
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

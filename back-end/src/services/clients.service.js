const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

async function findAllClients(user) {
  return prisma.client.findMany({
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      },
      interestedApartments: {
        include: {
          project: {
            select: { id: true, name: true },
          },
        },
      },
      apartments: {
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
  console.log("🎯 [Service] addNewClient called");
  console.log("📋 [Service] Data received:", { ...data, password: data.password ? "[REDACTED]" : undefined });
  console.log("👤 [Service] Created by user:", { id: user.id, email: user.email });

  // Debug: Check what enum values are available in the database
  try {
    const enumQuery = await prisma.$queryRaw`
      SELECT unnest(enum_range(NULL::ClientStatus)) as status_value;
    `;
    console.log("🔍 [Service] Available ClientStatus enum values:", enumQuery);
  } catch (enumError) {
    console.error("⚠️ [Service] Error checking enum values:", enumError);
  }

  console.log("🔍 [Service] Checking for existing client with email:", data.email);

  // First, let's try to query existing clients to see if the database connection works
  try {
    const existingClients = await prisma.client.findMany({
      take: 1,
      select: { id: true, status: true }
    });
    console.log("📊 [Service] Sample existing clients:", existingClients);
  } catch (queryError) {
    console.error("⚠️ [Service] Error querying existing clients:", queryError);
  }

  const existing = await prisma.client.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    console.log("❌ [Service] Email already in use by existing client:", existing.id);
    throw new Error("Email already in use");
  }

  // Check if email is already used by a User
  console.log("🔍 [Service] Checking for existing user with email:", data.email);
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    console.log("❌ [Service] Email already in use by existing user:", existingUser.id);
    throw new Error("Email already in use by another user");
  }

  let createdUser = null;

  // If creating a CLIENT (not PROSPECT), create a User account
  if (data.status === "CLIENT" && data.password) {
    console.log("🔐 [Service] Creating User account for CLIENT status");
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    console.log("🔐 [Service] Password hashed successfully");

    createdUser = await prisma.user.create({
      data: {
        name: data.name || `${data.firstName} ${data.lastName}`,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: "CLIENT",
        passwordHash,
        status: "ACTIVE"
      }
    });
    console.log("✅ [Service] User account created:", { id: createdUser.id, email: createdUser.email, role: createdUser.role });
  } else {
    console.log("ℹ️ [Service] Skipping User account creation (PROSPECT status or no password)");
  }

  // Prepare data for client creation
  let statusValue = data.status || "PROSPECT";
  console.log("🔍 [Service] Status value being used:", statusValue, "Type:", typeof statusValue);

  // Validate and normalize status value to ensure it matches database enum
  const validStatuses = ["PROSPECT", "CLIENT"];
  if (!validStatuses.includes(statusValue)) {
    console.log("⚠️ [Service] Invalid status value, defaulting to PROSPECT:", statusValue);
    statusValue = "PROSPECT";
  }

  // Try to query the database to check if the enum values are correct
  try {
    console.log("🔍 [Service] Testing database enum values...");
    const testQuery = await prisma.$queryRaw`
      SELECT enumlabel FROM pg_enum
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ClientStatus')
      ORDER BY enumsortorder;
    `;
    console.log("🔍 [Service] Database ClientStatus enum values:", testQuery);
  } catch (enumError) {
    console.error("⚠️ [Service] Error checking database enum values:", enumError);
  }

  const clientData = {
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.name || `${data.firstName} ${data.lastName}`, // Computed name for backward compatibility
    email: data.email,
    phoneNumber: data.phoneNumber,
    whatsappNumber: data.whatsappNumber || null,
    status: statusValue,
    notes: data.notes,
    provenance: data.provenance,
    createdById: user.id,
    userId: createdUser ? createdUser.id : null, // Link to User if created
  };

  console.log("📋 [Service] Client data prepared:", { ...clientData, userId: clientData.userId || "null" });

  // Handle the apartment connection if an apartmentId is provided
  // if (data.apartmentId) {
  //   clientData.apartments = {
  //     connect: { id: parseInt(data.apartmentId) }
  //   };
  // }

  // Process interested apartments
  console.log("🏠 [Service] Processing interested apartments:", data.interestedApartments);
  if (data.interestedApartments) {
    try {
      const interestedApartments = data.interestedApartments;
      if (Array.isArray(interestedApartments) && interestedApartments.length > 0) {
        console.log("🏠 [Service] Connecting multiple apartments:", interestedApartments);
        clientData.interestedApartments = {
          connect: interestedApartments.map(apt => ({ id: parseInt(apt) }))
        };
      } else {
        console.log("🏠 [Service] Connecting single apartment:", interestedApartments);
        clientData.interestedApartments = {
          connect: interestedApartments ? [{ id: parseInt(interestedApartments) }] : [],
        };
      }
    } catch (err) {
      console.error("💥 [Service] Error parsing interestedApartments:", err);
    }
  } else {
    console.log("ℹ️ [Service] No interested apartments provided");
  }
  
  // Create client with all related data
  console.log("💾 [Service] Creating client in database...");
  console.log("💾 [Service] Client data being sent to database:", JSON.stringify(clientData, null, 2));

  let client;
  try {
    client = await prisma.client.create({
      data: clientData,
      include: {
        apartments: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        },
        interestedApartments: {
          include: {
            project: {
              select: { id: true, name: true }
            }
          }
        },
      }
    });
  } catch (createError) {
    console.error("💥 [Service] Error creating client with status:", statusValue);
    console.error("💥 [Service] Error details:", createError);

    // If the error is related to enum values, try with CLIENT status instead
    if (createError.message.includes('invalid input value for enum') && statusValue === "PROSPECT") {
      console.log("🔄 [Service] Retrying with CLIENT status instead of PROSPECT...");
      const fallbackClientData = { ...clientData, status: "CLIENT" };

      try {
        client = await prisma.client.create({
          data: fallbackClientData,
          include: {
            apartments: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true
              }
            },
            interestedApartments: {
              include: {
                project: {
                  select: { id: true, name: true }
                }
              }
            },
          }
        });
        console.log("✅ [Service] Client created successfully with CLIENT status as fallback");
      } catch (fallbackError) {
        console.error("💥 [Service] Fallback also failed:", fallbackError);
        throw fallbackError;
      }
    } else {
      throw createError;
    }
  }

  console.log("✅ [Service] Client created successfully:", {
    id: client.id,
    name: client.name,
    email: client.email,
    status: client.status,
    hasUser: !!client.user,
    interestedApartmentsCount: client.interestedApartments?.length || 0
  });

  return client;
}

async function updateClient(clientId, data, user) {
  console.log("🎯 [Service] updateClient called");
  console.log("📋 [Service] Data received:", { ...data, password: data.password ? "[REDACTED]" : undefined });
  console.log("👤 [Service] Updated by user:", { id: user.id, email: user.email });

  const existing = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, email: true, createdById: true, status: true, userId: true },
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

  console.log("📋 [Service] Existing client:", existing);

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

  // Handle PROSPECT to CLIENT conversion
  let createdUser = null;
  if (data.status === "CLIENT" && existing.status === "PROSPECT" && !existing.userId) {
    console.log("🔄 [Service] Converting PROSPECT to CLIENT - creating User account");

    if (!data.password) {
      const err = new Error("Password is required when converting PROSPECT to CLIENT");
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    console.log("🔐 [Service] Password hashed successfully");

    // Get current client data for User creation
    const currentClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: { firstName: true, lastName: true, name: true, email: true, phoneNumber: true }
    });

    createdUser = await prisma.user.create({
      data: {
        name: data.name || currentClient.name || `${currentClient.firstName} ${currentClient.lastName}`,
        email: data.email || currentClient.email,
        phoneNumber: data.phoneNumber || currentClient.phoneNumber,
        role: "CLIENT",
        passwordHash,
        status: "ACTIVE"
      }
    });
    console.log("✅ [Service] User account created for CLIENT conversion:", { id: createdUser.id, email: createdUser.email, role: createdUser.role });
  }

  // Prepare update data - only include fields that are provided
  const clientData = {};

  if (data.firstName !== undefined) clientData.firstName = data.firstName;
  if (data.lastName !== undefined) clientData.lastName = data.lastName;
  if (data.name !== undefined) clientData.name = data.name;
  if (data.email !== undefined) clientData.email = data.email;
  if (data.phoneNumber !== undefined) clientData.phoneNumber = data.phoneNumber;
  if (data.whatsappNumber !== undefined) clientData.whatsappNumber = data.whatsappNumber;
  if (data.status !== undefined) clientData.status = data.status;
  if (data.notes !== undefined) clientData.notes = data.notes;
  if (data.provenance !== undefined) clientData.provenance = data.provenance;

  // Link to User if created during PROSPECT to CLIENT conversion
  if (createdUser) {
    clientData.userId = createdUser.id;
  }

  console.log("Interested apartments data:", data.interestedApartments);
  if (data.interestedApartments) {
    try {
      const interestedApartments = data.interestedApartments;
      if (Array.isArray(interestedApartments) && interestedApartments.length > 0) {
        console.log("Updating interested apartments:", interestedApartments);
        clientData.interestedApartments = {
          set: [], // disconnect all existing interested apartments
          connect: interestedApartments.map(apt => ({ id: parseInt(apt) })),
        };
      }else
      {
        clientData.interestedApartments = {
          set: [], // disconnect all existing interested apartments if empty
          connect: interestedApartments ? [{ id: parseInt(interestedApartments) }] : [],
        };
      }
    } catch (err) {
      console.error("Error parsing interestedApartments:", err);
    }
  }
  
  const updated = await prisma.client.update({
    where: { id: clientId },
    data: clientData,
    include: {
      apartments: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      },
      interestedApartments: {
        include: {
          project: {
            select: { id: true, name: true }
          }
        }
      },
    }
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
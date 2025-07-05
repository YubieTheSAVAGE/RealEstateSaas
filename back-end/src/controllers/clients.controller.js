const clientService = require("../services/clients.service");
const {
  validateEmail,
  validatePhoneNumber,
  isPositiveInt,
} = require("../utils/helpers");

const ALLOWED_STATUSES = ["CLIENT", "PROSPECT"];

async function getAllClients(request, reply) {
  try {
    const clients = await clientService.findAllClients(request.user);
    return reply.send(clients);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function getClientById(request, reply) {
  try {
    const clientId = parseInt(request.params.clientId, 10);
    if (!isPositiveInt(clientId)) {
      return reply
        .code(400)
        .send({ error: "clientId must be a positive integer" });
    }

    const client = await clientService.findClientById(clientId, request.user);
    return reply.send(client);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function createClient(request, reply) {
  try {
    console.log("🎯 [Backend] POST /api/clients - Client creation started");
    console.log("👤 [Backend] User:", { id: request.user?.id, email: request.user?.email, role: request.user?.role });
    console.log("📋 [Backend] Request body:", request.body);
    console.log("📁 [Backend] Request files:", request.files ? Object.keys(request.files) : "No files");

    const { name, email, phoneNumber, status, notes, provenance, apartmentId, password } = request.body;

    console.log("🔍 [Backend] Extracted fields:", {
      name, email, phoneNumber, status, notes, provenance, apartmentId, password: password ? "[REDACTED]" : undefined
    });

    if (typeof name !== "string" || name.trim() === "") {
      console.log("❌ [Backend] Validation failed: Name is required");
      return reply
        .code(400)
        .send({ error: "Name is required and must be a non-empty string" });
    }
    if (!validateEmail(email)) {
      console.log("❌ [Backend] Validation failed: Invalid email format");
      return reply.code(400).send({ error: "Valid email is required" });
    }
    if (!validatePhoneNumber(phoneNumber)) {
      console.log("❌ [Backend] Validation failed: Invalid phone number format");
      return reply.code(400).send({ error: "Valid phoneNumber is required" });
    }

    if (provenance !== undefined && typeof provenance !== "string") {
      console.log("❌ [Backend] Validation failed: Invalid provenance type");
      return reply
        .code(400)
        .send({ error: "provenance must be a string" });
    }

    let clientStatus = "PROSPECT";
    if (status !== undefined) {
      console.log("🔍 [Backend] Status received:", status, "Type:", typeof status, "Value:", JSON.stringify(status));
      console.log("🔍 [Backend] Allowed statuses:", ALLOWED_STATUSES);
      console.log("🔍 [Backend] Status check result:", ALLOWED_STATUSES.includes(status));

      if (!ALLOWED_STATUSES.includes(status)) {
        console.log("❌ [Backend] Validation failed: Invalid status", status);
        console.log("❌ [Backend] Full request body:", JSON.stringify(request.body, null, 2));
        return reply
          .code(400)
          .send({
            error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}. Received: "${status}" (${typeof status})`,
          });
      }
      clientStatus = status;
    }

    console.log("✅ [Backend] Basic validation passed, client status:", clientStatus);

    // If creating a CLIENT (not PROSPECT), password is required
    if (clientStatus === "CLIENT") {
      console.log("🔐 [Backend] CLIENT status detected, validating password");
      if (!password || typeof password !== "string" || password.trim().length < 6) {
        console.log("❌ [Backend] Password validation failed");
        return reply
          .code(400)
          .send({ error: "Password is required and must be at least 6 characters for CLIENT status" });
      }
      console.log("✅ [Backend] Password validation passed");
    }

    console.log("🚀 [Backend] Calling clientService.addNewClient");
    const client = await clientService.addNewClient(
      {
        name: name.trim(),
        email,
        phoneNumber,
        status: clientStatus,
        notes,
        provenance,
        interestedApartments: apartmentId,
        password: clientStatus === "CLIENT" ? password : undefined
      },
      request.user
    );

    console.log("✅ [Backend] Client created successfully:", { id: client.id, email: client.email, status: client.status });
    return reply.code(201).send(client);
  } catch (err) {
    console.error("💥 [Backend] Error in createClient:", err);
    console.error("💥 [Backend] Error stack:", err.stack);
    console.error("💥 [Backend] Request body that caused error:", request.body);
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function updateClient(request, reply) {
  try {
    const clientId = parseInt(request.params.clientId, 10);
    if (!isPositiveInt(clientId)) {
      return reply
        .code(400)
        .send({ error: "clientId must be a positive integer" });
    }

    const { name, email, phoneNumber, status, notes, provenance, apartmentId, password } = request.body;

    console.log("🔍 [Backend] Update client request:", {
      clientId, name, email, phoneNumber, status, notes, provenance,
      apartmentId, password: password ? "[REDACTED]" : undefined
    });

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return reply
          .code(400)
          .send({ error: "name must be a non-empty string" });
      }
      // name = name.trim();
    }
    if (email !== undefined && !validateEmail(email)) {
      return reply.code(400).send({ error: "email is invalid" });
    }
    if (
      phoneNumber !== undefined &&
      !validatePhoneNumber(phoneNumber)
    ) {
      return reply.code(400).send({ error: "phoneNumber is invalid" });
    }
    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
      return reply
        .code(400)
        .send({
          error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        });
    }
    if (notes !== undefined && typeof notes !== "string") {
      return reply.code(400).send({ error: "notes must be a string" });
    }

    // Validate password if provided (for PROSPECT to CLIENT conversion)
    if (password !== undefined) {
      if (typeof password !== "string" || password.trim().length < 6) {
        return reply
          .code(400)
          .send({ error: "Password must be at least 6 characters long" });
      }
    }

    const updated = await clientService.updateClient(
      clientId,
      { name, email, phoneNumber, status, notes, provenance, interestedApartments: apartmentId, password },
      request.user
    );
    return reply.send(updated);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function deleteClient(request, reply) {
  try {
    const clientId = parseInt(request.params.clientId, 10);
    if (!isPositiveInt(clientId)) {
      return reply
        .code(400)
        .send({ error: "clientId must be a positive integer" });
    }

    await clientService.removeClient(clientId, request.user);
    return reply.code(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

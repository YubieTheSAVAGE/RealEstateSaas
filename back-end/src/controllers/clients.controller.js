const clientService = require("../services/clients.service");
const {
  validateEmail,
  validatePhoneNumber,
  isPositiveInt,
} = require("../utils/helpers");

const ALLOWED_STATUSES = ["CLIENT", "LEAD"];

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
    const { name, email, phoneNumber, status, notes, provenance, apartmentId } = request.body;

    if (typeof name !== "string" || name.trim() === "") {
      return reply
        .code(400)
        .send({ error: "Name is required and must be a non-empty string" });
    }
    if (!validateEmail(email)) {
      return reply.code(400).send({ error: "Valid email is required" });
    }
    if (!validatePhoneNumber(phoneNumber)) {
      return reply.code(400).send({ error: "Valid phoneNumber is required" });
    }

    if (provenance !== undefined && typeof provenance !== "string") {
      return reply
        .code(400)
        .send({ error: "provenance must be a string" });
    }
    let clientStatus = "ACTIVE";
    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return reply
          .code(400)
          .send({
            error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
          });
      }
      clientStatus = status;
    }
    // if (notes !== undefined && typeof notes !== "string") {
    //   return reply.code(400).send({ error: "notes must be a string" });
    // }
  

    const client = await clientService.addNewClient(
      { name: name.trim(), email, phoneNumber, status: clientStatus, notes, provenance, interestedApartments: apartmentId },
      request.user
    );
    return reply.code(201).send(client);
  } catch (err) {
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

    const { name, email, phoneNumber, status, notes, provenance, apartmentId } = request.body;

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

    const updated = await clientService.updateClient(
      clientId,
      { name, email, phoneNumber, status, notes, provenance, interestedApartments: apartmentId },
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

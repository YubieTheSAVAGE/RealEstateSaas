const apartmentService = require("../services/apartments.service");
const { isPositiveInt } = require("../utils/helpers");

const ALLOWED_TYPES = ["APARTMENT", "DUPLEX", "VILLA"];
const ALLOWED_STATUSES = ["AVAILABLE", "RESERVED", "SOLD", "CANCELLED"];

async function getAllApartments(request, reply) {
  try {
    const apartments = await apartmentService.getAllApartments();
    return reply.send(apartments);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function listByProject(request, reply) {
  try {
    const projectId = parseInt(request.params.projectId, 10);
    if (!isPositiveInt(projectId)) {
      return reply
        .code(400)
        .send({ error: "projectId must be a positive integer" });
    }
    const apartments = await apartmentService.listByProject(projectId);
    return reply.send(apartments);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function createApartment(request, reply) {
  try {
    const projectId = parseInt(request.params.projectId, 10);
    if (!isPositiveInt(projectId)) {
      return reply
        .code(400)
        .send({ error: "projectId must be a positive integer" });
    }

    const { number, floor, type, area, threeDViewUrl, price, status, notes } =
      request.body;
    
    if (!isPositiveInt(number)) {
      return reply
        .code(400)
        .send({ error: "number is required and must be a positive integer" });
    }
    if (!isPositiveInt(floor)) {
      return reply
        .code(400)
        .send({ error: "floor is required and must be a positive integer" });
    }

    if (typeof type !== "string" || !ALLOWED_TYPES.includes(type)) {
      return reply.code(400).send({
        error: `type is required and must be one of: ${ALLOWED_TYPES.join(
          ", "
        )}`,
      });
    }

    if (typeof area !== "number" || area <= 0) {
      return reply
        .code(400)
        .send({ error: "area is required and must be a positive number" });
    }
    if (typeof price !== "number" || price < 0) {
      return reply
        .code(400)
        .send({ error: "price is required and must be a non-negative number" });
    }

    if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status)) {
      return reply.code(400).send({
        error: `status is required and must be one of: ${ALLOWED_STATUSES.join(
          ", "
        )}`,
      });
    }

    if (threeDViewUrl !== undefined && typeof threeDViewUrl !== "string") {
      return reply
        .code(400)
        .send({ error: "threeDViewUrl, if provided, must be a string" });
    }
    if (notes !== undefined && typeof notes !== "string") {
      return reply
        .code(400)
        .send({ error: "notes, if provided, must be a string" });
    }

    const newApartment = await apartmentService.create(projectId, {
      number,
      floor,
      type,
      area,
      threeDViewUrl,
      price,
      status,
      notes,
    });
    return reply.code(201).send(newApartment);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function updateApartment(request, reply) {
  try {
    const apartmentId = parseInt(request.params.apartmentId, 10);
    if (!isPositiveInt(apartmentId)) {
      return reply
        .code(400)
        .send({ error: "apartmentId must be a positive integer" });
    }

    const allowed = [
      "number",
      "floor",
      "type",
      "area",
      "threeDViewUrl",
      "price",
      "status",
      "notes",
    ];
    const data = {};
    for (const key of allowed) {
      if (request.body[key] !== undefined) {
        data[key] = request.body[key];
      }
    }
    if (Object.keys(data).length === 0) {
      return reply.code(400).send({
        error: `At least one of: ${allowed.join(", ")} must be provided`,
      });
    }

    if (data.number !== undefined && !isPositiveInt(data.number)) {
      return reply
        .code(400)
        .send({ error: "number must be a positive integer" });
    }
    if (data.floor !== undefined && !isPositiveInt(data.floor)) {
      return reply
        .code(400)
        .send({ error: "floor must be a positive integer" });
    }
    if (data.type !== undefined) {
      if (typeof data.type !== "string" || !ALLOWED_TYPES.includes(data.type)) {
        return reply
          .code(400)
          .send({ error: `type must be one of: ${ALLOWED_TYPES.join(", ")}` });
      }
    }
    if (
      data.area !== undefined &&
      (typeof data.area !== "number" || data.area <= 0)
    ) {
      return reply.code(400).send({ error: "area must be a positive number" });
    }
    if (
      data.price !== undefined &&
      (typeof data.price !== "number" || data.price < 0)
    ) {
      return reply
        .code(400)
        .send({ error: "price must be a non-negative number" });
    }
    if (data.status !== undefined) {
      if (
        typeof data.status !== "string" ||
        !ALLOWED_STATUSES.includes(data.status)
      ) {
        return reply.code(400).send({
          error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        });
      }
    }
    if (
      data.threeDViewUrl !== undefined &&
      typeof data.threeDViewUrl !== "string"
    ) {
      return reply.code(400).send({ error: "threeDViewUrl must be a string" });
    }
    if (data.notes !== undefined && typeof data.notes !== "string") {
      return reply.code(400).send({ error: "notes must be a string" });
    }

    const updated = await apartmentService.update(apartmentId, data);
    return reply.send(updated);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function deleteApartment(request, reply) {
  try {
    const apartmentId = parseInt(request.params.apartmentId, 10);
    if (!isPositiveInt(apartmentId)) {
      return reply
        .code(400)
        .send({ error: "apartmentId must be a positive integer" });
    }
    await apartmentService.remove(apartmentId);
    return reply.code(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function assignApartment(request, reply) {
  try {
    const apartmentId = parseInt(request.params.apartmentId, 10);
    const clientId = parseInt(request.body.clientId, 10);

    if (!isPositiveInt(apartmentId) || !isPositiveInt(clientId)) {
      return reply
        .code(400)
        .send({ error: "apartmentId and clientId must be positive integers" });
    }

    const assigned = await apartmentService.assignToClient(
      apartmentId,
      clientId,
      request.user
    );
    return reply.send(assigned);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

module.exports = {
  getAllApartments,
  listByProject,
  createApartment,
  updateApartment,
  deleteApartment,
  assignApartment,
};

const apartmentService = require("../services/apartments.service");
const { isPositiveInt } = require("../utils/helpers");

const path = require("path");
const fs = require("fs");
const { client, user } = require("../utils/prisma");

const ALLOWED_TYPES = ["APARTMENT", "DUPLEX", "VILLA", "STORE", "LAND"];
const ALLOWED_STATUSES = ["AVAILABLE", "RESERVED", "SOLD", "CANCELLED"];
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

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

    const { number, floor, type, area, threeDViewUrl, price, status, notes, pricePerM2, zone, image, clientId } =
      request.body;

    if (typeof type !== "string" || !ALLOWED_TYPES.includes(type)) {
      return reply.code(400).send({
        error: `type is required and must be one of: ${ALLOWED_TYPES.join(
          ", "
        )}`,
      });
    }
    if (!isPositiveInt(parseInt(floor, 10))) {
      return reply.code(400).send({ error: "floor must be a positive integer" });
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
    if (zone !== undefined && typeof zone !== "string") {
        return reply
          .code(400)
          .send({ error: "zone, if provided, must be a string" });
    }
    let uploadedImage = null;
    if (image && image.buffer) {
    const { mimetype, buffer, filename } = image;

    const uniqueName = `${Date.now()}-${filename}`;


    if (!ALLOWED.includes(mimetype)) {
      return reply.status(400).send({ message: 'Only JPEG, PNG, JPG, or WEBP allowed.' });
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const dest = path.join(uploadsDir, uniqueName);
    await fs.promises.writeFile(dest, buffer);
      uploadedImage = "http://localhost:3001" + path.join('/uploads', uniqueName);
    }
    const newApartment = await apartmentService.create(projectId, {
      number,
      floor : parseInt(floor, 10),
      type,
      area: parseInt(area, 10),
      threeDViewUrl,
      price : parseInt(price, 10),
      status,
      notes,
      pricePerM2: parseInt(pricePerM2, 10),
      image: uploadedImage,
      clientId: parseInt(clientId, 10) || null,
      zone,
      user: request.user,
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
      "pricePerM2",
      "zone",
      "clientId",
      "image",
      "user"
    ];
    const data = {};    
    for (const key of allowed) {
      if (request.body[key] !== undefined) {
        data[key] = request.body[key];
      }
    }
    let uploadedImage = null;
    if (request.body.image && request.body.image.buffer) {
      const { mimetype, buffer, filename } = request.body.image;

    const uniqueName = `${Date.now()}-${filename}`;


    if (!ALLOWED.includes(mimetype)) {
      return reply.status(400).send({ message: 'Only JPEG, PNG, JPG, or WEBP allowed.' });
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const dest = path.join(uploadsDir, uniqueName);
    await fs.promises.writeFile(dest, buffer);

     uploadedImage = "http://localhost:3001" + path.join('/uploads', uniqueName);
    }
    if (Object.keys(data).length === 0) {
      return reply.code(400).send({
        error: `At least one of: ${allowed.join(", ")} must be provided`,
      });
    }
    if (data.type !== undefined) {
      if (typeof data.type !== "string" || !ALLOWED_TYPES.includes(data.type)) {
        return reply
          .code(400)
          .send({ error: `type must be one of: ${ALLOWED_TYPES.join(", ")}` });
      }
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

    const updated = await apartmentService.update(apartmentId, {
      number :data.number,
      floor : parseInt(data.floor, 10),
      type: data.type,
      area: parseInt(data.area, 10),
      threeDViewUrl: data.threeDViewUrl,
      price : parseInt(data.price, 10),
      status: data.status,
      notes: data.notes,
      pricePerM2: parseInt(data.pricePerM2, 10),
      image: uploadedImage,
      zone : data.zone,
      clientId: parseInt(data.clientId, 10) || null,
      user: request.user,
    });
    // const updated = await apartmentService.update(apartmentId, data);
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

async function getApartmentById(request, reply) {
  try {
    const apartmentId = parseInt(request.params.apartmentId, 10);
    if (!isPositiveInt(apartmentId)) {
      return reply
        .code(400)
        .send({ error: "apartmentId must be a positive integer" });
    }
    const apartment = await apartmentService.getApartmentById(apartmentId);
    return reply.send(apartment);
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
  getApartmentById,
};
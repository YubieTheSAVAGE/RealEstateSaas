const agentService = require("../services/agents.service");
const {
  isPositiveInt,
  validateEmail,
  validatePhoneNumber,
} = require("../utils/helpers");

const ALLOWED_ROLES = ["ADMIN", "AGENT"];
const ALLOWED_STATUS = ["ACTIVE", "INACTIVE"];

async function getAllAgents(request, reply) {
  try {
    const agents = await agentService.findAllAgents();
    return reply.send(agents);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function getAgentById(request, reply) {
  try {
    const agentId = parseInt(request.params.agentId, 10);
    if (!isPositiveInt(agentId)) {
      return reply
        .code(400)
        .send({ error: "agentId must be a positive integer" });
    }

    const agent = await agentService.findAgentById(agentId);
    return reply.send(agent);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function createAgent(request, reply) {
  try {
    const { name, email, phoneNumber, password, role } = request.body;

    if (typeof name !== "string" || name.trim() === "") {
      return reply.code(400).send({ error: "Name is required" });
    }
    if (!validateEmail(email)) {
      return reply.code(400).send({ error: "Valid email is required" });
    }
    if (!validatePhoneNumber(phoneNumber)) {
      return reply.code(400).send({ error: "Valid phoneNumber is required" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return reply
        .code(400)
        .send({ error: "Password is required (min 6 characters)" });
    }

    let newRole = "AGENT";
    if (role !== undefined) {
      if (!ALLOWED_ROLES.includes(role)) {
        return reply
          .code(400)
          .send({ error: `Role must be one of: ${ALLOWED_ROLES.join(", ")}` });
      }
      if (role === "ADMIN" && request.user.role !== "ADMIN") {
        return reply
          .code(403)
          .send({ error: "Only ADMIN can assign ADMIN role" });
      }
      newRole = role;
    }

    const user = await agentService.addNewAgent({
      name: name.trim(),
      email,
      phoneNumber,
      password,
      role: newRole,
    });

    const token = await reply.jwtSign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: "1h" }
    );

    return reply.code(201).send({ token, user });
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function updateAgent(request, reply) {
  try {
    const agentId = parseInt(request.params.agentId, 10);
    if (!isPositiveInt(agentId)) {
      return reply
        .code(400)
        .send({ error: "agentId must be a positive integer" });
    }

    const allowed = ["name", "email", "phoneNumber", "status", "notes", "role"];
    const data = {};
    for (const key of allowed) {
      if (request.body[key] !== undefined) {
        data[key] = request.body[key];
      }
    }
    if (Object.keys(data).length === 0) {
      return reply
        .code(400)
        .send({
          error: `At least one of: ${allowed.join(", ")} must be provided`,
        });
    }

    if (data.name !== undefined) {
      if (typeof data.name !== "string" || data.name.trim() === "") {
        return reply
          .code(400)
          .send({ error: "name must be a non-empty string" });
      }
      data.name = data.name.trim();
    }
    if (data.email !== undefined && !validateEmail(data.email)) {
      return reply.code(400).send({ error: "email is invalid" });
    }
    if (
      data.phoneNumber !== undefined &&
      !validatePhoneNumber(data.phoneNumber)
    ) {
      return reply.code(400).send({ error: "phoneNumber is invalid" });
    }
    if (data.status !== undefined && !ALLOWED_STATUS.includes(data.status)) {
      return reply
        .code(400)
        .send({ error: `status must be one of: ${ALLOWED_STATUS.join(", ")}` });
    }
    if (data.notes !== undefined && typeof data.notes !== "string") {
      return reply.code(400).send({ error: "notes must be a string" });
    }
    if (data.role !== undefined) {
      if (!ALLOWED_ROLES.includes(data.role)) {
        return reply
          .code(400)
          .send({ error: `role must be one of: ${ALLOWED_ROLES.join(", ")}` });
      }
      if (request.user.role !== "ADMIN") {
        return reply
          .code(403)
          .send({ error: "Only ADMIN can change user roles" });
      }
    }

    const updated = await agentService.updateAgent(agentId, data);
    return reply.send(updated);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function deleteAgent(request, reply) {
  try {
    const agentId = parseInt(request.params.agentId, 10);
    if (!isPositiveInt(agentId)) {
      return reply
        .code(400)
        .send({ error: "agentId must be a positive integer" });
    }
    await agentService.removeAgent(agentId);
    return reply.code(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

module.exports = {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};

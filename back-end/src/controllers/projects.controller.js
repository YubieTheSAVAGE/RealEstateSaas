const projectService = require("../services/projects.service");
const { isPositiveInt } = require("../utils/helpers");

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

async function getAllProjects(request, reply) {
  try {
    const projects = await projectService.findAllProjects();
    return reply.send(projects);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function getProjectById(request, reply) {
  try {
    const projectId = parseInt(request.params.projectId, 10);
    if (!isPositiveInt(projectId)) {
      return reply
        .code(400)
        .send({ error: "projectId must be a positive integer" });
    }

    const project = await projectService.findProjectById(projectId);
    return reply.send(project);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function createProject(request, reply) {
  try {
    const { name, numberOfApartments, notes , image} = request.body;

    if (typeof name !== "string" || name.trim() === "") {
      return reply
        .code(400)
        .send({ error: "Name is required and must be a non-empty string" });
    }

    if (!isPositiveInt(numberOfApartments)) {
      return reply.code(400).send({
        error: "numberOfApartments is required and must be a positive integer",
      });
    }

    // if (notes !== undefined && typeof notes !== "string") {
    //   return reply.code(400).send({ error: "notes must be a string" });
    // }
    const { mimetype, buffer, filename } = image;

    const uniqueName = `${Date.now()}-${filename}`;


    if (!ALLOWED.includes(mimetype)) {
      return rep.status(400).send({ message: 'Only JPEG, PNG, JPG, or WEBP allowed.' });
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const dest = path.join(uploadsDir, uniqueName);
    await fs.promises.writeFile(dest, buffer);

    image = process.env.BACKEND_URL + path.join('/uploads', uniqueName);


    const project = await projectService.addNewProject({
      name: name.trim(),
      numberOfApartments,
      notes,
      image,
    });
    return reply.code(201).send(project);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function updateProject(request, reply) {
  try {
    const projectId = parseInt(request.params.projectId, 10);
    if (!isPositiveInt(projectId)) {
      return reply
        .code(400)
        .send({ error: "projectId must be a positive integer" });
    }

    const allowed = ["name", "numberOfApartments", "notes"];
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

    if (data.name !== undefined) {
      if (typeof data.name !== "string" || data.name.trim() === "") {
        return reply
          .code(400)
          .send({ error: "name must be a non-empty string" });
      }
      data.name = data.name.trim();
    }

    if (data.numberOfApartments !== undefined) {
      if (!isPositiveInt(data.numberOfApartments)) {
        return reply
          .code(400)
          .send({ error: "numberOfApartments must be a positive integer" });
      }
    }

    if (data.notes !== undefined && typeof data.notes !== "string") {
      return reply.code(400).send({ error: "notes must be a string" });
    }

    const updated = await projectService.updateProject(projectId, data);
    return reply.send(updated);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function deleteProject(request, reply) {
  try {
    const projectId = parseInt(request.params.projectId, 10);
    if (!isPositiveInt(projectId)) {
      return reply
        .code(400)
        .send({ error: "projectId must be a positive integer" });
    }

    await projectService.removeProject(projectId);
    return reply.code(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

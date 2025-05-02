const projectService = require("../services/projects.service");

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
    const project = await projectService.findProjectById(projectId);
    return reply.send(project);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function createProject(request, reply) {
  try {
    const { name, numberOfApartments, notes } = request.body;
    if (!name || numberOfApartments == null) {
      return reply
        .code(400)
        .send({ error: "Name and numberOfApartments are required" });
    }
    const project = await projectService.addNewProject({
      name,
      numberOfApartments,
      notes,
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
    const data = request.body;
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

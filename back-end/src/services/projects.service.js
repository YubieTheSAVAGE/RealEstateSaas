const prisma = require("../utils/prisma");

async function findAllProjects() {
  return prisma.project.findMany({
    include: { apartments: true },
  });
}

async function findProjectById(projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { apartments: true },
  });
  if (!project) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }
  return project;
}

async function addNewProject(data) {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      numberOfApartments: data.numberOfApartments,
      notes: data.notes,
    },
  });
  return project;
}

async function updateProject(projectId, data) {
  const existing = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!existing) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }
  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: data.name,
      numberOfApartments: data.numberOfApartments,
      notes: data.notes,
    },
  });
  return updated;
}

async function removeProject(projectId) {
  const existing = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!existing) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }
  await prisma.apartment.deleteMany({
    where: { projectId },
  });
  await prisma.project.delete({ where: { id: projectId } });
}

module.exports = {
  findAllProjects,
  findProjectById,
  addNewProject,
  updateProject,
  removeProject,
};

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
  // Build the project data object
  const projectData = {
    name: data.name,
    numberOfApartments: parseInt(data.numberOfApartments, 10),
    totalSurface: parseInt(data.totalSurface, 10),
    address: data.address,
    notes: data.notes,
    image: data.image,
  };

  // Add optional enhanced fields if provided
  if (data.latitude !== undefined) projectData.latitude = parseFloat(data.latitude);
  if (data.longitude !== undefined) projectData.longitude = parseFloat(data.longitude);
  if (data.folderFees !== undefined) projectData.folderFees = parseFloat(data.folderFees);
  if (data.commissionPerM2 !== undefined) projectData.commissionPerM2 = parseFloat(data.commissionPerM2);
  if (data.totalSales !== undefined) projectData.totalSales = parseFloat(data.totalSales);
  if (data.status !== undefined) projectData.status = data.status;
  if (data.progress !== undefined) projectData.progress = parseInt(data.progress, 10);
  if (data.constructionPhotos !== undefined) projectData.constructionPhotos = data.constructionPhotos;

  const project = await prisma.project.create({
    data: projectData,
    include: { apartments: true }, // Include apartments in response
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
  const apartmentData = {
    numberOfApartments: parseInt(data.numberOfApartments, 10),
    totalSurface: parseInt(data.totalSurface, 10),
    address: data.address,
    notes: data.notes,
  }
  if (data.name) {
    apartmentData.name = data.name;
  }
  if (data.image) {
    apartmentData.image = data.image;
  }
  const updated = await prisma.project.update({
    where: { id: projectId },
    data: apartmentData,
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

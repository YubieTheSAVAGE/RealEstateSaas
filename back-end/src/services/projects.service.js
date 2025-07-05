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
  if (data.latitude !== undefined) projectData.latitude = data.latitude;
  if (data.longitude !== undefined) projectData.longitude = data.longitude;
  if (data.folderFees !== undefined) projectData.folderFees = data.folderFees;
  if (data.commissionPerM2 !== undefined) projectData.commissionPerM2 = data.commissionPerM2;
  if (data.totalSales !== undefined) projectData.totalSales = data.totalSales;
  if (data.status !== undefined) projectData.status = data.status;
  if (data.progress !== undefined) projectData.progress = data.progress;
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
  
  // Build the update data object with all fields
  const updateData = {
    numberOfApartments: parseInt(data.numberOfApartments, 10),
    totalSurface: parseInt(data.totalSurface, 10),
    address: data.address,
    notes: data.notes,
  };
  
  // Add optional fields if provided
  if (data.name) {
    updateData.name = data.name;
  }
  if (data.image) {
    updateData.image = data.image;
  }
  
  // Add enhanced fields if provided
  if (data.latitude !== undefined && data.latitude !== null && data.latitude !== "") {
    updateData.latitude = parseFloat(data.latitude);
  }
  if (data.longitude !== undefined && data.longitude !== null && data.longitude !== "") {
    updateData.longitude = parseFloat(data.longitude);
  }
  if (data.folderFees !== undefined && data.folderFees !== null && data.folderFees !== "") {
    updateData.folderFees = parseFloat(data.folderFees);
  }
  if (data.commissionPerM2 !== undefined && data.commissionPerM2 !== null && data.commissionPerM2 !== "") {
    updateData.commissionPerM2 = parseFloat(data.commissionPerM2);
  }
  if (data.totalSales !== undefined && data.totalSales !== null && data.totalSales !== "") {
    updateData.totalSales = parseFloat(data.totalSales);
  }
  if (data.status !== undefined && data.status !== null && data.status !== "") {
    updateData.status = data.status;
  }
  if (data.progress !== undefined && data.progress !== null && data.progress !== "") {
    updateData.progress = parseInt(data.progress, 10);
  }
  if (data.constructionPhotos !== undefined) {
    updateData.constructionPhotos = data.constructionPhotos;
  }
  
  const updated = await prisma.project.update({
    where: { id: projectId },
    data: updateData,
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

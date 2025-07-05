const projectService = require("../services/projects.service");
const { isPositiveInt } = require("../utils/helpers");
const path = require("path");
const fs = require("fs");

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
    const {
      name,
      numberOfApartments,
      totalSurface,
      address,
      notes,
      image,
      latitude,
      longitude,
      folderFees,
      commissionPerM2,
      totalSales,
      status,
      progress,
      constructionPhotos
    } = request.body;

    // Validate required fields
    if (typeof name !== "string" || name.trim() === "") {
      return reply
        .code(400)
        .send({ error: "Name is required and must be a non-empty string" });
    }

    if (typeof address !== "string" || address.trim() === "") {
      return reply
        .code(400)
        .send({ error: "Address is required and must be a non-empty string" });
    }

    // Validate numeric fields
    if (!numberOfApartments || isNaN(parseInt(numberOfApartments, 10)) || parseInt(numberOfApartments, 10) <= 0) {
      return reply
        .code(400)
        .send({ error: "numberOfApartments is required and must be a positive integer" });
    }

    if (!totalSurface || isNaN(parseInt(totalSurface, 10)) || parseInt(totalSurface, 10) <= 0) {
      return reply
        .code(400)
        .send({ error: "totalSurface is required and must be a positive integer" });
    }

    // Validate coordinates if provided
    if (latitude !== undefined && latitude !== null && latitude !== "") {
      const latValue = parseFloat(latitude);
      if (isNaN(latValue) || latValue < -90 || latValue > 90) {
        return reply
          .code(400)
          .send({ error: "latitude must be a valid number between -90 and 90" });
      }
    }

    if (longitude !== undefined && longitude !== null && longitude !== "") {
      const lngValue = parseFloat(longitude);
      if (isNaN(lngValue) || lngValue < -180 || lngValue > 180) {
        return reply
          .code(400)
          .send({ error: "longitude must be a valid number between -180 and 180" });
      }
    }

    // Validate progress if provided
    if (progress !== undefined && progress !== null && progress !== "") {
      const progressValue = parseInt(progress, 10);
      if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
        return reply
          .code(400)
          .send({ error: "progress must be a valid number between 0 and 100" });
      }
    }

    // Validate status if provided
    const validStatuses = ['PLANIFICATION', 'CONSTRUCTION', 'DONE'];
    if (status !== undefined && status !== null && status !== "") {
      if (!validStatuses.includes(status)) {
        return reply
          .code(400)
          .send({ error: `status must be one of: ${validStatuses.join(', ')}` });
      }
    }

    // Validate financial fields if provided
    if (folderFees !== undefined && folderFees !== null && folderFees !== "") {
      const feesValue = parseFloat(folderFees);
      if (isNaN(feesValue) || feesValue < 0) {
        return reply
          .code(400)
          .send({ error: "folderFees must be a valid non-negative number" });
      }
    }

    if (commissionPerM2 !== undefined && commissionPerM2 !== null && commissionPerM2 !== "") {
      const commissionValue = parseFloat(commissionPerM2);
      if (isNaN(commissionValue) || commissionValue < 0) {
        return reply
          .code(400)
          .send({ error: "commissionPerM2 must be a valid non-negative number" });
      }
    }

    if (totalSales !== undefined && totalSales !== null && totalSales !== "") {
      const salesValue = parseFloat(totalSales);
      if (isNaN(salesValue) || salesValue < 0) {
        return reply
          .code(400)
          .send({ error: "totalSales must be a valid non-negative number" });
      }
    }

    let uploadedImage = null;

    if (image && image.buffer) {
      const { mimetype, buffer, filename } = image;
      const uniqueName = `project_${Date.now()}_${filename}`;
      if (!ALLOWED.includes(mimetype)) {
        return reply.status(400).send({ error: 'Only JPEG, PNG, JPG, or WEBP files are allowed.' });
      }
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const dest = path.join(uploadsDir, uniqueName);
      await fs.promises.writeFile(dest, buffer);
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
      uploadedImage = `${baseUrl}/uploads/${uniqueName}`;
    }

    const projectData = {
      name: name.trim(),
      numberOfApartments: parseInt(numberOfApartments, 10),
      totalSurface: parseInt(totalSurface, 10),
      address: address.trim(),
      notes: notes ? notes.trim() : null,
      image: uploadedImage,
    };

    // Add optional enhanced fields if provided
    if (latitude !== undefined && latitude !== null && latitude !== "") {
      projectData.latitude = parseFloat(latitude);
    }
    if (longitude !== undefined && longitude !== null && longitude !== "") {
      projectData.longitude = parseFloat(longitude);
    }
    if (folderFees !== undefined && folderFees !== null && folderFees !== "") {
      projectData.folderFees = parseFloat(folderFees);
    }
    if (commissionPerM2 !== undefined && commissionPerM2 !== null && commissionPerM2 !== "") {
      projectData.commissionPerM2 = parseFloat(commissionPerM2);
    }
    if (totalSales !== undefined && totalSales !== null && totalSales !== "") {
      projectData.totalSales = parseFloat(totalSales);
    }
    if (status !== undefined && status !== null && status !== "") {
      projectData.status = status;
    }
    if (progress !== undefined && progress !== null && progress !== "") {
      projectData.progress = parseInt(progress, 10);
    }
    if (constructionPhotos !== undefined) {
      projectData.constructionPhotos = constructionPhotos || [];
    }

    const project = await projectService.addNewProject(projectData);

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

    const { name, numberOfApartments, totalSurface, address, notes, image } = request.body;

    if (typeof name !== "string" || name.trim() === "") {
      return reply
        .code(400)
        .send({ error: "Name is required and must be a non-empty string" });
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

      // Use environment variable for base URL or default to localhost for development
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
      uploadedImage = baseUrl + path.join('/uploads', uniqueName);
    }

    const project = await projectService.updateProject(projectId, {
      name: name.trim(),
      numberOfApartments: parseInt(numberOfApartments, 10),
      totalSurface: parseInt(totalSurface, 10),
      address: address.trim(),
      notes: notes ? notes.trim() : null,
      image: uploadedImage,
    });

    return reply.send(project);
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

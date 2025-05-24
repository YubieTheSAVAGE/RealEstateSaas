const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

/**
 * Get top performing agents based on the number of clients and apartments sold
 * @param {number} limit - Maximum number of agents to return
 * @returns {Promise<Array>} - Top performing agents with their metrics
 */
async function getTopPerformingAgents(limit = 5) {
  // Get all agents
  const agents = await prisma.user.findMany({
    where: {
      role: 'AGENT',
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      role: true,
      clients: {
        select: {
          id: true,
          apartments: {
            select: {
              id: true,
              price: true,
              status: true,
              updatedAt: true,
              project: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        }
      }
    }
  });

  // Calculate performance metrics for each agent
  const agentsWithMetrics = agents.map(agent => {
    const clientCount = agent.clients.length;
    
    // Flatten apartments across all clients
    const allApartments = agent.clients.flatMap(client => client.apartments || []);
    
    // Get sold apartments only
    const soldApartments = allApartments.filter(apt => apt.status === 'SOLD');
    
    // Calculate total revenue from sold apartments
    const salesRevenue = soldApartments.reduce((total, apt) => total + apt.price, 0);
    
    // Get most active project (project with most sales)
    const projectCounts = {};
    soldApartments.forEach(apt => {
      const projectName = apt.project.name;
      projectCounts[projectName] = (projectCounts[projectName] || 0) + 1;
    });
    
    // Find the project with the most sales
    let topProject = "N/A";
    let maxSales = 0;
    
    Object.entries(projectCounts).forEach(([project, count]) => {
      if (count > maxSales) {
        topProject = project;
        maxSales = count;
      }
    });
      const date = new Date();
    // If no date is provided, use current date

    // Calculate month-over-month sales growth based on the apartment updatedAt dates
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Get apartments sold in current month and previous month
    const currentMonthSales = soldApartments.filter(apt => {
      const aptDate = new Date(apt.updatedAt);
      return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
    });

    const previousMonthSales = soldApartments.filter(apt => {
      const aptDate = new Date(apt.updatedAt);
      return aptDate.getMonth() === previousMonth && aptDate.getFullYear() === previousMonthYear;
    });

    // Calculate total revenue for each month
    const currentMonthRevenue = currentMonthSales.reduce((total, apt) => total + apt.price, 0);
    const previousMonthRevenue = previousMonthSales.reduce((total, apt) => total + apt.price, 0);

    // Calculate month-over-month growth percentage
    let monthlySales = 0;
    if (previousMonthRevenue > 0) {
      monthlySales = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      monthlySales = 100; // If no sales in previous month but sales in current month, 100% growth
    }
    
    return {
      id: agent.id,
      name: agent.name,
      level: clientCount > 5 ? "Senior Agent" : "Junior Agent",
      project: topProject,
      salesRevenue,
      monthlySales,
      // Use a placeholder image for now, in production would come from a user profile
      image: `/images/user/user-0${(agent.id % 5) + 1}.jpg`,
    };
  });
  
  // Sort by sales revenue (highest first)
  agentsWithMetrics.sort((a, b) => b.salesRevenue - a.salesRevenue);
  
  // Return limited number of agents
  return agentsWithMetrics.slice(0, limit);
}


async function findAllAgents() {
  return prisma.user.findMany({
    where: { role: 'AGENT' },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      status: true,
      notes: true,
      role: true,
    },
  })
}

async function findAgentById(agentId) {
  const agent = await prisma.user.findUnique({
    where: { id: agentId, role: 'AGENT' },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      status: true,
      notes: true,
      role: true,
    },
  })
  if (!agent) {
    const err = new Error('Agent not found')
    err.statusCode = 404
    throw err
  }
  return agent
}

async function addNewAgent({ name, email, phoneNumber, password, role = 'AGENT' }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, phoneNumber, passwordHash, role },
  });

  delete user.passwordHash;
  return user;
}

async function updateAgent(agentId, data) {

  const existing = await prisma.user.findUnique({
    where: { id: agentId },
    select: { id: true, role: true },
  })
  if (!existing) {
    const err = new Error('Agent not found')
    err.statusCode = 404
    throw err
  }
  if (existing.role !== 'AGENT') {
    const err = new Error('Cannot update non-agent user')
    err.statusCode = 403
    throw err
  }
  const agentData = {
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    status: data.status,
    notes: data.notes,
  }
  if (data.password) {
    agentData.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  const updated = await prisma.user.update({
    where: { id: agentId },
    data: agentData,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      status: true,
      notes: true,
      role: true,
    },
  })
  return updated
}

async function removeAgent(agentId) {

  const existing = await prisma.user.findUnique({
    where: { id: agentId },
    select: { id: true, role: true },
  })
  if (!existing) {
    const err = new Error('Agent not found')
    err.statusCode = 404
    throw err
  }
  if (existing.role !== 'AGENT') {
    const err = new Error('Cannot delete non-agent user')
    err.statusCode = 403
    throw err
  }

  await prisma.user.delete({
    where: { id: agentId },
  })
}

module.exports = {
  findAllAgents,
  findAgentById,
  addNewAgent,
  updateAgent,
  removeAgent,
  getTopPerformingAgents,
};


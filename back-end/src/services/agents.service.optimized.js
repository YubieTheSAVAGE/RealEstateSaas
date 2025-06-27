const prisma = require("../utils/prisma");

/**
 * OPTIMIZED: Get top performing agents using database aggregation
 * Instead of loading all data and processing in JavaScript
 */
async function getTopPerformingAgentsOptimized(limit = 5) {
  // Use raw SQL for complex aggregations - much faster
  const topAgents = await prisma.$queryRaw`
    SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(CASE WHEN a.status = 'SOLD' THEN 1 END) as sold_count,
      COALESCE(SUM(CASE WHEN a.status = 'SOLD' THEN a.price END), 0) as total_revenue,
      COUNT(CASE WHEN a.status = 'SOLD' AND a."updatedAt" >= date_trunc('month', CURRENT_DATE) THEN 1 END) as monthly_sales,
      p.name as top_project_name
    FROM "User" u
    LEFT JOIN "Apartment" a ON u.id = a."userId"
    LEFT JOIN "Project" p ON a."projectId" = p.id
    WHERE u.role = 'AGENT'
    GROUP BY u.id, u.name, u.email, p.name
    ORDER BY total_revenue DESC
    LIMIT ${limit}
  `;

  return topAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    project: { name: agent.top_project_name },
    salesRevenue: Number(agent.total_revenue),
    monthlySales: Number(agent.monthly_sales),
    image: `/images/user/user-0${(agent.id % 5) + 1}.jpg`,
  }));
}

/**
 * OPTIMIZED: Get agents with minimal data loading
 */
async function findAllAgentsOptimized() {
  return prisma.user.findMany({
    where: { role: 'AGENT' },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      status: true,
      role: true,
      // Only load apartment count, not full data
      _count: {
        select: {
          apartments: true
        }
      }
    },
  });
}

module.exports = {
  getTopPerformingAgentsOptimized,
  findAllAgentsOptimized,
};

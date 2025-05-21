const apartmentService = require("../services/apartments.service");

/**
 * Get recent activity related to apartments (recent transactions, status changes)
 */
async function getRecentActivity(request, reply) {
  try {
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 5;
    const activity = await apartmentService.getRecentActivity(limit);
    return reply.send(activity);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function getMonthlyTarget(request, reply) {
  try {
    const monthlyTarget = await apartmentService.getMonthlyTarget();
    return reply.send(monthlyTarget);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function setMonthlyTarget(request, reply) {
  try {
    const { month, year, target } = request.body;
    const newTarget = await apartmentService.setMonthlyTarget(parseInt(month, 10), parseInt(year, 10), parseFloat(target));
    return reply.code(201).send(newTarget);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

module.exports = {
  getRecentActivity,
  getMonthlyTarget,
  setMonthlyTarget
};

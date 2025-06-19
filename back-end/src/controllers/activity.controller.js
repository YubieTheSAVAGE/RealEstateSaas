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
    const { target, startDate, endDate } = request.body;
    
    // Validate target is a number
    if (isNaN(parseFloat(target))) {
      return reply.code(400).send({ error: "Target must be a number" });
    }
    
    // Convert string dates to proper Date objects
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Validate dates are valid
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return reply.code(400).send({ error: "Invalid date format. Please use YYYY-MM-DD format." });
    }
    
    // Validate end date is after start date
    if (endDateTime <= startDateTime) {
      return reply.code(400).send({ error: "End date must be after start date" });
    }
    
    // Convert target to a number
    const numericTarget = parseFloat(target);
    
    const updatedTarget = await apartmentService.setMonthlyTarget(numericTarget, startDateTime, endDateTime);
    
    // Determine if this was an update or a new target
    const message = updatedTarget.updatedAt.getTime() !== updatedTarget.createdAt.getTime() 
      ? "Monthly target updated successfully" 
      : "Monthly target created successfully";
    
    return reply.send({ 
      ...updatedTarget,
      message 
    });
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

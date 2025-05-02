const agentService = require("../services/agents.service");

async function getAllAgents(request, reply) {
  const agents = await agentService.findAllAgents()
  reply.send(agents)
}

async function getAgentById(request, reply) {
  const { agentId } = request.params
  const agent = await agentService.findAgentById(+agentId)
  reply.send(agent)
}

async function createAgent(request, reply) {
  try {
    const { name, email, phoneNumber, password, role } = request.body;

    if (!name || !email || !phoneNumber || !password) {
      return reply.code(400).send({ error: 'All fields are required' });
    }

    let newRole = 'AGENT';
    if (role && role === 'ADMIN') {
      if (request.user?.role !== 'ADMIN') {
        return reply.code(403).send({ error: 'Only ADMIN can create another ADMIN' });
      }
      newRole = 'ADMIN';
    }

    const user = await agentService.addNewAgent ({
      name,
      email,
      phoneNumber,
      password,
      role: newRole,
    });

    const token = await reply.jwtSign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: '1h' }
    );

    return reply.send({ token, user });
  } catch (err) {
    request.log.error(err);
    return reply.code(400).send({ error: err.message });
  }
}

async function updateAgent(request, reply) {
  const { agentId } = request.params
  const data = request.body
  const updated = await agentService.updateAgent(+agentId, data)
  reply.send(updated)
}

async function deleteAgent(request, reply) {
  const { agentId } = request.params
  await agentService.removeAgent(+agentId)
  reply.code(204).send()
}


module.exports = {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
}
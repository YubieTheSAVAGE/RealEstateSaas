const agentService = require("../services/agents.service");

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

module.exports = {
  createAgent,
};
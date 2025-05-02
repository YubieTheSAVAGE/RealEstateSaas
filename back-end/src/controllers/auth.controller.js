const authService = require("../services/auth.service");

async function login(request, reply) {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password are required" });
    }

    const user = await authService.loginUser(email, password);

    const token = await reply.jwtSign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      { expiresIn: "1h" }
    );

    return reply.send({ token, user });
  } catch (err) {
    request.log.error(err);
    return reply.code(401).send({ error: err.message });
  }
}

module.exports = {
  login,
};

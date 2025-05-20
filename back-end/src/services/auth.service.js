const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");


async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error('Invalid credentials');
  }
  delete user.passwordHash;
  return user;
} 


module.exports = {
  loginUser,
};
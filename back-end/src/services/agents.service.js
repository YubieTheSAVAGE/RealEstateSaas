const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

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

module.exports = {
   addNewAgent,
};  


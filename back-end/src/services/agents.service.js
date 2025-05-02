const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;


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
  const agent = await prisma.user.findFirst({
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

  const updated = await prisma.user.update({
    where: { id: agentId },
    data,
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
}; 


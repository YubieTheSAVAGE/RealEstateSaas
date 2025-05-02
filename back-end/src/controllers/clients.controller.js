const clientService = require('../services/clients.service')

async function getAllClients(request, reply) {
  try {
    const user = request.user
    const clients = await clientService.findAllClients(user)
    return reply.send(clients)
  } catch (err) {
    request.log.error(err)
    return reply.code(err.statusCode || 500).send({ error: err.message })
  }
}

async function getClientById(request, reply) {
  try {
    const user     = request.user
    const clientId = parseInt(request.params.clientId, 10)
    const client   = await clientService.findClientById(clientId, user)
    return reply.send(client)
  } catch (err) {
    request.log.error(err)
    return reply.code(err.statusCode || 500).send({ error: err.message })
  }
}

async function createClient(request, reply) {
  try {
    const user      = request.user
    const { name, email, phoneNumber, status, notes } = request.body
    if (!name || !email || !phoneNumber) {
      return reply.code(400).send({ error: 'Name, email and phoneNumber are required' })
    }
    const client = await clientService.addNewClient(
      { name, email, phoneNumber, status, notes },
      user
    )
    return reply.code(201).send(client)
  } catch (err) {
    request.log.error(err)
    return reply.code(err.statusCode || 500).send({ error: err.message })
  }
}

async function updateClient(request, reply) {
  try {
    const user      = request.user
    const clientId  = parseInt(request.params.clientId, 10)
    const data      = request.body
    const updated   = await clientService.updateClient(clientId, data, user)
    return reply.send(updated)
  } catch (err) {
    request.log.error(err)
    return reply.code(err.statusCode || 500).send({ error: err.message })
  }
}

async function deleteClient(request, reply) {
  try {
    const user     = request.user
    const clientId = parseInt(request.params.clientId, 10)
    await clientService.removeClient(clientId, user)
    return reply.code(204).send()
  } catch (err) {
    request.log.error(err)
    return reply.code(err.statusCode || 500).send({ error: err.message })
  }
}

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
}

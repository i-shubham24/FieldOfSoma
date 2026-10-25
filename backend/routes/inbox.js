import { getCollection, isDbConnected } from '../config/db.js'

export default async function inboxRoutes(fastify) {
  fastify.get('/messages', async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('messages')
    if (!col) return []
    return col.find({}).sort({ createdAt: -1 }).toArray()
  })

  fastify.post('/messages', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('messages')
    const doc = {
      id: Date.now(),
      status: 'New',
      createdAt: new Date(),
      ...request.body,
    }
    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  fastify.patch('/messages/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('messages')
    const id = Number(request.params.id) || request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })

  fastify.delete('/messages/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('messages')
    const id = Number(request.params.id) || request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

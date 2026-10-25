import { getCollection, isDbConnected } from '../config/db.js'

export default async function classesRoutes(fastify) {
  fastify.get('/classes', async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('classes')
    if (!col) return []
    return col.find({}).toArray()
  })

  fastify.post('/classes', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('classes')
    const doc = {
      id: request.body.id || `class_${Date.now()}`,
      sold: 0,
      revenue: 0,
      status: 'Draft',
      ...request.body,
    }
    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  fastify.put('/classes/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('classes')
    const id = request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates }, { upsert: true })
    return { ok: true }
  })

  fastify.delete('/classes/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('classes')
    const id = request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

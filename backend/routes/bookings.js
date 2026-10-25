import { getCollection, isDbConnected } from '../config/db.js'

export default async function bookingsRoutes(fastify) {
  fastify.get('/bookings', async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('bookings')
    if (!col) return []
    return col.find({}).sort({ date: -1 }).toArray()
  })

  fastify.post('/bookings', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('bookings')
    const doc = {
      id: `s_${Date.now()}`,
      status: 'Requested',
      requested: 'Today',
      note: '',
      ...request.body,
    }
    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  fastify.patch('/bookings/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('bookings')
    const id = request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })

  fastify.delete('/bookings/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('bookings')
    const id = request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

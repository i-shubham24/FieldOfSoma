import { getCollection, isDbConnected } from '../config/db.js'

export default async function ordersRoutes(fastify) {
  fastify.get('/orders', async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('orders')
    if (!col) return []
    return col.find({}).sort({ date: -1 }).toArray()
  })

  fastify.post('/orders', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('orders')
    const doc = {
      id: request.body.id || `SOMA_${Date.now()}`,
      status: 'Paid',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      ...request.body,
    }
    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  fastify.patch('/orders/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('orders')
    const id = request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })
}

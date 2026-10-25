import { getCollection, isDbConnected } from '../config/db.js'

export default async function reviewsRoutes(fastify) {
  fastify.get('/reviews', async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('reviews')
    if (!col) return []
    return col.find({}).toArray()
  })

  fastify.post('/reviews', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('reviews')
    const doc = {
      id: `r_${Date.now()}`,
      status: 'Waiting',
      ...request.body,
    }
    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  fastify.patch('/reviews/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('reviews')
    const id = request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })

  fastify.delete('/reviews/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('reviews')
    const id = request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

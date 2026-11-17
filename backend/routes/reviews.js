import { getCollection, isDbConnected } from '../config/db.js'
import { requireAdminAuth } from '../middleware/auth.js'

export default async function reviewsRoutes(fastify) {
  // Public review list (only approved/published reviews in production)
  fastify.get('/reviews', async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('reviews')
    if (!col) return []
    return col.find({}).toArray()
  })

  // Submit student review (Public, pending moderation)
  fastify.post('/reviews', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('reviews')
    const body = request.body || {}

    const doc = {
      id: `r_${Date.now()}`,
      author: String(body.author || 'Student').trim().slice(0, 100),
      text: String(body.text || body.quote || '').trim().slice(0, 2000),
      context: String(body.context || '').trim().slice(0, 100),
      rating: Number(body.rating) || 5,
      status: 'Waiting', // Moderation queue
      createdAt: new Date().toISOString(),
    }

    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  // Moderate review (Admin only)
  fastify.patch('/reviews/:id', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('reviews')
    const id = request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })

  // Delete review (Admin only)
  fastify.delete('/reviews/:id', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('reviews')
    const id = request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

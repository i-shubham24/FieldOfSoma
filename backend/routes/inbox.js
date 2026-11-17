import { getCollection, isDbConnected } from '../config/db.js'
import { requireAdminAuth } from '../middleware/auth.js'
import { createRateLimiter } from '../middleware/rateLimit.js'

const formLimiter = createRateLimiter({ bucket: 'inbox_messages', maxRequests: 5, windowMs: 600000 })

export default async function inboxRoutes(fastify) {
  // 1. Get messages (Admin only - BOLA/IDOR Defense)
  fastify.get('/messages', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('messages')
    if (!col) return []
    return col.find({}).sort({ createdAt: -1 }).toArray()
  })

  // 2. Submit new inquiry message (Public with honeypot & rate limiting)
  fastify.post('/messages', { preHandler: formLimiter }, async (request, reply) => {
    const data = request.body || {}

    // Bot honeypot defense
    const honeypot = data.hp_website || data.honeypot || data.website_url
    if (honeypot && String(honeypot).trim().length > 0) {
      return { ok: true, message: 'Message sent successfully.' }
    }

    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('messages')

    const doc = {
      id: Date.now(),
      status: 'New',
      createdAt: new Date(),
      name: String(data.name || 'Visitor').trim().slice(0, 100),
      email: String(data.email || '').trim().toLowerCase().slice(0, 120),
      phone: String(data.phone || '').trim().slice(0, 30),
      message: String(data.message || '').trim().slice(0, 5000),
      practice: String(data.practice || '').trim().slice(0, 100),
      format: String(data.format || '').trim().slice(0, 50),
      when: 'Just now',
    }

    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  // 3. Update message status (Admin only)
  fastify.patch('/messages/:id', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('messages')
    const id = Number(request.params.id) || request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })

  // 4. Delete message (Admin only)
  fastify.delete('/messages/:id', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('messages')
    const id = Number(request.params.id) || request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

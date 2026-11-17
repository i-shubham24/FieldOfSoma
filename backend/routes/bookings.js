import { getCollection, isDbConnected } from '../config/db.js'
import { requireAdminAuth } from '../middleware/auth.js'
import { createRateLimiter } from '../middleware/rateLimit.js'

const bookingLimiter = createRateLimiter({ bucket: 'bookings', maxRequests: 5, windowMs: 600000 })

export default async function bookingsRoutes(fastify) {
  // 1. Get all bookings (Admin only - BOLA/IDOR Defense)
  fastify.get('/bookings', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('bookings')
    if (!col) return []
    return col.find({}).sort({ date: -1 }).toArray()
  })

  // 2. Request a session booking (Public with honeypot and rate limiting)
  fastify.post('/bookings', { preHandler: bookingLimiter }, async (request, reply) => {
    const data = request.body || {}

    // Honeypot trap
    const honeypot = data.hp_website || data.honeypot || data.website_url
    if (honeypot && String(honeypot).trim().length > 0) {
      return { ok: true, message: 'Booking requested successfully.' }
    }

    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('bookings')

    const doc = {
      id: `s_${Date.now()}`,
      status: 'Requested',
      requested: 'Today',
      note: String(data.note || '').slice(0, 500),
      client: String(data.client || data.name || 'Visitor').trim().slice(0, 100),
      email: String(data.email || '').trim().toLowerCase().slice(0, 120),
      phone: String(data.phone || '').trim().slice(0, 30),
      service: String(data.service || 'Somatic Movement Therapy').slice(0, 100),
      date: data.date || new Date().toISOString().slice(0, 10),
      time: data.time || '10:00',
      createdAt: new Date().toISOString(),
    }

    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  // 3. Update booking status/details (Admin only)
  fastify.patch('/bookings/:id', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('bookings')
    const id = request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })

  // 4. Cancel/delete booking (Admin only)
  fastify.delete('/bookings/:id', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('bookings')
    const id = request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

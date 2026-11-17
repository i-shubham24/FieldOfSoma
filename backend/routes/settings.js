import { getCollection, isDbConnected } from '../config/db.js'
import { requireAdminAuth } from '../middleware/auth.js'

export default async function settingsRoutes(fastify) {
  // Public settings/profile view
  fastify.get('/settings', async (request, reply) => {
    if (!isDbConnected()) return null
    const col = getCollection('settings')
    if (!col) return null
    const doc = await col.findOne({ _id: 'singleton' })
    if (!doc) return null
    // Strip sensitive internal fields if any
    const { _id, ...safeDoc } = doc
    return safeDoc
  })

  // Update settings (Admin only - BOLA/IDOR Defense)
  fastify.put('/settings', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('settings')
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ _id: 'singleton' }, { $set: updates }, { upsert: true })
    return { ok: true }
  })
}

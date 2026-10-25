import { getCollection, isDbConnected } from '../config/db.js'

export default async function settingsRoutes(fastify) {
  fastify.get('/settings', async (request, reply) => {
    if (!isDbConnected()) return null
    const col = getCollection('settings')
    if (!col) return null
    return col.findOne({ _id: 'singleton' })
  })

  fastify.put('/settings', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('settings')
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ _id: 'singleton' }, { $set: updates }, { upsert: true })
    return { ok: true }
  })
}

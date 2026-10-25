import { getCollection, isDbConnected } from '../config/db.js'

export default async function writingRoutes(fastify) {
  fastify.get('/writing', async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('writing')
    if (!col) return []
    return col.find({}).sort({ date: -1 }).toArray()
  })

  fastify.get('/writing/:id', async (request, reply) => {
    if (!isDbConnected()) return null
    const col = getCollection('writing')
    const id = request.params.id
    return col.findOne({ $or: [{ id }, { _id: id }] })
  })

  fastify.post('/writing', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('writing')
    const doc = {
      id: request.body.id || `note_${Date.now()}`,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      ...request.body,
    }
    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  fastify.put('/writing/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('writing')
    const id = request.params.id
    const updates = request.body || {}
    delete updates._id
    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates }, { upsert: true })
    return { ok: true }
  })

  fastify.delete('/writing/:id', async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('writing')
    const id = request.params.id
    await col.deleteOne({ $or: [{ id }, { _id: id }] })
    return { ok: true }
  })
}

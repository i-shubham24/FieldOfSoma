import { getCollection, isDbConnected } from '../config/db.js'
import { seedData } from '../../src/admin/sampleData.js'

export default async function syncRoutes(fastify) {
  // Full state retrieval for admin initialization
  fastify.get('/sync', async (request, reply) => {
    if (!isDbConnected()) {
      return { ok: false, connected: false, message: 'Database offline, using client cache' }
    }

    try {
      const messages = await getCollection('messages')?.find({}).toArray() || []
      const sessions = await getCollection('bookings')?.find({}).toArray() || []
      const classes = await getCollection('classes')?.find({}).toArray() || []
      const orders = await getCollection('orders')?.find({}).toArray() || []
      const reviews = await getCollection('reviews')?.find({}).toArray() || []
      const writing = await getCollection('writing')?.find({}).toArray() || []
      const settingsDoc = await getCollection('settings')?.findOne({ _id: 'singleton' })

      const defaults = seedData()

      return {
        ok: true,
        connected: true,
        data: {
          messages: messages.length ? messages : defaults.messages,
          sessions: sessions.length ? sessions : defaults.sessions,
          classes: classes.length ? classes : defaults.classes,
          orders: orders.length ? orders : defaults.orders,
          reviews: reviews.length ? reviews : defaults.reviews,
          writing: writing.length ? writing : defaults.writing,
          profile: settingsDoc?.profile || defaults.profile,
          settings: settingsDoc?.settings || defaults.settings,
          activity: settingsDoc?.activity || defaults.activity || [],
        },
      }
    } catch (error) {
      reply.status(500)
      return { ok: false, connected: false, error: error.message }
    }
  })

  // Full state update from admin
  fastify.post('/sync', async (request, reply) => {
    if (!isDbConnected()) {
      return { ok: false, connected: false, error: 'Database offline' }
    }

    const { messages, sessions, classes, orders, reviews, writing, profile, settings, activity } = request.body || {}

    try {
      if (messages) {
        const col = getCollection('messages')
        if (col) {
          await col.deleteMany({})
          if (messages.length) await col.insertMany(messages.map(({ _id, ...m }) => m))
        }
      }
      if (sessions) {
        const col = getCollection('bookings')
        if (col) {
          await col.deleteMany({})
          if (sessions.length) await col.insertMany(sessions.map(({ _id, ...s }) => s))
        }
      }
      if (classes) {
        const col = getCollection('classes')
        if (col) {
          await col.deleteMany({})
          if (classes.length) await col.insertMany(classes.map(({ _id, ...c }) => c))
        }
      }
      if (orders) {
        const col = getCollection('orders')
        if (col) {
          await col.deleteMany({})
          if (orders.length) await col.insertMany(orders.map(({ _id, ...o }) => o))
        }
      }
      if (reviews) {
        const col = getCollection('reviews')
        if (col) {
          await col.deleteMany({})
          if (reviews.length) await col.insertMany(reviews.map(({ _id, ...r }) => r))
        }
      }
      if (writing) {
        const col = getCollection('writing')
        if (col) {
          await col.deleteMany({})
          if (writing.length) await col.insertMany(writing.map(({ _id, ...w }) => w))
        }
      }
      if (profile || settings || activity) {
        const col = getCollection('settings')
        if (col) {
          await col.updateOne(
            { _id: 'singleton' },
            { $set: { ...(profile && { profile }), ...(settings && { settings }), ...(activity && { activity }) } },
            { upsert: true }
          )
        }
      }

      return { ok: true, synced: true }
    } catch (error) {
      reply.status(500)
      return { ok: false, error: error.message }
    }
  })
}

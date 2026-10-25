import { getCollection, isDbConnected } from '../config/db.js'
import { seedData } from '../../src/admin/sampleData.js'

export async function seedDatabaseIfEmpty() {
  if (!isDbConnected()) return

  try {
    const data = seedData()

    // 1. Messages / Inquiries
    const messagesCol = getCollection('messages')
    if (messagesCol && (await messagesCol.countDocuments()) === 0) {
      await messagesCol.insertMany(data.messages)
      console.log(`[Seed] Seeded ${data.messages.length} messages into MongoDB`)
    }

    // 2. Bookings / Sessions
    const bookingsCol = getCollection('bookings')
    if (bookingsCol && (await bookingsCol.countDocuments()) === 0) {
      await bookingsCol.insertMany(data.sessions)
      console.log(`[Seed] Seeded ${data.sessions.length} bookings into MongoDB`)
    }

    // 3. Recorded Classes
    const classesCol = getCollection('classes')
    if (classesCol && (await classesCol.countDocuments()) === 0) {
      await classesCol.insertMany(data.classes)
      console.log(`[Seed] Seeded ${data.classes.length} classes into MongoDB`)
    }

    // 4. Orders
    const ordersCol = getCollection('orders')
    if (ordersCol && (await ordersCol.countDocuments()) === 0) {
      await ordersCol.insertMany(data.orders)
      console.log(`[Seed] Seeded ${data.orders.length} orders into MongoDB`)
    }

    // 5. Reviews / Testimonials
    const reviewsCol = getCollection('reviews')
    if (reviewsCol && (await reviewsCol.countDocuments()) === 0) {
      await reviewsCol.insertMany(data.reviews)
      console.log(`[Seed] Seeded ${data.reviews.length} reviews into MongoDB`)
    }

    // 6. Writing Notes & Essays
    const writingCol = getCollection('writing')
    if (writingCol && (await writingCol.countDocuments()) === 0) {
      await writingCol.insertMany(data.writing)
      console.log(`[Seed] Seeded ${data.writing.length} writing notes into MongoDB`)
    }

    // 7. Settings & Profile singleton
    const settingsCol = getCollection('settings')
    if (settingsCol && (await settingsCol.countDocuments()) === 0) {
      await settingsCol.insertOne({
        _id: 'singleton',
        profile: data.profile,
        settings: data.settings,
        activity: data.activity,
      })
      console.log('[Seed] Seeded profile and settings into MongoDB')
    }
  } catch (error) {
    console.warn(`[Seed Warning] Could not seed database: ${error.message}`)
  }
}

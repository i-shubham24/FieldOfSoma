import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/field_of_soma'
const DB_NAME = process.env.MONGODB_DB_NAME || 'field_of_soma'

let client = null
let db = null
let isConnected = false

export async function connectToDatabase() {
  if (db && isConnected) return db

  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
    })

    await client.connect()
    db = client.db(DB_NAME)
    isConnected = true
    console.log(`[MongoDB] Connected successfully to ${DB_NAME} (Connection Pool: 5-50)`)

    // Ensure database performance indexes
    try {
      await Promise.allSettled([
        db.collection('orders').createIndex({ id: 1 }, { unique: true }),
        db.collection('orders').createIndex({ createdAt: -1 }),
        db.collection('bookings').createIndex({ id: 1 }, { unique: true }),
        db.collection('bookings').createIndex({ date: 1 }),
        db.collection('messages').createIndex({ createdAt: -1 }),
        db.collection('classes').createIndex({ id: 1 }, { unique: true }),
      ])
    } catch (idxErr) {
      console.warn('[MongoDB] Index creation notice:', idxErr.message)
    }

    return db
  } catch (error) {
    isConnected = false
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${MONGODB_URI}: ${error.message}`)
    console.warn('[MongoDB Warning] Operating in fallback mode. Start MongoDB to enable full persistence.')
    return null
  }
}

export function getDb() {
  return db
}

export function isDbConnected() {
  return isConnected
}

export function getCollection(name) {
  if (!db) return null
  return db.collection(name)
}

export async function closeDatabase() {
  if (client) {
    await client.close()
    isConnected = false
    db = null
    console.log('[MongoDB] Connection closed')
  }
}

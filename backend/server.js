import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import { connectToDatabase, isDbConnected } from './config/db.js'
import { seedDatabaseIfEmpty } from './services/seed.js'

// Middleware
import { sanitizeRequestHook } from './middleware/sanitize.js'

// Route handlers
import authRoutes from './routes/auth.js'
import emailRoutes from './routes/email.js'
import inboxRoutes from './routes/inbox.js'
import bookingsRoutes from './routes/bookings.js'
import classesRoutes from './routes/classes.js'
import ordersRoutes from './routes/orders.js'
import reviewsRoutes from './routes/reviews.js'
import writingRoutes from './routes/writing.js'
import settingsRoutes from './routes/settings.js'
import syncRoutes from './routes/sync.js'

dotenv.config()
dotenv.config({ path: '.env.local' })

const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST || '0.0.0.0'

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'warn',
  },
})

// Global NoSQL and Prototype Pollution Injection Sanitizer
fastify.addHook('preValidation', sanitizeRequestHook)

// Zero-Trust Production HTTP Security Headers
fastify.addHook('onSend', (request, reply, payload, done) => {
  reply.header('X-Content-Type-Options', 'nosniff')
  reply.header('X-Frame-Options', 'SAMEORIGIN')
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  reply.header('X-Permitted-Cross-Domain-Policies', 'none')
  reply.header('Origin-Agent-Cluster', '?1')
  reply.removeHeader('X-Powered-By')
  done(null, payload)
})

// Enable Cross-Origin Resource Sharing
await fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
})

// Health check endpoint
fastify.get('/api/health', async () => {
  return {
    status: 'ok',
    framework: 'Fastify',
    database: isDbConnected() ? 'connected' : 'offline',
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    timestamp: new Date().toISOString(),
  }
})

fastify.get('/health', async () => {
  return { status: 'ok', framework: 'Fastify' }
})

// Register all modular API routes under /api
await fastify.register(authRoutes, { prefix: '/api' })
await fastify.register(emailRoutes, { prefix: '/api' })
await fastify.register(inboxRoutes, { prefix: '/api' })
await fastify.register(bookingsRoutes, { prefix: '/api' })
await fastify.register(classesRoutes, { prefix: '/api' })
await fastify.register(ordersRoutes, { prefix: '/api' })
await fastify.register(reviewsRoutes, { prefix: '/api' })
await fastify.register(writingRoutes, { prefix: '/api' })
await fastify.register(settingsRoutes, { prefix: '/api' })
await fastify.register(syncRoutes, { prefix: '/api' })

// Connect to MongoDB and start Fastify server
async function start() {
  try {
    // 1. Establish MongoDB connection (falls back gracefully if offline)
    await connectToDatabase()

    // 2. Seed initial data if fresh database
    await seedDatabaseIfEmpty()

    // 3. Start listening
    await fastify.listen({ port: PORT, host: HOST })
    console.log(`\n======================================================`)
    console.log(` Field of Soma Fastify Backend Server`)
    console.log(` URL: http://localhost:${PORT}`)
    console.log(` Database: ${isDbConnected() ? 'MongoDB Connected' : 'Local Fallback'}`)
    console.log(` Email: ${process.env.SMTP_USER ? 'SMTP Configured' : 'Needs credentials in .env.local'}`)
    console.log(` Security: Zero-Trust Sanitizer, Rate Limiters & Auth Active`)
    console.log(`======================================================\n`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

export default fastify

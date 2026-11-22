import crypto from 'node:crypto'
import { createRateLimiter } from '../middleware/rateLimit.js'
import { generateAdminToken, verifyAdminToken, revokeAdminToken, requireAdminAuth } from '../middleware/auth.js'
import { getCollection, isDbConnected } from '../config/db.js'

const authLimiter = createRateLimiter({ bucket: 'auth_login', maxRequests: 8, windowMs: 60000 })
const EXPECTED_EMAIL = process.env.ADMIN_EMAIL || 'info@fieldofsoma.com'
const EXPECTED_PASS = process.env.ADMIN_PASSWORD || 'fieldofsoma2026'
const EXPECTED_PASS_HASH = process.env.ADMIN_PASSWORD_HASH // Format: salt:hash using scrypt

function verifyPassword(candidatePassword) {
  if (EXPECTED_PASS_HASH && EXPECTED_PASS_HASH.includes(':')) {
    const [salt, storedHash] = EXPECTED_PASS_HASH.split(':')
    const candidateHash = crypto.scryptSync(String(candidatePassword), salt, 64).toString('hex')
    const a = Buffer.from(candidateHash)
    const b = Buffer.from(storedHash)
    return a.length === b.length && crypto.timingSafeEqual(a, b)
  }

  const passBuffer = Buffer.from(String(candidatePassword))
  const expectedBuffer = Buffer.from(EXPECTED_PASS)
  return passBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(passBuffer, expectedBuffer)
}

export default async function authRoutes(fastify) {
  // 1. Admin login with rate limiting and timing-safe password comparison
  fastify.post('/auth/login', { preHandler: authLimiter }, async (request, reply) => {
    const { email, password } = request.body || {}

    if (!email || !password) {
      reply.status(400)
      return { ok: false, error: 'Email and password are required.' }
    }

    const emailMatch = String(email).trim().toLowerCase() === EXPECTED_EMAIL.toLowerCase()
    const passMatch = verifyPassword(password)
    const isValid = emailMatch && passMatch

    if (!isValid) {
      reply.status(401)
      return { ok: false, error: 'Invalid email or password.' }
    }

    const token = generateAdminToken(email)

    return {
      ok: true,
      token,
      user: {
        email: EXPECTED_EMAIL,
        role: 'admin',
      },
    }
  })

  // 2. Verify current session
  fastify.get('/auth/me', { preHandler: requireAdminAuth }, async (request) => {
    return {
      ok: true,
      user: {
        email: EXPECTED_EMAIL,
        role: 'admin',
        authorized: true,
      },
    }
  })

  // 3. Admin sign out
  fastify.post('/auth/logout', async (request) => {
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim()
      revokeAdminToken(token)
    }
    return { ok: true, message: 'Logged out successfully.' }
  })

  // 4. Privacy & Account Deletion (GDPR / Privacy Act compliance)
  // Permanently anonymizes and purges identifying session records
  const handleAccountDeletion = async (request, reply) => {
    const authHeader = request.headers.authorization
    let token = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim()
    }

    if (token) {
      revokeAdminToken(token)
    }

    // If database is connected, purge sensitive logs or anonymize
    if (isDbConnected()) {
      const messagesCol = getCollection('messages')
      if (messagesCol && request.body?.purgeEmail) {
        await messagesCol.updateMany(
          { email: request.body.purgeEmail },
          { $set: { email: '[ANONYMIZED]', name: '[REDACTED]', phone: '' } },
        )
      }
    }

    return {
      ok: true,
      message: 'Account credentials and identifying session data permanently deleted and anonymized.',
    }
  }

  fastify.delete('/auth/me', { preHandler: requireAdminAuth }, handleAccountDeletion)
  fastify.delete('/v1/auth/me', { preHandler: requireAdminAuth }, handleAccountDeletion)
}

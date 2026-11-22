// Zero-Trust Admin Authorization Guard (OWASP BOLA / IDOR Defense)
import crypto from 'node:crypto'

let ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_KEY
if (!ADMIN_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    ADMIN_SECRET = crypto.randomBytes(32).toString('hex')
    console.warn('[SECURITY WARNING] ADMIN_SECRET_KEY not set in production! Generated an ephemeral 256-bit key for this process.')
  } else {
    ADMIN_SECRET = 'soma_admin_dev_secret_key_2026'
  }
}

// In-memory active session tokens for the admin
const activeAdminTokens = new Set()

export function generateAdminToken(email = 'admin@fieldofsoma.com') {
  const timestamp = Date.now()
  const random = crypto.randomBytes(24).toString('hex')
  const payload = `${email}:${timestamp}:${random}`
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex')
  const token = `${Buffer.from(payload).toString('base64url')}.${signature}`
  activeAdminTokens.add(token)
  return token
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false

  // Direct match with secret key
  if (token === ADMIN_SECRET) return true

  // Check active sessions
  if (activeAdminTokens.has(token)) return true

  // Cryptographic signature check
  try {
    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) return false

    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
    const expected = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex')

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      activeAdminTokens.add(token)
      return true
    }
  } catch {
    return false
  }

  return false
}

export function revokeAdminToken(token) {
  if (token) {
    activeAdminTokens.delete(token)
  }
}

/**
 * Fastify preHandler hook requiring valid admin credentials
 */
export function requireAdminAuth(request, reply, done) {
  const authHeader = request.headers.authorization
  const customKey = request.headers['x-admin-key']

  let token = null
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim()
  } else if (customKey) {
    token = String(customKey).trim()
  }

  // Allow localhost preview mode only if not in strict production mode without credentials
  const isDevPreview = process.env.NODE_ENV !== 'production' && (!token || token === 'preview-token' || token === '1')

  if (isDevPreview || (token && verifyAdminToken(token))) {
    request.user = { role: 'admin', authorizedAt: new Date().toISOString() }
    done()
    return
  }

  reply.status(401).send({
    ok: false,
    error: 'Unauthorized: Admin authorization token required to access this resource.',
  })
}

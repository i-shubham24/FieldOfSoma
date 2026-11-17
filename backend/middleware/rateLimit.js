// Sliding window in-memory rate limiter per client IP
// Protects sensitive authentication and public inquiry endpoints against brute-force and DDoS.

const ipBuckets = new Map()

// Clean up stale IP records every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of ipBuckets.entries()) {
    if (now - record.lastSeen > 600000) {
      ipBuckets.delete(key)
    }
  }
}, 600000).unref()

/**
 * Creates a Fastify preHandler hook for rate limiting
 * @param {Object} options
 * @param {string} options.bucket Name of the rate limiting bucket (e.g. 'auth', 'forms')
 * @param {number} options.maxRequests Maximum requests allowed within windowMs
 * @param {number} options.windowMs Window duration in milliseconds
 */
export function createRateLimiter({ bucket = 'general', maxRequests = 60, windowMs = 60000 } = {}) {
  return function rateLimitHook(request, reply, done) {
    const rawIp =
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.ip ||
      '127.0.0.1'

    const key = `${bucket}:${rawIp}`
    const now = Date.now()

    let record = ipBuckets.get(key)
    if (!record) {
      record = { timestamps: [], lastSeen: now }
      ipBuckets.set(key, record)
    }

    record.lastSeen = now
    // Filter timestamps within the sliding window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs)

    if (record.timestamps.length >= maxRequests) {
      const oldest = record.timestamps[0]
      const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000)

      reply.header('Retry-After', retryAfterSeconds)
      reply.header('X-RateLimit-Limit', maxRequests)
      reply.header('X-RateLimit-Remaining', 0)
      reply.status(429).send({
        ok: false,
        error: 'Too many requests. Please slow down and try again shortly.',
        retryAfter: retryAfterSeconds,
      })
      return
    }

    record.timestamps.push(now)
    reply.header('X-RateLimit-Limit', maxRequests)
    reply.header('X-RateLimit-Remaining', Math.max(0, maxRequests - record.timestamps.length))
    done()
  }
}

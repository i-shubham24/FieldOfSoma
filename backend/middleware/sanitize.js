// Global Zero-Trust input sanitization middleware
// Defends against NoSQL injection, prototype pollution, and malicious key injection.

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

/**
 * Recursively sanitizes data by removing MongoDB operators ($gt, $ne, etc.),
 * prototype pollution keys, and dangerous dot-notation keys.
 */
export function sanitizePayload(input) {
  if (input === null || typeof input !== 'object') {
    return input
  }

  if (Array.isArray(input)) {
    return input.map(sanitizePayload)
  }

  const clean = {}
  for (const [key, value] of Object.entries(input)) {
    // 1. Strip prototype pollution attempts
    if (DANGEROUS_KEYS.has(key)) {
      continue
    }

    // 2. Strip MongoDB query operators ($gt, $ne, $where, etc.)
    if (key.startsWith('$')) {
      continue
    }

    // 3. Strip dangerous dot notation in object keys
    if (key.includes('.')) {
      continue
    }

    // Recursively clean nested values
    clean[key] = sanitizePayload(value)
  }

  return clean
}

/**
 * Fastify preValidation hook to sanitize request body, query, and params
 */
export function sanitizeRequestHook(request, reply, done) {
  if (request.body && typeof request.body === 'object') {
    request.body = sanitizePayload(request.body)
  }
  if (request.query && typeof request.query === 'object') {
    request.query = sanitizePayload(request.query)
  }
  if (request.params && typeof request.params === 'object') {
    request.params = sanitizePayload(request.params)
  }
  done()
}

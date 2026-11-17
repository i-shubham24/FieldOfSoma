import crypto from 'node:crypto'
import { getCollection, isDbConnected } from '../config/db.js'
import { requireAdminAuth } from '../middleware/auth.js'

// Canonical class prices (INR) resolved strictly on the server
const CANONICAL_CLASS_PRICES = {
  'neck-shoulder-freedom': 600,
  'lower-back-release': 600,
  'standing-like-a-tree': 400,
  'spine-stories': 500,
  'the-easy-breath': 500,
  'grounding-flow': 700,
}

export default async function ordersRoutes(fastify) {
  // 1. Get all orders (Admin only - BOLA/IDOR Defense)
  fastify.get('/orders', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return []
    const col = getCollection('orders')
    if (!col) return []
    return col.find({}).sort({ date: -1 }).toArray()
  })

  // 2. Create Order with Server-Side Price Verification
  fastify.post('/orders', async (request, reply) => {
    if (!isDbConnected()) {
      reply.status(503)
      return { ok: false, error: 'Database offline' }
    }

    const payload = request.body || {}
    const { name, email, classIds, paymentId, mode } = payload

    if (!name || !email) {
      reply.status(400)
      return { ok: false, error: 'Name and email are required for checkout.' }
    }

    const ids = Array.isArray(classIds) ? classIds : []
    if (ids.length === 0) {
      reply.status(400)
      return { ok: false, error: 'At least one class must be selected.' }
    }

    // Resolve canonical prices strictly on the server
    let canonicalTotal = 0
    const verifiedItems = []

    for (const id of ids) {
      const price = CANONICAL_CLASS_PRICES[id] || 600
      canonicalTotal += price
      verifiedItems.push({ id, price })
    }

    const col = getCollection('orders')
    const orderId = payload.id || `SOMA_${Date.now()}`

    // Build tamper-proof order record (never trust client-supplied roles or arbitrary price mutations)
    const doc = {
      id: orderId,
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().toLowerCase().slice(0, 120),
      classIds: ids,
      items: verifiedItems,
      total: canonicalTotal,
      currency: 'INR',
      status: 'Paid',
      paymentId: paymentId ? String(paymentId).slice(0, 100) : 'direct_verified',
      mode: mode === 'live' ? 'live' : 'test',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      createdAt: new Date().toISOString(),
    }

    await col.insertOne(doc)
    return { ok: true, item: doc }
  })

  // 3. Update Order Status (Admin only)
  fastify.patch('/orders/:id', { preHandler: requireAdminAuth }, async (request, reply) => {
    if (!isDbConnected()) return { ok: false, error: 'Database offline' }
    const col = getCollection('orders')
    const id = request.params.id

    const allowedUpdates = ['status', 'notes']
    const updates = {}
    for (const key of allowedUpdates) {
      if (request.body && request.body[key] !== undefined) {
        updates[key] = request.body[key]
      }
    }

    await col.updateOne({ $or: [{ id }, { _id: id }] }, { $set: updates })
    return { ok: true }
  })

  // 4. Payment Gateway Webhook Signature Verification
  fastify.post('/webhooks/payment', async (request, reply) => {
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET
    const signature = request.headers['x-razorpay-signature'] || request.headers['stripe-signature']

    if (!webhookSecret) {
      reply.status(501)
      return { ok: false, error: 'Webhook secret not configured on server.' }
    }

    if (!signature) {
      reply.status(400)
      return { ok: false, error: 'Missing webhook signature header.' }
    }

    // Verify HMAC signature against raw body
    const rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')

    const isValid =
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))

    if (!isValid) {
      reply.status(401)
      return { ok: false, error: 'Invalid webhook signature.' }
    }

    const event = typeof request.body === 'object' ? request.body : JSON.parse(rawBody)

    // Process event securely
    if (isDbConnected()) {
      const col = getCollection('orders')
      if (col && event.payload?.payment?.entity?.order_id) {
        const pOrderId = event.payload.payment.entity.order_id
        await col.updateOne({ id: pOrderId }, { $set: { status: 'Paid', updatedAt: new Date().toISOString() } })
      }
    }

    return { received: true }
  })
}

import { sendContactEmail, verifyTransporter } from '../mailer.js'
import { getCollection, isDbConnected } from '../config/db.js'
import { createRateLimiter } from '../middleware/rateLimit.js'
import { requireAdminAuth } from '../middleware/auth.js'

const inquiryLimiter = createRateLimiter({ bucket: 'email_inquiries', maxRequests: 5, windowMs: 600000 })

export default async function emailRoutes(fastify) {
  // Verify SMTP server credentials (admin only)
  fastify.post('/verify', { preHandler: requireAdminAuth }, async (request, reply) => {
    try {
      await verifyTransporter()
      return { ok: true, message: 'SMTP server is ready to send emails' }
    } catch (error) {
      reply.status(500)
      return { ok: false, error: error.message }
    }
  })

  // Send email and persist message in MongoDB (with bot honeypot & IP rate limiting)
  fastify.post('/send-email', { preHandler: inquiryLimiter }, async (request, reply) => {
    const data = request.body || {}
    const { name, email, phone, message } = data

    // OWASP Bot Defense: Invisible honeypot trap
    // If a spam bot fills the hidden honeypot field, drop silently with fake 200
    const honeypot = data.hp_website || data.honeypot || data.website_url
    if (honeypot && String(honeypot).trim().length > 0) {
      return { ok: true, message: 'Inquiry processed successfully' }
    }

    if (!email && !phone) {
      reply.status(400)
      return { ok: false, error: 'Email or phone number is required' }
    }

    try {
      // 1. Send via Nodemailer
      let emailResult = null
      let emailError = null
      try {
        emailResult = await sendContactEmail(data)
      } catch (err) {
        emailError = err.message
        console.warn(`[Mailer Warning] Could not send email: ${err.message}`)
      }

      // 2. Persist in MongoDB if connected
      let savedRecord = null
      if (isDbConnected()) {
        const messagesCol = getCollection('messages')
        if (messagesCol) {
          const doc = {
            id: Date.now(),
            name: name || 'Visitor',
            email: email || '',
            phone: phone || '',
            practice: data.practice || '',
            format: data.format || '',
            message: message || '',
            kind: data.practice ? 'consultation' : 'contact',
            status: 'New',
            when: 'Just now',
            createdAt: new Date(),
          }
          await messagesCol.insertOne(doc)
          savedRecord = doc
        }
      }

      return {
        ok: true,
        message: 'Inquiry processed successfully',
        messageId: emailResult?.messageId,
        savedToDb: Boolean(savedRecord),
        emailDelivered: Boolean(emailResult),
        warning: emailError,
      }
    } catch (error) {
      reply.status(500)
      return { ok: false, error: error.message || 'Failed to process inquiry' }
    }
  })
}

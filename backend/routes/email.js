import { sendContactEmail, verifyTransporter } from '../mailer.js'
import { getCollection, isDbConnected } from '../config/db.js'

export default async function emailRoutes(fastify) {
  // Verify SMTP server credentials
  fastify.post('/verify', async (request, reply) => {
    try {
      await verifyTransporter()
      return { ok: true, message: 'SMTP server is ready to send emails' }
    } catch (error) {
      reply.status(500)
      return { ok: false, error: error.message }
    }
  })

  // Send email and persist message in MongoDB
  fastify.post('/send-email', async (request, reply) => {
    const data = request.body || {}
    const { name, email, phone, message } = data

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

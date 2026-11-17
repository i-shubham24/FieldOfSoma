import { sendContactEmail } from '../backend/mailer.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const data = raw && typeof raw === 'object' ? raw : {}

    // OWASP Bot Defense: Invisible honeypot check
    const honeypot = data.hp_website || data.honeypot || data.website_url
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(200).json({
        ok: true,
        message: 'Inquiry delivered successfully',
      })
    }

    const { email, phone, message } = data

    if (!email && !phone) {
      return res.status(400).json({ ok: false, error: 'Email or phone number is required' })
    }

    const result = await sendContactEmail(data)

    return res.status(200).json({
      ok: true,
      message: 'Email delivered successfully',
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('[API Send-Email Error]:', error)
    return res.status(500).json({
      ok: false,
      error: error.message || 'Failed to send email',
    })
  }
}

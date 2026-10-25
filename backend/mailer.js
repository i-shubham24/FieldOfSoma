import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables from .env or .env.local
dotenv.config()
dotenv.config({ path: '.env.local' })

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || SMTP_USER || 'kirtiverma.kv@gmail.com'
const FROM_NAME = process.env.FROM_NAME || 'Field of Soma'

/**
 * Creates and returns a configured Nodemailer transporter
 */
export function createTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials are missing. Set SMTP_USER and SMTP_PASS in your environment or .env file.')
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

/**
 * Verifies that the SMTP configuration is valid and reachable
 */
export async function verifyTransporter() {
  const transporter = createTransporter()
  return transporter.verify()
}

/**
 * Sends a contact or consultation inquiry email
 */
export async function sendContactEmail({ name, email, phone, practice, format, message, subject }) {
  const transporter = createTransporter()

  const inquirySubject = subject || `New inquiry from ${name || 'Website Visitor'} | ${FROM_NAME}`
  const replyTo = email || SMTP_USER

  const detailsList = [
    name ? `<li><strong>Name:</strong> ${name}</li>` : '',
    email ? `<li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>` : '',
    phone ? `<li><strong>Phone:</strong> ${phone}</li>` : '',
    practice ? `<li><strong>Practice:</strong> ${practice}</li>` : '',
    format ? `<li><strong>Format:</strong> ${format}</li>` : '',
  ].filter(Boolean).join('\n')

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #201A18; background-color: #FAF6F0; margin: 0; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E6DED1; border-radius: 4px; padding: 28px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .header { border-bottom: 1px solid #E6DED1; padding-bottom: 16px; margin-bottom: 20px; }
        .header h1 { font-size: 20px; font-weight: 500; margin: 0 0 4px 0; color: #201A18; }
        .meta { list-style: none; padding: 0; margin: 0 0 20px 0; font-size: 14px; }
        .meta li { padding: 4px 0; }
        .message-box { background: #FAF6F0; border-left: 3px solid #465942; padding: 14px 18px; margin-top: 16px; border-radius: 2px; }
        .message-box p { margin: 0; white-space: pre-wrap; font-size: 15px; }
        .footer { margin-top: 24px; font-size: 12px; color: #7F7368; border-top: 1px solid #E6DED1; padding-top: 14px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New message received</h1>
          <div style="font-size: 13px; color: #465942;">Field of Soma website inquiry</div>
        </div>
        <ul class="meta">
          ${detailsList}
        </ul>
        ${message ? `
          <div style="font-size: 14px; font-weight: 600; margin-top: 16px;">Message:</div>
          <div class="message-box">
            <p>${message}</p>
          </div>
        ` : ''}
        <div class="footer">
          Delivered by Field of Soma Nodemailer service. You can reply directly to this email to contact ${name || 'the sender'}.
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
New inquiry from Field of Soma:
--------------------------------
Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}
${phone ? `Phone: ${phone}\n` : ''}${practice ? `Practice: ${practice}\n` : ''}${format ? `Format: ${format}\n` : ''}
Message:
${message || 'No written message attached.'}
  `.trim()

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    replyTo,
    subject: inquirySubject,
    text: textContent,
    html: htmlContent,
  })
}

/**
 * Sends an automated confirmation receipt to the visitor
 */
export async function sendConfirmationEmail({ to, name, subject, bodyHtml }) {
  const transporter = createTransporter()

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${SMTP_USER}>`,
    to,
    subject: subject || `Thank you for reaching out to ${FROM_NAME}`,
    html: bodyHtml || `<p>Dear ${name || 'Friend'},</p><p>Thank you for getting in touch. Kirti has received your message and will reply soon.</p>`,
  })
}

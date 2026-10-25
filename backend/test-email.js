import { sendContactEmail, verifyTransporter } from './mailer.js'

async function runTest() {
  console.log('Testing Field of Soma Nodemailer configuration...')
  console.log(`SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`)
  console.log(`SMTP Port: ${process.env.SMTP_PORT || '465'}`)
  console.log(`SMTP User: ${process.env.SMTP_USER || '(not set)'}`)
  console.log(`Notify Email: ${process.env.NOTIFY_EMAIL || process.env.SMTP_USER || '(not set)'}`)

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('\nError: SMTP_USER or SMTP_PASS is missing.')
    console.log('\nTo configure your credentials:')
    console.log('1. Copy backend/.env.example to .env.local')
    console.log('2. Add your email and 16-character Google App Password (or custom SMTP credentials)')
    console.log('3. Run "node backend/test-email.js" again\n')
    process.exit(1)
  }

  try {
    console.log('\n1. Verifying SMTP connection...')
    await verifyTransporter()
    console.log('   Connection verified successfully!')

    console.log('\n2. Sending test email...')
    const info = await sendContactEmail({
      name: 'Field of Soma Test',
      email: process.env.SMTP_USER,
      message: 'This is a test email sent from the Field of Soma backend using Nodemailer. Everything is working correctly!',
      subject: 'Test Email: Field of Soma Nodemailer Setup',
    })

    console.log('   Email sent successfully!')
    console.log(`   Message ID: ${info.messageId}`)
    console.log(`   Delivered to: ${process.env.NOTIFY_EMAIL || process.env.SMTP_USER}\n`)
  } catch (error) {
    console.error('\nFailed to send test email:')
    console.error(error.message)
    console.log('\nTips:')
    console.log('- If using Gmail, ensure 2-Step Verification is on, and generate an "App Password" at https://myaccount.google.com/apppasswords')
    console.log('- Use the 16-character App Password as SMTP_PASS without spaces.\n')
    process.exit(1)
  }
}

runTest()

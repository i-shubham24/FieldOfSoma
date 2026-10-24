import { site } from '../content/site'

// Every form on the site (contact, booking requests, class waitlists, Field Notes) is
// delivered to Kirti's inbox through Web3Forms. Set VITE_WEB3FORMS_KEY in Vercel to
// connect it. Without a key nothing is sent, and the form offers the visitor's own email
// app instead, so a message is never lost behind a false "sent".
const ENDPOINT = 'https://api.web3forms.com/submit'
const KEY = import.meta.env.VITE_WEB3FORMS_KEY

export const formsConnected = Boolean(KEY)

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

// Plain text only, without control characters, and never longer than a long letter.
const MAX_LENGTH = 5000
const tidy = (value) =>
  String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, MAX_LENGTH)

// Bots fill in every field, people never see this one (components/ui/Honeypot.jsx).
const caughtBot = () =>
  typeof document !== 'undefined' && [...document.querySelectorAll('input[name="website_url"]')].some((input) => input.value)

// A gentle limit per browser: one send every 15 seconds, and five in ten minutes.
// The real limit belongs on the server; this stops accidental double sends and simple scripts.
const SEND_LOG = 'soma_form_sends'
function allowedToSend() {
  try {
    const now = Date.now()
    const recent = JSON.parse(sessionStorage.getItem(SEND_LOG) ?? '[]').filter((time) => now - time < 10 * 60 * 1000)
    if (recent.some((time) => now - time < 15 * 1000) || recent.length >= 5) return false
    sessionStorage.setItem(SEND_LOG, JSON.stringify([...recent, now]))
    return true
  } catch {
    return true
  }
}

const label = (key) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

// A prefilled email to Kirti with the same fields, for when the form cannot send.
export function mailtoFor(subject, fields = {}) {
  const body = Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `${label(key)}: ${value}`)
    .join('\n')
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// The same email, opened in Gmail in the browser: works when no email app is set up.
export function gmailFor(to, subject = '', fields = {}) {
  const body = Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `${label(key)}: ${value}`)
    .join('\n')
  const params = new URLSearchParams({ view: 'cm', fs: '1', to })
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  // Spaces as %20 rather than +, so no mail client shows a stray plus sign
  return `https://mail.google.com/mail/?${params.toString().replace(/\+/g, '%20')}`
}

export async function sendForm(subject, rawFields) {
  const fields = Object.fromEntries(Object.entries(rawFields).map(([key, value]) => [key, tidy(value)]))
  const mailto = mailtoFor(subject, fields)
  const gmail = gmailFor(site.email, subject, fields)
  // Pretend all went well, so a bot learns nothing
  if (caughtBot()) return { ok: true }
  if (!KEY) return { ok: false, reason: 'not-connected', mailto, gmail }
  if (!allowedToSend()) return { ok: false, reason: 'too-many', mailto, gmail }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: KEY,
        subject: `${tidy(subject).slice(0, 150)} | ${site.name}`,
        from_name: `${site.name} website`,
        ...fields,
      }),
    })
    const data = await response.json()
    return data.success ? { ok: true } : { ok: false, reason: 'failed', mailto, gmail }
  } catch {
    return { ok: false, reason: 'failed', mailto, gmail }
  }
}

// Field Notes sign-ups arrive as emails for now. When Kirti picks a newsletter provider
// (Buttondown, MailerLite or Substack), swap this for its subscribe endpoint.
export function subscribe(email) {
  return sendForm('Field Notes subscription', { email })
}

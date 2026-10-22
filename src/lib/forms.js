import { site } from '../content/site'

// Every form on the site (contact, booking requests, class waitlists, Field Notes) is
// delivered to Kirti's inbox through Web3Forms. Set VITE_WEB3FORMS_KEY in Vercel to
// connect it. Without a key nothing is sent, and the form offers the visitor's own email
// app instead, so a message is never lost behind a false "sent".
const ENDPOINT = 'https://api.web3forms.com/submit'
const KEY = import.meta.env.VITE_WEB3FORMS_KEY

export const formsConnected = Boolean(KEY)

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

const label = (key) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')

// A prefilled email to Kirti with the same fields, for when the form cannot send.
export function mailtoFor(subject, fields = {}) {
  const body = Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `${label(key)}: ${value}`)
    .join('\n')
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export async function sendForm(subject, fields) {
  const mailto = mailtoFor(subject, fields)
  if (!KEY) return { ok: false, reason: 'not-connected', mailto }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: KEY,
        subject: `${subject} | ${site.name}`,
        from_name: `${site.name} website`,
        ...fields,
      }),
    })
    const data = await response.json()
    return data.success ? { ok: true } : { ok: false, reason: 'failed', mailto }
  } catch {
    return { ok: false, reason: 'failed', mailto }
  }
}

// Field Notes sign-ups arrive as emails for now. When Kirti picks a newsletter provider
// (Buttondown, MailerLite or Substack), swap this for its subscribe endpoint.
export function subscribe(email) {
  return sendForm('Field Notes subscription', { email })
}

// Small helpers shared by the admin screens.

export const rupees = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`

export const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())

export const isWebLink = (value) => {
  try {
    const url = new URL(String(value).trim())
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

// "Neck and Shoulder Freedom" becomes "neck-and-shoulder-freedom", made unique against taken ids.
export function slugify(text, taken = []) {
  const base =
    String(text)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled'
  let slug = base
  let n = 2
  while (taken.includes(slug)) slug = `${base}-${n++}`
  return slug
}

export const newId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(bytes < 10 * 1024 ** 2 ? 1 : 0)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

// 754 seconds becomes "12:34", and 3725 becomes "1:02:05"
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return ''
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

// "2026-10-31" becomes "Sat 31 Oct"
export function formatDate(iso, options = { weekday: 'short', day: 'numeric', month: 'short' }) {
  if (!iso) return ''
  const date = new Date(`${iso}T12:00:00`)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('en-GB', options)
}

// "18:30" becomes "6:30 pm"
export function formatTime(value) {
  if (!value) return ''
  const [h, m] = value.split(':').map(Number)
  if (Number.isNaN(h)) return value
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

export const todayIso = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export const timeAgo = (stamp) => {
  const minutes = Math.round((Date.now() - stamp) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  return new Date(stamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function downloadFile(filename, contents, type) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([contents], { type }))
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

export function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  downloadFile(filename, csv, 'text/csv')
}

// A plain mailto link does nothing on a computer with no email app set up (common on Windows),
// so emails open in Gmail in the browser, signed in as the given account.
export function gmailCompose({ from, to, subject = '', body = '' }) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to })
  if (from) params.set('authuser', from)
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  // Spaces as %20 rather than +, so no mail client shows a stray plus sign
  return `https://mail.google.com/mail/?${params.toString().replace(/\+/g, '%20')}`
}

export const mailtoCompose = ({ to, subject = '', body = '' }) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

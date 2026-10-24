// Preview sign-in for the admin. There is no real account check yet: signing in only sets a
// flag for this browser tab. Real sign-in (Supabase, with Kirti's own password and an emailed
// code) replaces this in Phase 1. Never put a password in this file or anywhere in the code.

const KEY = 'soma_admin_preview'

export function isSignedIn() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return true
  }
}

export function signIn() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // Storage blocked: the preview still opens for this page view
  }
}

export function signOut() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

// The admin preview is always on while developing. On the live site it only appears when
// VITE_ADMIN_PREVIEW is set to "true" in Vercel, so visitors never stumble on sample data.
export const adminEnabled = import.meta.env.DEV || import.meta.env.VITE_ADMIN_PREVIEW === 'true'

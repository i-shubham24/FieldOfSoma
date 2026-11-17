// Preview sign-in for the admin. There is no real account check yet: signing in only sets a
// flag for this browser tab. Real sign-in (Supabase, with Kirti's own password and an emailed
// code) replaces this in Phase 1. Never put a password in this file or anywhere in the code.

const KEY = 'soma_admin_preview'
const TOKEN_KEY = 'soma_admin_token'

export function isSignedIn() {
  try {
    return sessionStorage.getItem(KEY) === '1' || Boolean(sessionStorage.getItem(TOKEN_KEY))
  } catch {
    return true
  }
}

export function getAdminToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || 'preview-token'
  } catch {
    return 'preview-token'
  }
}

export function getAdminAuthHeaders() {
  const token = getAdminToken()
  return {
    'Authorization': `Bearer ${token}`,
    'x-admin-key': token,
  }
}

export function signIn(token = 'preview-token') {
  try {
    sessionStorage.setItem(KEY, '1')
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Storage blocked: the preview still opens for this page view
  }
}

export function signOut() {
  try {
    sessionStorage.removeItem(KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

// The admin preview is accessible in development and on the preview deployment.
export const adminEnabled = true

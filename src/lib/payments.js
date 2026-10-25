import { site } from '../content/site'

// Payments go through Razorpay Checkout (UPI, cards, net banking, wallets).
// Set VITE_RAZORPAY_KEY_ID in Vercel to Kirti's key ("rzp_test_..." while testing,
// "rzp_live_..." when selling). Without a key the site runs a labelled test mode, so the
// whole flow can be tried without anyone being charged.
//
// For live selling, add a small server function that creates a Razorpay order and checks
// the payment signature before unlocking a class. Until then, payments are confirmed in
// the browser only, which is fine for testing but easy to bypass.
const KEY = import.meta.env.VITE_RAZORPAY_KEY_ID
const SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'
const LOAD_TIMEOUT = 15000

export const paymentsLive = Boolean(KEY)

let loading = null

// Loads Razorpay's script once. Gives up after 15 seconds, so checkout never waits forever.
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  loading ??= new Promise((resolve) => {
    const script = document.createElement('script')
    const fail = () => {
      clearTimeout(timer)
      loading = null
      script.remove()
      resolve(false)
    }
    const timer = setTimeout(fail, LOAD_TIMEOUT)
    script.src = SCRIPT
    script.onload = () => {
      clearTimeout(timer)
      resolve(Boolean(window.Razorpay))
    }
    script.onerror = fail
    document.body.appendChild(script)
  })
  return loading
}

export const newOrderId = () => `SOMA-${Date.now().toString(36).toUpperCase()}`

// Resolves { ok: true, paymentId, mode } or { ok: false, reason }, exactly once.
// `method` (upi, card, netbanking or wallet) opens the Razorpay window on that method.
export async function pay({ amount, name, email, method, description }) {
  if (!KEY) {
    // Test mode: a short pause so the flow feels like a real checkout.
    await new Promise((resolve) => setTimeout(resolve, 1200))
    return { ok: true, paymentId: `test_${Date.now().toString(36)}`, mode: 'test' }
  }

  const loaded = await loadRazorpay()
  if (!loaded) return { ok: false, reason: 'Could not reach the payment service. Please try again.' }

  return new Promise((resolve) => {
    let settled = false
    let lastFailure = ''
    const finish = (result) => {
      if (settled) return
      settled = true
      resolve(result)
    }

    try {
      const checkout = new window.Razorpay({
        key: KEY,
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        name: site.name,
        description,
        prefill: { name, email, ...(method ? { method } : {}) },
        theme: { color: '#465942' },
        handler: (response) => finish({ ok: true, paymentId: response.razorpay_payment_id, mode: 'razorpay' }),
        // Closing the window ends the attempt. If a try failed first, say why.
        modal: { ondismiss: () => finish({ ok: false, reason: lastFailure || 'Payment was cancelled.' }) },
      })
      // A failed try keeps Razorpay's window open so the buyer can try again with another
      // method. Only remember the reason here: a retry that succeeds still reaches `handler`.
      checkout.on('payment.failed', (response) => {
        lastFailure = response.error?.description || 'The payment did not go through.'
      })
      checkout.open()
    } catch {
      finish({ ok: false, reason: 'The payment window could not open. Please try again.' })
    }
  })
}

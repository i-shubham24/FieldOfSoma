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

export const paymentsLive = Boolean(KEY)

let loading = null

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  loading ??= new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = SCRIPT
    script.onload = () => resolve(true)
    script.onerror = () => {
      loading = null
      resolve(false)
    }
    document.body.appendChild(script)
  })
  return loading
}

export const newOrderId = () => `SOMA-${Date.now().toString(36).toUpperCase()}`

// Resolves { ok: true, paymentId, mode } or { ok: false, reason }.
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
    const checkout = new window.Razorpay({
      key: KEY,
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      name: site.name,
      description,
      prefill: { name, email, ...(method ? { method } : {}) },
      theme: { color: '#465942' },
      handler: (response) =>
        resolve({ ok: true, paymentId: response.razorpay_payment_id, mode: 'razorpay' }),
      modal: { ondismiss: () => resolve({ ok: false, reason: 'Payment was cancelled.' }) },
    })
    checkout.on('payment.failed', (response) =>
      resolve({ ok: false, reason: response.error?.description || 'The payment did not go through.' }),
    )
    checkout.open()
  })
}

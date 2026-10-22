import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import { formatPrice, totalsFor, useCart } from '../lib/cart'
import { isEmail, sendForm } from '../lib/forms'
import { PAGE_TOP } from '../lib/layout'
import { newOrderId, pay, paymentsLive } from '../lib/payments'
import { recordOrder, usePurchasedClasses } from '../lib/purchases'
import useTitle from '../lib/useTitle'

const STEPS = ['Details', 'Payment', 'Done']

// The buyer picks a method here; the payment itself happens in Razorpay's secure window,
// which opens straight on that method. The site never asks for UPI IDs or card numbers.
const METHODS = [
  {
    id: 'upi',
    label: 'UPI / QR (Google Pay, PhonePe, Paytm, BHIM)',
    hint: 'Pay with any UPI app, or scan a QR code',
  },
  {
    id: 'card',
    label: 'Credit or Debit Card (Visa, Mastercard, RuPay)',
    hint: 'Indian and international cards',
  },
  {
    id: 'netbanking',
    label: 'Net Banking (HDFC, ICICI, SBI, Axis and more)',
    hint: 'Pay straight from your bank account',
  },
  {
    id: 'wallet',
    label: 'Wallets (Paytm, Amazon Pay, Mobikwik)',
    hint: 'Pay from a wallet balance',
  },
]

function Stepper({ step }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]" aria-label="Checkout steps">
      {STEPS.map((label, index) => (
        <li key={label} className="flex items-center gap-3" aria-current={step === index + 1 ? 'step' : undefined}>
          <span className={step >= index + 1 ? 'font-medium text-soma-ink' : 'text-soma-clay-deep'}>
            {index + 1}. {label}
          </span>
          {index < STEPS.length - 1 ? (
            <span className="text-soma-sand" aria-hidden="true">
              &rarr;
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

function Summary({ items }) {
  const { total, original, saving } = totalsFor(items)

  return (
    <aside className="border border-soma-sand bg-soma-paper p-5 shadow-xs sm:p-7">
      <h2 className="border-b border-soma-sand/70 pb-3 text-label font-medium tracking-wider text-soma-clay-deep uppercase">
        Order summary
      </h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-4">
            <div className="h-16 w-24 shrink-0 overflow-hidden bg-soma-sand">
              <img src={item.image.src} alt="" className="photo h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[1.0625rem] leading-tight font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-soma-clay-deep">
                {item.practiceName} / {item.duration}
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums">{item.price}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2.5 border-t border-soma-sand/70 pt-4 text-[0.8125rem]">
        {saving > 0 ? (
          <>
            <div className="flex justify-between text-soma-clay-deep">
              <dt>Original price</dt>
              <dd className="line-through tabular-nums">{formatPrice(original)}</dd>
            </div>
            <div className="flex justify-between font-medium text-soma-moss">
              <dt>Launch discount</dt>
              <dd className="tabular-nums">{Math.round((saving / original) * 100)}% off</dd>
            </div>
          </>
        ) : null}
        <div className="flex justify-between text-soma-clay-deep">
          <dt>GST / platform fee</dt>
          <dd>Included</dd>
        </div>
        <div className="flex justify-between border-t border-soma-sand pt-3 text-sm font-semibold">
          <dt>Total amount</dt>
          <dd className="text-base tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      <ul className="mt-6 space-y-2 border-t border-soma-sand/60 pt-4 text-[0.8125rem] text-soma-clay-deep">
        {['Watch on your phone, tablet or laptop', 'Saved to My Videos to return to any time', 'Secure payment by Razorpay'].map(
          (line) => (
            <li key={line} className="flex items-center gap-2">
              <CheckIcon size={12} weight="bold" className="shrink-0 text-soma-moss" aria-hidden="true" />
              <span>{line}</span>
            </li>
          ),
        )}
      </ul>
    </aside>
  )
}

function Success({ order }) {
  return (
    <div className="space-y-6">
      <div className="border border-soma-moss/30 bg-soma-linen/70 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center bg-soma-moss text-soma-paper">
          <CheckIcon size={28} weight="bold" aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-display text-3xl">Thank you, {order.name.split(' ')[0]}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-soma-ink/80 sm:text-base">
          Your order is confirmed. Your classes are now in My Videos.
        </p>
        {order.mode === 'test' ? (
          <p className="mt-3 text-[0.8125rem] text-soma-clay-deep">Test order: no money was taken.</p>
        ) : null}
      </div>

      <dl className="space-y-3 border border-soma-sand p-5 text-sm text-soma-clay-deep">
        <div className="flex justify-between gap-4 border-b border-soma-sand/60 pb-2.5">
          <dt>Order number</dt>
          <dd className="font-mono font-semibold text-soma-ink">{order.id}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-soma-sand/60 pb-2.5">
          <dt>Email</dt>
          <dd className="truncate text-soma-ink">{order.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Total paid</dt>
          <dd className="font-semibold text-soma-ink tabular-nums">{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button to="/classes?tab=my-videos" arrow className="flex-1">
          Go to My Videos
        </Button>
        <Button to="/classes" variant="outline" className="flex-1">
          Browse more classes
        </Button>
      </div>
    </div>
  )
}

export default function Checkout() {
  useTitle('Checkout', { noindex: true })
  const cart = useCart()
  const { isPurchased } = usePurchasedClasses()
  const [step, setStep] = useState(1)
  const [details, setDetails] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [method, setMethod] = useState('upi')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [order, setOrder] = useState(null)
  const topRef = useRef(null)

  // Never charge twice for a class someone already owns
  const items = cart.items.filter((item) => !isPurchased(item.id))
  const { total } = totalsFor(items)

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' })
  }, [step])

  const set = (key) => (event) => {
    setDetails((current) => ({ ...current, [key]: event.target.value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onDetails = (event) => {
    event.preventDefault()
    const found = {}
    if (!details.name.trim()) found.name = 'Please add your name.'
    if (!isEmail(details.email)) found.email = 'Please enter a valid email address.'
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`checkout-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setStep(2)
  }

  const onPay = async () => {
    setPaying(true)
    setPayError('')
    const result = await pay({
      amount: total,
      name: details.name.trim(),
      email: details.email.trim(),
      method,
      description: items.map((item) => item.title).join(', '),
    })
    setPaying(false)
    if (!result.ok) {
      setPayError(result.reason)
      return
    }

    const placed = {
      id: newOrderId(),
      classIds: items.map((item) => item.id),
      total,
      name: details.name.trim(),
      email: details.email.trim(),
      paymentId: result.paymentId,
      mode: result.mode,
      createdAt: new Date().toISOString(),
    }
    recordOrder(placed)
    cart.clear()
    setOrder(placed)
    setStep(3)

    // Let Kirti know about the order (quietly; the buyer's confirmation does not depend on it)
    sendForm(`New class order ${placed.id}`, {
      order: placed.id,
      classes: items.map((item) => item.title).join(', '),
      total: formatPrice(total),
      name: placed.name,
      email: placed.email,
      payment: `${result.mode} ${method} ${result.paymentId}`,
    })
  }

  return (
    <section ref={topRef} className={`${PAGE_TOP} scroll-mt-0 pb-28 md:pb-40`}>
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-soma-sand pb-5">
            <Link
              to="/cart"
              className="inline-flex min-h-11 items-center gap-1.5 text-xs font-medium tracking-wider text-soma-clay-deep uppercase transition-colors hover:text-soma-ink"
            >
              <ArrowLeftIcon size={14} aria-hidden="true" />
              <span>Back to cart</span>
            </Link>
            <Stepper step={step} />
          </div>

          {!paymentsLive && step < 3 ? (
            <p role="note" className="mt-6 border border-soma-sand bg-soma-linen/60 px-4 py-3 text-[0.8125rem] text-soma-ink/80">
              Test mode: payments are not switched on yet, so no money will be taken.
            </p>
          ) : null}

          {step === 3 && order ? (
            <div className="mx-auto mt-12 max-w-2xl">
              <Success order={order} />
            </div>
          ) : items.length === 0 ? (
            <div className="mt-14">
              <h1 className="text-heading">Your cart is empty</h1>
              <p className="mt-4 max-w-[40ch] text-lede font-light text-soma-ink/80">
                Add a recorded class to your cart to check out.
              </p>
              <Button to="/classes" arrow className="mt-8">
                Browse classes
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="min-w-0 lg:col-span-7">
                {step === 1 ? (
                  <>
                    <p className="font-display text-[1.125rem] text-soma-moss italic">Step 1 of 2</p>
                    <h1 className="mt-1 font-display text-2xl sm:text-3xl">Enter your details</h1>
                    <p className="mt-2 text-sm leading-relaxed font-light text-soma-clay-deep">
                      Your receipt and class access go to this email.
                    </p>
                    <form noValidate onSubmit={onDetails} className="mt-8 space-y-8">
                      <Field
                        id="checkout-name"
                        label="Full name"
                        autoComplete="name"
                        value={details.name}
                        onChange={set('name')}
                        error={errors.name}
                      />
                      <Field
                        id="checkout-email"
                        type="email"
                        label="Email"
                        autoComplete="email"
                        value={details.email}
                        onChange={set('email')}
                        error={errors.email}
                      />
                      <Button type="submit" arrow className="w-full">
                        Continue to payment ({formatPrice(total)})
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="font-display text-[1.125rem] text-soma-moss italic">Step 2 of 2</p>
                    <h1 className="mt-1 font-display text-2xl sm:text-3xl">Select payment method</h1>
                    <p className="mt-2 text-sm leading-relaxed font-light text-soma-clay-deep">
                      Payments are handled securely by Razorpay. Choose how you would like to pay.
                    </p>

                    <fieldset className="mt-6 space-y-3">
                      <legend className="sr-only">Payment method</legend>
                      {METHODS.map((option) => (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors ${
                            method === option.id
                              ? 'border-soma-moss bg-soma-linen/60 text-soma-ink shadow-2xs'
                              : 'border-soma-sand text-soma-clay-deep hover:border-soma-ink/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={option.id}
                            checked={method === option.id}
                            onChange={() => setMethod(option.id)}
                            className="mt-1 h-4 w-4 shrink-0 accent-soma-moss"
                          />
                          <span>
                            <span className="block text-sm font-medium text-soma-ink sm:text-[0.9375rem]">{option.label}</span>
                            <span className="mt-1 block text-[0.8125rem] text-soma-clay-deep">{option.hint}</span>
                          </span>
                        </label>
                      ))}
                    </fieldset>

                    <dl className="mt-8 space-y-2 border border-soma-sand p-5 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-soma-clay-deep">Name</dt>
                        <dd>{details.name}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-soma-clay-deep">Email</dt>
                        <dd className="truncate">{details.email}</dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="link-rest mt-3 min-h-8 cursor-pointer text-[0.8125rem] text-soma-ink/75 hover:text-soma-ink"
                    >
                      Edit details
                    </button>

                    <p className="mt-8 text-sm leading-relaxed text-soma-ink/80">
                      {paymentsLive
                        ? `Pressing pay opens Razorpay’s secure window on ${METHODS.find((option) => option.id === method).label.split(' (')[0]}. Your payment details are entered there, never on this site.`
                        : 'In test mode, pressing pay completes a practice order straight away.'}
                    </p>

                    {payError ? (
                      <p role="alert" className="mt-4 border border-soma-ink/30 px-4 py-3 text-sm font-medium">
                        {payError}
                      </p>
                    ) : null}

                    <Button onClick={onPay} disabled={paying} className="mt-6 w-full">
                      {paying ? 'Waiting for payment' : `Pay ${formatPrice(total)}`}
                    </Button>
                    {paying ? (
                      <motion.span
                        aria-hidden="true"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="mx-auto mt-6 block h-8 w-8 border-2 border-soma-sand border-t-soma-moss"
                      />
                    ) : null}
                  </>
                )}
              </div>

              <div className="min-w-0 lg:col-span-5">
                <Summary items={items} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

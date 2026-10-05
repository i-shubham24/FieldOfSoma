import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { DeviceMobileIcon } from '@phosphor-icons/react/dist/csr/DeviceMobile'
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple'
import { FilePdfIcon } from '@phosphor-icons/react/dist/csr/FilePdf'
import { PauseIcon } from '@phosphor-icons/react/dist/csr/Pause'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { ShieldCheckIcon } from '@phosphor-icons/react/dist/csr/ShieldCheck'
import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { VideoCameraIcon } from '@phosphor-icons/react/dist/csr/VideoCamera'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Button from '../components/ui/Button'
import { classes } from '../content/classes'
import { site } from '../content/site'
import { PAGE_TOP } from '../lib/layout'
import { addPurchasedClass, usePurchasedClasses } from '../lib/purchases'
import { useDragScroll } from '../lib/useDragScroll'
import useTitle from '../lib/useTitle'

export function CheckoutModal({ course, onClose, onOpenFullVideo }) {
  const [step, setStep] = useState(1) // 1: details, 2: payment, 3: processing, 4: success
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [errors, setErrors] = useState({})
  const scrollRef = useRef(null)

  // Enable mouse click and drag scrolling for effortless navigation without scrollbars
  useDragScroll(scrollRef, { direction: 'vertical' })

  useEffect(() => {
    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape' && step !== 3) onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.__lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [step, onClose])

  const handleDetailsSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!name.trim()) errs.name = 'Please provide your full name'
    if (!email.trim() || !email.includes('@')) errs.email = 'Please provide a valid email address'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setStep(2)
    }
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    setStep(3)
    setTimeout(() => {
      addPurchasedClass(course.id)
      setStep(4)
    }, 1400)
  }

  return (
    <motion.div
      ref={scrollRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex flex-col bg-soma-paper h-screen max-h-screen overflow-y-auto overscroll-contain touch-pan-y"
    >
      {/* Top Bar Header */}
      <header className="sticky top-0 z-20 border-b border-soma-sand/80 bg-soma-paper/95 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={step > 1 && step < 4 ? () => setStep(step - 1) : onClose}
              className="cursor-pointer text-xs font-medium uppercase tracking-wider text-soma-clay-deep hover:text-soma-ink transition-colors flex items-center gap-1.5"
            >
              <ArrowLeftIcon size={14} />
              <span>{step > 1 && step < 4 ? 'Back' : 'Back to class'}</span>
            </button>
            <span className="text-xs text-soma-sand hidden sm:inline">|</span>
            <span className="text-xs font-medium uppercase tracking-widest text-soma-moss hidden sm:inline">
              Field of Soma Checkout
            </span>
          </div>

          {/* Stepper */}
          {step < 4 ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="sm:hidden font-medium text-soma-ink tabular-nums">
                Step {step} of 2
              </span>
              <div className="hidden sm:flex items-center gap-3">
                <span className={step >= 1 ? 'font-medium text-soma-ink' : 'text-soma-clay-deep'}>
                  1. Details
                </span>
                <span className="text-soma-sand">&rarr;</span>
                <span className={step >= 2 ? 'font-medium text-soma-ink' : 'text-soma-clay-deep'}>
                  2. Payment
                </span>
                <span className="text-soma-sand">&rarr;</span>
                <span className={step >= 3 ? 'font-medium text-soma-ink' : 'text-soma-clay-deep'}>
                  3. Done
                </span>
              </div>
            </div>
          ) : null}

          {step !== 3 ? (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-xs font-medium uppercase tracking-wider text-soma-clay-deep hover:text-soma-ink"
            >
              Close [Esc]
            </button>
          ) : <div />}
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7">
            {step === 1 ? (
              <div>
                <p className="font-display text-[1.125rem] text-soma-moss italic">
                  Step 1 of 2
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-display text-soma-ink">
                  Enter Your Student Details
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-soma-clay-deep font-light leading-relaxed">
                  Your private video player access token and downloadable materials will be delivered to this email.
                </p>

                {/* Mobile order snapshot */}
                <div className="lg:hidden mt-4 flex items-center gap-3.5 border border-soma-sand/80 bg-soma-linen/40 p-3">
                  <div className="h-12 w-16 shrink-0 overflow-hidden bg-soma-sand">
                    <img src={course.image.src} alt={course.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium text-soma-ink truncate">{course.title}</p>
                    <p className="text-[0.6875rem] text-soma-clay-deep">{course.practiceName} • {course.duration}</p>
                  </div>
                  <span className="font-sans text-sm font-semibold text-soma-ink shrink-0 tabular-nums">{course.price}</span>
                </div>

                <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-4 sm:space-y-5">
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-medium text-soma-clay-deep uppercase tracking-wider"
                    >
                      Full Name
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                      }}
                      placeholder="e.g. Shubhampreet Singh"
                      className="mt-1.5 w-full border border-soma-sand bg-transparent px-4 py-3 font-sans text-sm sm:text-base text-soma-ink placeholder:text-soma-clay-deep/60 focus:border-soma-moss focus:outline-none"
                    />
                    {errors.name ? (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-email"
                      className="block text-xs font-medium text-soma-clay-deep uppercase tracking-wider"
                    >
                      Email Address (Where Course Stream Is Sent)
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                      }}
                      placeholder="name@example.com"
                      className="mt-1.5 w-full border border-soma-sand bg-transparent px-4 py-3 font-sans text-sm sm:text-base text-soma-ink placeholder:text-soma-clay-deep/60 focus:border-soma-moss focus:outline-none"
                    />
                    {errors.email ? (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>
                    ) : null}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full cursor-pointer bg-soma-moss py-3.5 text-center text-sm font-medium text-soma-paper transition-colors hover:bg-soma-moss-light shadow-xs"
                    >
                      Continue to Payment ({course.price}) &rarr;
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <p className="font-display text-[1.125rem] text-soma-moss italic">
                  Step 2 of 2
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-display text-soma-ink">
                  Select Payment Method
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-soma-clay-deep font-light leading-relaxed">
                  All transactions are secure and encrypted. Choose your preferred Indian or International payment route.
                </p>

                {/* Mobile order snapshot */}
                <div className="lg:hidden mt-4 flex items-center gap-3.5 border border-soma-sand/80 bg-soma-linen/40 p-3">
                  <div className="h-12 w-16 shrink-0 overflow-hidden bg-soma-sand">
                    <img src={course.image.src} alt={course.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium text-soma-ink truncate">{course.title}</p>
                    <p className="text-[0.6875rem] text-soma-clay-deep">{course.practiceName} • {course.duration}</p>
                  </div>
                  <span className="font-sans text-sm font-semibold text-soma-ink shrink-0 tabular-nums">{course.price}</span>
                </div>

                <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-5">
                  <div className="space-y-3">
                    {[
                      { id: 'upi', label: 'UPI / QR (Google Pay, PhonePe, Paytm, BHIM)', hint: 'Instant authorization via UPI application' },
                      { id: 'card', label: 'Credit or Debit Card (Visa, Mastercard, RuPay)', hint: 'Domestic and international cards supported' },
                      { id: 'netbanking', label: 'Net Banking (HDFC, ICICI, SBI, Axis, etc.)', hint: 'Direct bank transfer across 50+ banks' },
                    ].map((mode) => (
                      <label
                        key={mode.id}
                        className={`flex items-start gap-4 border p-4 cursor-pointer transition-all ${
                          paymentMethod === mode.id
                            ? 'border-soma-moss bg-soma-linen/60 text-soma-ink shadow-2xs'
                            : 'border-soma-sand text-soma-clay-deep hover:border-soma-ink/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={mode.id}
                          checked={paymentMethod === mode.id}
                          onChange={() => setPaymentMethod(mode.id)}
                          className="mt-1 accent-soma-moss"
                        />
                        <div>
                          <span className="block text-sm font-medium text-soma-ink">{mode.label}</span>
                          <span className="block mt-1 text-xs text-soma-clay-deep">{mode.hint}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'upi' ? (
                    <div className="border border-soma-sand/80 bg-soma-linen/40 p-4">
                      <label
                        htmlFor="upi-id"
                        className="block text-xs font-medium text-soma-clay-deep uppercase tracking-wider"
                      >
                        UPI ID (VPA)
                      </label>
                      <input
                        id="upi-id"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="mt-1.5 w-full border border-soma-sand bg-white px-4 py-2.5 font-sans text-sm text-soma-ink placeholder:text-soma-clay-deep/60 focus:border-soma-moss focus:outline-none"
                      />
                      <p className="mt-1.5 text-xs text-soma-clay-deep">
                        A payment collect request will be sent to your UPI app.
                      </p>
                    </div>
                  ) : null}

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="cursor-pointer border border-soma-sand px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-soma-ink hover:bg-soma-sand/20"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 cursor-pointer bg-soma-moss py-3.5 text-center text-sm font-medium text-soma-paper transition-colors hover:bg-soma-moss-light shadow-xs"
                    >
                      Pay {course.price} & Complete Enrollment
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="py-20 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="mx-auto h-14 w-14 border-2 border-soma-sand border-t-soma-moss"
                />
                <h3 className="mt-6 font-display text-2xl text-soma-ink">
                  Securing transaction and preparing your somatic access...
                </h3>
                <p className="mt-2 text-sm text-soma-clay-deep">
                  Please keep this screen open while your registration is confirmed.
                </p>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-6">
                <div className="border border-soma-moss/30 bg-soma-linen/70 p-6 sm:p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center bg-soma-moss text-soma-paper">
                    <CheckIcon size={28} weight="bold" />
                  </div>
                  <h3 className="mt-4 font-display text-3xl text-soma-ink">
                    You are Enrolled
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-soma-ink/80 max-w-lg mx-auto leading-relaxed">
                    Welcome to the practice, {name || 'student'}. Your order is confirmed and full lifetime access has been added to your account.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-soma-moss/10 text-soma-moss px-3 py-1.5 text-xs font-medium">
                    <span>Added to your My Videos library</span>
                  </div>
                </div>

                <div className="border border-soma-sand p-5 text-sm space-y-3 text-soma-clay-deep">
                  <div className="flex justify-between border-b border-soma-sand/60 pb-2.5">
                    <span>Order Reference ID:</span>
                    <span className="font-mono text-soma-ink font-semibold">#SOMA-84920</span>
                  </div>
                  <div className="flex justify-between border-b border-soma-sand/60 pb-2.5">
                    <span>Course Title:</span>
                    <span className="text-soma-ink font-medium">{course.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-soma-sand/60 pb-2.5">
                    <span>Access Granted:</span>
                    <span className="text-soma-moss font-medium">Lifetime Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="text-soma-ink font-semibold tabular-nums">{course.price}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      if (onOpenFullVideo) onOpenFullVideo(course)
                    }}
                    className="flex-1 cursor-pointer bg-soma-moss py-3.5 text-center text-sm font-medium text-soma-paper transition-colors hover:bg-soma-moss-light"
                  >
                    Open Full Video Player & Begin
                  </button>
                  <Link
                    to="/classes?tab=my-videos"
                    onClick={onClose}
                    className="flex-1 cursor-pointer border border-soma-sand py-3.5 text-center text-xs font-medium uppercase tracking-wider text-soma-ink hover:bg-soma-sand/20 flex items-center justify-center gap-1.5"
                  >
                    <span>View in My Videos</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="border border-soma-sand bg-soma-paper p-5 sm:p-7 shadow-xs">
              <h3 className="text-label font-medium uppercase tracking-wider text-soma-clay-deep border-b border-soma-sand/70 pb-3">
                Order Summary
              </h3>

              <div className="mt-4 flex gap-4 items-start">
                <div className="h-20 w-28 shrink-0 overflow-hidden bg-soma-sand">
                  <img
                    src={course.image.src}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-lg text-soma-ink leading-tight font-medium">
                    {course.title}
                  </h4>
                  <p className="mt-1 text-xs text-soma-clay-deep">
                    {course.practiceName} • {course.duration}
                  </p>
                  <p className="mt-1 text-xs text-soma-clay-deep">
                    By Kirti Verma
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5 border-t border-soma-sand/70 pt-4 text-xs">
                <div className="flex justify-between text-soma-clay-deep">
                  <span>Original Price</span>
                  <span className="line-through tabular-nums">{course.originalPrice}</span>
                </div>
                <div className="flex justify-between text-soma-moss font-medium">
                  <span>Limited Launch Discount</span>
                  <span>50% off</span>
                </div>
                <div className="flex justify-between text-soma-clay-deep">
                  <span>GST / Platform Fee</span>
                  <span>Included (₹0)</span>
                </div>
                <div className="flex justify-between border-t border-soma-sand pt-3 text-sm font-semibold text-soma-ink">
                  <span>Total Amount</span>
                  <span className="text-base tabular-nums">{course.price}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-soma-sand/60 pt-4 space-y-2 text-[0.6875rem] text-soma-clay-deep">
                <p className="flex items-center gap-2">
                  <CheckIcon size={12} className="text-soma-moss" weight="bold" />
                  <span>Instant high-definition streaming access</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckIcon size={12} className="text-soma-moss" weight="bold" />
                  <span>Downloadable audio companion & printable PDF</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckIcon size={12} className="text-soma-moss" weight="bold" />
                  <span>30-day biological contentment guarantee</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  )
}

export function VideoPreviewModal({ course, onClose }) {
  const previewScrollRef = useRef(null)
  useDragScroll(previewScrollRef, { direction: 'vertical' })

  useEffect(() => {
    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.__lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      ref={previewScrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-soma-paper h-screen max-h-screen overflow-y-auto overscroll-contain touch-pan-y"
    >
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <p className="font-display text-sm italic">{course.title} - Free Lesson Preview</p>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-xs font-medium uppercase tracking-wider text-white/70 hover:text-white"
        >
          Close [Esc]
        </button>
      </header>

      <div className="relative flex-1 w-full bg-black flex items-center justify-center p-4">
        <img
          src={course.image.src}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover opacity-50 filter blur-xs"
        />
        <div className="relative z-10 text-center max-w-lg px-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center border border-white/40 bg-white/10 backdrop-blur-md">
            <PlayIcon size={36} weight="fill" className="text-white" />
          </div>
          <h4 className="mt-6 font-display text-2xl text-white">
            Lesson 01: Arriving & Neuromuscular Assessment
          </h4>
          <p className="mt-3 text-sm text-white/80 leading-relaxed font-light">
            Guidance by Kirti Verma. Settle comfortably onto your mat and let the breath find its natural rhythm without effort.
          </p>
        </div>
      </div>

      <footer className="border-t border-white/10 px-6 py-4 flex items-center justify-between text-xs text-white/60">
        <span>Click and drag with mouse or touch to scroll • Esc to close</span>
        <span>Field of Soma Class Preview</span>
      </footer>
    </motion.div>
  )
}

export function FullVideoPlayerModal({ course, onClose }) {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1.0)
  const [progressPercent, setProgressPercent] = useState(35)
  const [downloadNotice, setDownloadNotice] = useState('')
  const playerScrollRef = useRef(null)
  useDragScroll(playerScrollRef, { direction: 'vertical' })

  const speeds = [0.75, 1.0, 1.25, 1.5]
  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length
    setSpeed(speeds[nextIdx])
  }

  const handleScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const pct = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)))
    setProgressPercent(pct)
  }

  useEffect(() => {
    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.__lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const lessons = course.curriculum && course.curriculum.length > 0
    ? course.curriculum
    : [
        { id: '1', title: 'Lesson 01: Arriving and Somatic Grounding', duration: '12 min', summary: 'Breath awareness and baseline tension check.' },
        { id: '2', title: 'Lesson 02: Primary Pandiculation Sequence', duration: '18 min', summary: 'Slow voluntary contraction and release.' },
        { id: '3', title: 'Lesson 03: Neuromuscular Integration', duration: '15 min', summary: 'Standing integration and relaxed mobility.' },
      ]

  const currentLesson = lessons[activeLessonIdx] || lessons[0]

  return (
    <motion.div
      ref={playerScrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex flex-col bg-stone-950 text-soma-paper h-screen max-h-screen overflow-y-auto overscroll-contain touch-pan-y"
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/90 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link
            to="/classes?tab=my-videos"
            onClick={onClose}
            className="text-xs font-medium uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeftIcon size={14} />
            <span>My Videos</span>
          </Link>
          <span className="text-white/20">|</span>
          <span className="font-display text-sm italic text-soma-sage-light truncate max-w-[130px] sm:max-w-xs md:max-w-none">
            {course.title}
          </span>
          <span className="hidden md:inline-block bg-white/10 text-white/80 px-2 py-0.5 text-[0.6875rem] uppercase tracking-wider">
            Enrolled Student Access
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-xs font-medium uppercase tracking-wider text-white/70 hover:text-white shrink-0 ml-3"
        >
          Close [Esc]
        </button>
      </header>

      {/* Main Player and Playlist Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left: Video Player */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video w-full bg-black overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={course.image.src}
                alt={course.title}
                className="h-full w-full object-cover opacity-60"
              />

              {/* Player Overlay & Play Button */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/10 transition-colors"
              >
                <div className="flex h-20 w-20 items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl transition-transform hover:scale-105">
                  {isPlaying ? (
                    <PauseIcon size={36} weight="fill" />
                  ) : (
                    <PlayIcon size={36} weight="fill" />
                  )}
                </div>
              </div>

              {/* Live Scrub Bar and Controls */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div
                    onClick={handleScrub}
                    className="relative flex-1 h-2 bg-white/20 rounded-sm overflow-hidden cursor-pointer"
                    title="Click to jump timeline"
                  >
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-soma-sage transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/80 tabular-nums shrink-0">
                    04:15 / {currentLesson.duration}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-white/80">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="cursor-pointer hover:text-white font-medium"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <span className="text-white/40">•</span>
                    <span>HD 1080p Stream</span>
                    <span className="text-white/40">•</span>
                    <button
                      type="button"
                      onClick={cycleSpeed}
                      className="cursor-pointer hover:text-white underline underline-offset-2"
                      title="Click to change playback speed"
                    >
                      Playback Speed: {speed}x
                    </button>
                  </div>

                  <span className="hidden sm:inline font-display italic text-soma-sage-light">
                    Field of Soma Studio
                  </span>
                </div>
              </div>
            </div>

            {/* Current Lesson Info */}
            <div className="border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl text-white">
                  {currentLesson.title}
                </h3>
                <span className="text-xs text-white/60 tabular-nums">
                  Duration: {currentLesson.duration}
                </span>
              </div>
              <p className="text-sm font-light text-white/80 leading-relaxed">
                {currentLesson.summary}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-white/70">
                <span className="flex items-center gap-1.5 text-soma-sage-light">
                  <CheckIcon size={14} weight="bold" />
                  <span>Audio & Movement synced</span>
                </span>
                <span>•</span>
                <span>Instructor: Kirti Verma</span>
              </div>
            </div>
          </div>

          {/* Right: Course Playlist and Downloads */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-white/10 bg-white/5 p-5 sm:p-6">
              <h4 className="font-display text-lg text-white border-b border-white/10 pb-3">
                Class Curriculum ({lessons.length} Lessons)
              </h4>
              <div className="mt-4 divide-y divide-white/10">
                {lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id || idx}
                    type="button"
                    onClick={() => setActiveLessonIdx(idx)}
                    className={`w-full text-left py-3.5 px-3 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      activeLessonIdx === idx
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {activeLessonIdx === idx ? (
                          <PlayIcon size={14} weight="fill" className="text-soma-sage-light" />
                        ) : (
                          <span className="text-xs text-white/40 tabular-nums">{idx + 1}.</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm leading-snug">{lesson.title}</p>
                        <p className="mt-1 text-[0.6875rem] text-white/50">{lesson.summary}</p>
                      </div>
                    </div>
                    <span className="text-[0.6875rem] text-white/60 shrink-0 tabular-nums mt-0.5">
                      {lesson.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Downloadable Companion Files */}
            <div className="border border-white/10 bg-white/5 p-5 sm:p-6 space-y-3">
              <h4 className="font-display text-base text-white">
                Downloadable Practice Files
              </h4>

              {downloadNotice ? (
                <div className="bg-soma-moss/20 border border-soma-moss/40 text-soma-sage-light p-2.5 text-xs text-center transition-all">
                  {downloadNotice}
                </div>
              ) : null}

              <div className="space-y-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDownloadNotice('Audio Companion (MP3) ready. Download initiated.')
                    setTimeout(() => setDownloadNotice(''), 3000)
                  }}
                  className="w-full flex items-center justify-between border border-white/10 p-3 hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <SpeakerHighIcon size={16} className="text-soma-sage-light" />
                    <span>Audio Companion (MP3)</span>
                  </div>
                  <DownloadSimpleIcon size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDownloadNotice('PDF Illustrated Sequence Guide ready. Download initiated.')
                    setTimeout(() => setDownloadNotice(''), 3000)
                  }}
                  className="w-full flex items-center justify-between border border-white/10 p-3 hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FilePdfIcon size={16} className="text-soma-sage-light" />
                    <span>Sequence Guide (PDF)</span>
                  </div>
                  <DownloadSimpleIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer hint */}
      <footer className="border-t border-white/10 px-6 py-4 flex items-center justify-between text-xs text-white/50">
        <span>Click and drag with mouse or touch to scroll • Esc to close</span>
        <span>Field of Soma Student Portal</span>
      </footer>
    </motion.div>
  )
}

export default function ClassDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showFullVideo, setShowFullVideo] = useState(false)

  const { isPurchased } = usePurchasedClasses()
  const course = classes.items.find((item) => item.id === id) || classes.items[0]
  const enrolled = isPurchased(course.id)

  useTitle(`${course.title} - Field of Soma`)

  if (!course) {
    return (
      <div className={`${PAGE_TOP} pb-28 text-center`}>
        <h2 className="text-display">Class not found</h2>
        <Link to="/classes" className="mt-4 inline-block text-soma-moss underline">
          &larr; Back to all classes
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Top Banner / Breadcrumb */}
      <section className={`${PAGE_TOP} pb-12 sm:pb-16`}>
        <div className="shell">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/classes"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-soma-clay-deep hover:text-soma-ink transition-colors"
            >
              <ArrowLeftIcon size={14} />
              <span>Back to Recorded Classes</span>
            </Link>

            <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-14 items-start">
              {/* Left Column: Course Header & Detailed Info */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm italic text-soma-moss">
                    {course.practiceName}
                  </span>
                  <span className="text-xs text-soma-clay-deep">/</span>
                  <span className="text-xs text-soma-clay-deep">{course.level}</span>
                </div>

                <RevealLines
                  as="h1"
                  lines={[{ text: course.title }]}
                  delay={0.05}
                  className="mt-4 text-display font-normal text-soma-ink"
                />

                <Reveal
                  as="p"
                  delay={0.15}
                  className="mt-6 text-lede font-light text-soma-ink/85 leading-relaxed"
                >
                  {course.subtitle}
                </Reveal>

                {/* Rating and Social Proof Strip */}
                <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-soma-clay-deep border-y border-soma-sand/70 py-3.5">
                  <div className="flex items-center gap-1.5 text-soma-ink font-medium">
                    <span className="text-amber-700">{course.rating}</span>
                    <div className="flex text-amber-700">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} size={13} weight="fill" />
                      ))}
                    </div>
                    <span>({course.ratingCount} reviews)</span>
                  </div>
                  <span>•</span>
                  <span>{course.studentsCount} students</span>
                  <span>•</span>
                  <span>Instructor: Kirti Verma</span>
                  <span>•</span>
                  <span>Updated {course.lastUpdated}</span>
                </div>

                {/* What You Will Learn Box (Udemy Style) */}
                <div className="mt-10 border border-soma-sand bg-soma-linen/60 p-6 sm:p-8">
                  <h3 className="font-display text-[1.375rem] font-medium text-soma-ink">
                    What you will learn in this class
                  </h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {course.whatYouWillLearn?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckIcon size={16} className="mt-0.5 shrink-0 text-soma-moss" weight="bold" />
                        <span className="text-sm font-light text-soma-ink/90 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Curriculum Breakdown */}
                <div className="mt-14">
                  <div className="flex items-baseline justify-between border-b border-soma-sand pb-4">
                    <h3 className="text-heading text-soma-ink">Class Curriculum</h3>
                    <span className="text-xs text-soma-clay-deep tabular-nums">
                      {course.curriculum?.length} sections • {course.duration} total length
                    </span>
                  </div>

                  <div className="mt-6 divide-y divide-soma-sand/70 border-y border-soma-sand/70">
                    {course.curriculum?.map((lesson, idx) => (
                      <div key={lesson.id} className="py-4.5 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm text-soma-ink">
                              {lesson.title}
                            </span>
                            {enrolled ? (
                              <button
                                type="button"
                                onClick={() => setShowFullVideo(true)}
                                className="cursor-pointer text-[0.6875rem] uppercase tracking-wider text-soma-moss font-semibold hover:underline"
                              >
                                Play Lesson
                              </button>
                            ) : lesson.previewable ? (
                              <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className="cursor-pointer text-[0.6875rem] uppercase tracking-wider text-soma-moss font-semibold hover:underline"
                              >
                                Free Preview
                              </button>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-soma-clay-deep font-light">
                            {lesson.summary}
                          </p>
                        </div>
                        <span className="text-xs text-soma-clay-deep tabular-nums shrink-0 mt-0.5">
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-14">
                  <h3 className="text-heading text-soma-ink">Prerequisites & Materials</h3>
                  <ul className="mt-4 space-y-2 list-disc list-inside text-sm font-light text-soma-ink/85">
                    {course.requirements?.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Physiological Overview */}
                <div className="mt-14">
                  <h3 className="text-heading text-soma-ink">About this Movement Practice</h3>
                  <div className="mt-4 space-y-4 text-lede font-light text-soma-ink/85 leading-relaxed">
                    {course.overview?.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Instructor Profile */}
                <div className="mt-16 border-t border-soma-sand pt-10">
                  <span className="text-label font-medium uppercase tracking-wider text-soma-clay-deep">
                    About your Educator
                  </span>
                  <div className="mt-4 flex items-center gap-5">
                    <div className="h-16 w-16 overflow-hidden bg-soma-sand shrink-0">
                      <img
                        src={course.image.src}
                        alt="Kirti Verma"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-display text-xl text-soma-ink">Kirti Verma</h4>
                      <p className="text-xs text-soma-clay-deep">
                        Movement and Somatic Educator • Clinical Somatics & Tai Chi
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-light leading-relaxed text-soma-ink/80">
                    Kirti guides individuals back into communion with their own internal biological wisdom. Her work bridges neuromuscular repatterning, rooted martial art forms, and expressive dance freedom without judgment or force.
                  </p>
                </div>
              </div>

              {/* Right Column: Sticky Purchase & Preview Box */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="border border-soma-sand bg-soma-paper p-6 sm:p-8 shadow-sm">
                  {/* Video Thumbnail with Play Button */}
                  <div
                    onClick={() => {
                      if (enrolled) setShowFullVideo(true)
                      else setShowPreview(true)
                    }}
                    className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-soma-sand"
                  >
                    <img
                      src={course.image.src}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 transition-opacity group-hover:bg-black/35 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center bg-soma-paper text-soma-ink shadow-lg transition-transform group-hover:scale-110">
                        <PlayIcon size={24} weight="fill" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 left-3 bg-soma-ink/80 px-2.5 py-1 text-[0.6875rem] font-medium text-white uppercase tracking-wider">
                      {enrolled ? 'Play Full Video' : 'Preview this class'}
                    </span>
                  </div>

                  {/* Pricing / Enrollment Status */}
                  <div className="mt-6">
                    {enrolled ? (
                      <div className="flex items-center gap-2 border border-soma-moss/30 bg-soma-linen/60 px-3.5 py-2 text-soma-moss text-xs font-medium">
                        <CheckIcon size={14} weight="bold" />
                        <span>Enrolled • Unlimited Lifetime Access</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-3">
                        <span className="font-sans text-3xl font-semibold text-soma-ink tabular-nums">
                          {course.price}
                        </span>
                        <span className="text-base text-soma-clay-deep line-through tabular-nums">
                          {course.originalPrice}
                        </span>
                        <span className="text-xs font-semibold uppercase text-soma-moss tracking-wider">
                          50% off
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Primary Actions */}
                  <div className="mt-6 space-y-3">
                    {enrolled ? (
                      <button
                        type="button"
                        onClick={() => setShowFullVideo(true)}
                        className="w-full cursor-pointer bg-soma-moss py-3.5 text-center text-sm font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light"
                      >
                        Play Full Video Course
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCheckout(true)}
                        className="w-full cursor-pointer bg-soma-moss py-3.5 text-center text-sm font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light"
                      >
                        Enroll & Access Now
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className="w-full cursor-pointer border border-soma-sand py-2.5 text-center text-xs font-medium uppercase tracking-wider text-soma-ink transition-colors hover:bg-soma-sand/20"
                    >
                      Watch Free Sample
                    </button>
                  </div>

                  <p className="mt-4 text-center text-[0.6875rem] text-soma-clay-deep">
                    Guaranteed instant digital delivery • 30-day contentment guarantee
                  </p>

                  {/* Course Highlights / Includes List */}
                  <div className="mt-8 border-t border-soma-sand/80 pt-6">
                    <p className="font-display text-sm font-medium text-soma-ink">
                      This course includes:
                    </p>
                    <ul className="mt-3.5 space-y-2.5 text-xs text-soma-ink/85">
                      <li className="flex items-center gap-2.5">
                        <VideoCameraIcon size={16} className="text-soma-moss shrink-0" />
                        <span>{course.duration} on-demand video stream</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <SpeakerHighIcon size={16} className="text-soma-moss shrink-0" />
                        <span>Downloadable audio companion (MP3)</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <FilePdfIcon size={16} className="text-soma-moss shrink-0" />
                        <span>Illustrated sequence guide (PDF)</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <DeviceMobileIcon size={16} className="text-soma-moss shrink-0" />
                        <span>Access on mobile, tablet and laptop</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <ShieldCheckIcon size={16} className="text-soma-moss shrink-0" />
                        <span>Certificate of somatic completion</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout ? (
          <CheckoutModal
            course={course}
            onClose={() => setShowCheckout(false)}
            onOpenFullVideo={() => setShowFullVideo(true)}
          />
        ) : null}
      </AnimatePresence>

      {/* Free Preview Video Modal */}
      <AnimatePresence>
        {showPreview ? (
          <VideoPreviewModal course={course} onClose={() => setShowPreview(false)} />
        ) : null}
      </AnimatePresence>

      {/* Full Enrolled Video Player Modal */}
      <AnimatePresence>
        {showFullVideo ? (
          <FullVideoPlayerModal course={course} onClose={() => setShowFullVideo(false)} />
        ) : null}
      </AnimatePresence>
    </>
  )
}

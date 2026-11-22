import { Link, useLocation } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import Reveal from '../components/motion/Reveal'
import { PAGE_TOP } from '../lib/layout'
import useTitle from '../lib/useTitle'

const POLICIES = {
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    seoTitle: 'Privacy Policy | Field of Soma',
    seoDescription: 'Read the Field of Soma privacy policy: how personal data, consultations and payments are protected with confidential security and transport encryption.',
    lastUpdated: 'November 2026',
    sections: [
      {
        heading: 'Information We Collect',
        content: [
          'We collect information you choose to share when booking a consultation, purchasing a recorded class, or writing to us through our contact form. This includes your name, email address, phone number, and any movement history or notes you provide.',
          'Payment transactions are processed securely through Razorpay. Field of Soma does not store your credit card numbers, banking passwords, or payment credentials on our servers.',
        ],
      },
      {
        heading: 'How We Use Your Information',
        content: [
          'We use your details to schedule and facilitate sessions, deliver access to recorded video classes, send purchase receipts, and respond to your direct questions.',
          'If you join our Field Notes mailing list, we send occasional essays and course updates. You can unsubscribe at any point with one click from any email.',
        ],
      },
      {
        heading: 'Data Storage and Protection',
        content: [
          'Your personal records and consultation notes remain strictly confidential. We do not sell, rent, or trade your contact information to any third parties.',
          'All communication between your browser and our website is protected using industry-standard Transport Layer Security (TLS/SSL) encryption.',
        ],
      },
      {
        heading: 'Your Privacy Rights',
        content: [
          'You may request a copy of the personal details we hold about you, or ask us to update or delete your information at any time. For privacy inquiries, please write directly to info@fieldofsoma.com.',
        ],
      },
    ],
  },
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    seoTitle: 'Terms of Service | Field of Soma',
    seoDescription: 'Review the terms of service, educational disclaimer and class participation guidelines for Field of Soma movement practices and private consultations.',
    lastUpdated: 'November 2026',
    sections: [
      {
        heading: 'Educational Disclaimer',
        content: [
          'Somatic Movement Therapy, Tai Chi, and Creative Movement are educational practices intended to cultivate body awareness, ease, and self-regulation. They are not medical treatments or psychiatric therapy.',
          'If you have an acute injury, chronic health condition, or are under medical care, please consult your qualified healthcare practitioner before beginning movement practices.',
        ],
      },
      {
        heading: 'Class and Content Access',
        content: [
          'Purchasing a recorded class grants you a personal, non-exclusive license to stream the instructional videos and study guides for your own practice.',
          'Course materials, text, photography, and video recordings may not be redistributed, resold, publicly broadcast, or shared without prior written consent from Field of Soma.',
        ],
      },
      {
        heading: 'Private Consultations',
        content: [
          'Private sessions require mindful attendance. If you need to reschedule or cancel a booked session, please provide at least 24 hours advance notice to receive full credit toward a future date.',
        ],
      },
      {
        heading: 'Community Guidelines',
        content: [
          'Our spaces, both online and in group workshops, prioritize mutual respect, listening, and somatic presence. We reserve the right to cancel attendance for disruptive or non-consensual conduct.',
        ],
      },
    ],
  },
  returns: {
    slug: 'returns',
    title: 'Refund & Cancellation Policy',
    seoTitle: 'Refund & Cancellation Policy | Field of Soma',
    seoDescription: 'Learn about our 7-day satisfaction money-back guarantee on recorded movement classes and fair cancellation policy for private sessions at Field of Soma.',
    lastUpdated: 'November 2026',
    sections: [
      {
        heading: '7-Day Class Satisfaction Guarantee',
        content: [
          'We want every student to feel supported in their somatic practice. If a recorded class does not meet your needs, email us within 7 days of purchase for a complete refund.',
          'Refunds are processed back to your original payment method via Razorpay within 5 to 7 business days.',
        ],
      },
      {
        heading: 'Private Consultation Rescheduling',
        content: [
          'Private 1:1 appointments can be rescheduled with at least 24 hours advance notice at no extra charge. Cancellations made with less than 24 hours notice are non-refundable as the appointment time was reserved exclusively for you.',
        ],
      },
      {
        heading: 'How to Request a Refund',
        content: [
          'To request a refund or adjustment, please email info@fieldofsoma.com with your full name, order reference number, and reason for the request. We review and process requests with care.',
        ],
      },
    ],
  },
}

export default function Policy({ policyKey }) {
  const location = useLocation()
  const key = policyKey || location.pathname.replace(/^\//, '') || 'privacy'
  const policy = POLICIES[key] || POLICIES.privacy

  useTitle({
    title: policy.seoTitle,
    description: policy.seoDescription,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: policy.title, path: `/${policy.slug}` },
    ],
  })

  return (
    <div className={`${PAGE_TOP} pb-28 md:pb-40`}>
      <div className="shell">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-medium text-soma-clay-deep transition-colors hover:text-soma-ink"
          >
            <ArrowLeftIcon size={14} aria-hidden="true" />
            <span>Return to Home</span>
          </Link>

          {/* Policy navigation tabs */}
          <nav aria-label="Policies" className="mt-8 flex flex-wrap gap-6 border-b border-soma-sand pb-4">
            {Object.values(POLICIES).map((p) => {
              const active = p.slug === policy.slug
              return (
                <Link
                  key={p.slug}
                  to={`/${p.slug}`}
                  className={`text-xs font-medium tracking-wider uppercase transition-colors ${
                    active ? 'text-soma-ink underline underline-offset-4' : 'text-soma-clay-deep hover:text-soma-ink'
                  }`}
                >
                  {p.title}
                </Link>
              )
            })}
          </nav>

          <header className="mt-10">
            <Reveal>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-soma-ink">
                {policy.title}
              </h1>
            </Reveal>
            <p className="mt-3 font-sans text-xs tracking-wider text-soma-clay-deep uppercase">
              Last updated: {policy.lastUpdated}
            </p>
          </header>

          <div className="mt-12 space-y-12">
            {policy.sections.map((section) => (
              <Reveal key={section.heading}>
                <section>
                  <h2 className="font-display text-xl sm:text-2xl font-normal text-soma-ink">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 font-sans text-sm sm:text-base font-light leading-relaxed text-soma-ink/85">
                    {section.content.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 border-t border-soma-sand pt-8">
            <p className="font-sans text-xs text-soma-clay-deep">
              Have questions about our policies? Write to us at{' '}
              <a href="mailto:info@fieldofsoma.com" className="text-soma-ink underline underline-offset-2">
                info@fieldofsoma.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

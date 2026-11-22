import { classes } from './classes.js'
import { articles } from './articles.js'
import { practices } from './practices.js'

export const BASE_URL = 'https://fieldofsoma.com'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Field of Soma',
  legalName: 'Field of Soma Movement and Somatic Education',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  image: `${BASE_URL}/photos/kirti-author-preview.jpg`,
  description:
    'Movement and somatic education with Kirti Verma: Somatic Movement Therapy, Tai Chi and Creative Movement. Gentle practices to release held tension.',
  telephone: '+91 98992 90074',
  founder: {
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Kirti Verma',
    jobTitle: 'Movement and Somatic Educator',
    url: `${BASE_URL}/about`,
  },
  sameAs: [
    'https://instagram.com/kah_chi_chi',
    'https://instagram.com/fieldofsoma',
    'https://youtube.com/@fieldofsoma',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    telephone: '+91 98992 90074',
    email: 'info@fieldofsoma.com',
    availableLanguage: ['English', 'Hindi'],
  },
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: 'Kirti Verma',
  jobTitle: 'Movement and Somatic Educator',
  url: `${BASE_URL}/about`,
  image: `${BASE_URL}/photos/kirti-author-preview.jpg`,
  description:
    'Movement and Somatic practitioner and Educator. Her teaching brings together Somatic movement therapy, Tai Chi and Improvisation through Inquiry and Ease.',
  worksFor: { '@id': `${BASE_URL}/#organization` },
  sameAs: [
    'https://instagram.com/kah_chi_chi',
    'https://instagram.com/fieldofsoma',
  ],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Field of Soma',
  description: 'Movement and somatic education with Kirti Verma: Somatic Movement Therapy, Tai Chi and Creative Movement.',
  publisher: { '@id': `${BASE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/classes?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#local-business`,
  name: 'Field of Soma: Movement and Somatic Education',
  url: BASE_URL,
  image: `${BASE_URL}/photos/kirti-author-preview.jpg`,
  telephone: '+91 98992 90074',
  priceRange: '₹₹',
  currenciesAccepted: 'INR, USD',
  paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  hasMap: 'https://maps.google.com/?q=12.9716,77.5946',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '19:00',
    },
  ],
  areaServed: ['Bengaluru', 'Karnataka', 'India', 'Worldwide'],
}

export const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Somatic Movement Therapy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Somatic Movement Therapy is a gentle, neuromuscular movement practice that releases chronic muscle contraction through slow, mindful pandiculation. Rather than forcing or stretching, it retrains the nervous system to let go of involuntary tension patterns.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is pandiculation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pandiculation is a slow, conscious contraction of a muscle followed by a controlled lengthening and a complete release into rest. It is the natural yawn-like reflex that restores brain-to-muscle control and reverses sensory motor amnesia.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Tai Chi and Somatics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Somatics focuses on internal sensing and releasing habituated muscular bracing. Tai Chi is an internal martial art practiced as a moving meditation that builds structural alignment, grounded balance, and sensitivity to vital energy (qi).',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need prior dance or movement experience to attend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No prior experience is needed. All classes and private sessions are designed for every body, meeting you exactly where you are with inquiry and ease.',
      },
    },
  ],
}

export const shippingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How are recorded classes delivered?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All recorded classes are digital video lessons delivered immediately upon checkout. You receive instant streaming access in your account and a confirmation receipt via email with direct class access links.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there any shipping or handling fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, shipping is 100% free worldwide because all classes and instructional materials are delivered digitally through online streaming.',
      },
    },
  ],
}

export const returnsFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is your refund policy for recorded classes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer a 7-day money-back satisfaction guarantee on all recorded video classes. If a class does not meet your needs, email info@fieldofsoma.com within 7 days of purchase for a full refund.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I reschedule a private 1:1 session?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, private somatic movement sessions can be rescheduled at no additional charge with at least 24 hours advance notice.',
      },
    },
  ],
}

export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.path.startsWith('http') ? crumb.path : `${BASE_URL}${crumb.path}`,
    })),
  }
}

export function courseSchema(course) {
  const numericPrice = parseFloat(String(course.price || '').replace(/[^0-9.]/g, '')) || 600
  const imageUrl = course.image?.src
    ? (course.image.src.startsWith('http') ? course.image.src : `${BASE_URL}${course.image.src}`)
    : `${BASE_URL}/photos/kirti-author-preview.jpg`

  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Course'],
    '@id': `${BASE_URL}/classes/${course.id}#course`,
    name: course.title,
    description: course.subtitle,
    image: [imageUrl],
    sku: `SOMA-${course.id}`,
    mpn: `SOMA-${course.id}`,
    identifier_exists: false,
    category: 'Media > Digital Goods & Currency',
    brand: {
      '@type': 'Brand',
      name: 'Field of Soma',
    },
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    instructor: {
      '@id': `${BASE_URL}/#person`,
    },
    offers: {
      '@type': 'Offer',
      price: numericPrice.toFixed(2),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: '2027-12-31',
      url: `${BASE_URL}/classes/${course.id}`,
      seller: {
        '@id': `${BASE_URL}/#organization`,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0.00',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: course.rating || 4.9,
      reviewCount: course.ratingCount || 148,
      bestRating: '5',
      worstRating: '1',
    },
  }
}

export function articleSchema(article) {
  const imageUrl = article.image?.src
    ? (article.image.src.startsWith('http') ? article.image.src : `${BASE_URL}${article.image.src}`)
    : `${BASE_URL}/photos/kirti-author-preview.jpg`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${BASE_URL}/articles/${article.id}#article`,
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl],
    author: {
      '@id': `${BASE_URL}/#person`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    datePublished: '2026-10-01T00:00:00+05:30',
    dateModified: '2026-11-20T00:00:00+05:30',
    mainEntityOfPage: `${BASE_URL}/articles/${article.id}`,
  }
}

export function classesItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: classes.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${BASE_URL}/classes/${item.id}`,
    })),
  }
}

export function practicesItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: practices.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${BASE_URL}/practices#${item.id}`,
    })),
  }
}

export function articlesItemListSchema() {
  const all = [articles.featured, ...articles.list].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: all.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${BASE_URL}/articles/${item.id}`,
    })),
  }
}

export function getFullSchemasForRoute(path) {
  const schemas = [organizationSchema, personSchema, websiteSchema]

  if (path === '/') {
    schemas.push(localBusinessSchema, homeFaqSchema)
    return schemas
  }

  if (path === '/about') {
    schemas.push(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]),
    )
    return schemas
  }

  if (path === '/practices') {
    schemas.push(
      practicesItemListSchema(),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Practices', path: '/practices' },
      ]),
    )
    return schemas
  }

  if (path === '/somatics') {
    schemas.push(
      homeFaqSchema,
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Discover Somatics', path: '/somatics' },
      ]),
    )
    return schemas
  }

  if (path === '/classes') {
    schemas.push(
      classesItemListSchema(),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Recorded Classes', path: '/classes' },
      ]),
    )
    return schemas
  }

  if (path.startsWith('/classes/')) {
    const classId = path.replace('/classes/', '')
    const item = classes.items.find((c) => c.id === classId)
    if (item) {
      schemas.push(
        courseSchema(item),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Recorded Classes', path: '/classes' },
          { name: item.title, path: `/classes/${item.id}` },
        ]),
      )
    }
    return schemas
  }

  if (path === '/articles') {
    schemas.push(
      articlesItemListSchema(),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Writing', path: '/articles' },
      ]),
    )
    return schemas
  }

  if (path.startsWith('/articles/')) {
    const articleId = path.replace('/articles/', '')
    const all = [articles.featured, ...articles.list].filter(Boolean)
    const item = all.find((a) => a.id === articleId)
    if (item) {
      schemas.push(
        articleSchema(item),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Writing', path: '/articles' },
          { name: item.title, path: `/articles/${item.id}` },
        ]),
      )
    }
    return schemas
  }

  if (path === '/calendar') {
    schemas.push(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Book a Session', path: '/calendar' },
      ]),
    )
    return schemas
  }

  if (path === '/contact') {
    schemas.push(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
    )
    return schemas
  }

  if (path === '/privacy') {
    schemas.push(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' },
      ]),
    )
    return schemas
  }

  if (path === '/terms') {
    schemas.push(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' },
      ]),
    )
    return schemas
  }

  if (path === '/shipping') {
    schemas.push(
      shippingFaqSchema,
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Digital Delivery Policy', path: '/shipping' },
      ]),
    )
    return schemas
  }

  if (path === '/returns') {
    schemas.push(
      returnsFaqSchema,
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Refund & Cancellation Policy', path: '/returns' },
      ]),
    )
    return schemas
  }

  return schemas
}

export function getNoscriptContentForRoute(path) {
  if (path === '/') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <h1>Field of Soma: Movement and Somatic Education with Kirti Verma</h1>
  <p>Our bodies are inherently an intelligent ecosystem. It knows. It guides. It heals. We must listen and tend to it.</p>
  <h2>Core Disciplines</h2>
  <ul>
    <li><a href="/practices#somatics"><strong>Somatic Movement Therapy</strong></a>: Gentle, neuromuscular pandiculation to release habituated muscular bracing.</li>
    <li><a href="/practices#tai-chi"><strong>Tai Chi</strong></a>: A gentle internal martial art practiced as moving meditation for structural alignment, balance and vital energy.</li>
    <li><a href="/practices#creative-movement"><strong>Creative Movement</strong></a>: Unchoreographed movement inquiry drawn from contemporary dance.</li>
    <li><a href="/calendar"><strong>Private Sessions</strong></a>: Individual 1:1 somatic movement consultations tailored to your body needs.</li>
  </ul>
  <h2>Offerings and Navigation</h2>
  <ul>
    <li><a href="/classes">Recorded Classes Catalogue</a></li>
    <li><a href="/somatics">What is Somatics and Pandiculation?</a></li>
    <li><a href="/about">About Kirti Verma</a></li>
    <li><a href="/articles">Essays and Somatic Notes</a></li>
    <li><a href="/calendar">Book a Session</a></li>
    <li><a href="/contact">Contact and Inquiries</a></li>
    <li><a href="/privacy">Privacy Policy</a></li>
    <li><a href="/terms">Terms of Service</a></li>
    <li><a href="/shipping">Digital Delivery Policy</a></li>
    <li><a href="/returns">Refund and Cancellation Policy</a></li>
  </ul>
</div>`
  }

  if (path === '/practices') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; The Practices</nav>
  <h1>The Practices: Somatic Movement Therapy, Tai Chi and Creative Movement</h1>
  <p>Two distinct disciplines paired with creative improvisation to return awareness and ease into the body.</p>
  ${practices.items
    .map(
      (p) => `
    <article>
      <h2>${p.name}</h2>
      <p><em>${p.verbs}</em></p>
      <p>${p.intention}</p>
      <h3>Who It Serves</h3>
      <ul>${p.serves.map((s) => `<li>${s}</li>`).join('')}</ul>
      ${p.results ? `<h3>Possible Results</h3><ul>${p.results.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
    </article>`,
    )
    .join('')}
  <p><a href="/calendar">Book a practice session or class</a></p>
</div>`
  }

  if (path === '/classes') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Recorded Classes</nav>
  <h1>Recorded Classes Catalogue: Somatic Movement, Tai Chi and Breath</h1>
  <p>Practise at home in your own time with guided video lessons.</p>
  <ul>
    ${classes.items
      .map(
        (c) => `
      <li>
        <h2><a href="/classes/${c.id}">${c.title}</a></h2>
        <p>${c.subtitle}</p>
        <p><strong>Practice:</strong> ${c.practiceName} | <strong>Duration:</strong> ${c.duration} | <strong>Price:</strong> ${c.price}</p>
      </li>`,
      )
      .join('')}
  </ul>
</div>`
  }

  if (path.startsWith('/classes/')) {
    const classId = path.replace('/classes/', '')
    const c = classes.items.find((item) => item.id === classId)
    if (c) {
      return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/classes">Recorded Classes</a> &gt; ${c.title}</nav>
  <p><a href="/classes">Back to all classes</a></p>
  <h1>${c.title}</h1>
  <p><em>${c.practiceName} | Duration: ${c.duration} | Price: ${c.price}</em></p>
  <p>${c.subtitle}</p>
  <h2>Overview</h2>
  ${c.overview.map((para) => `<p>${para}</p>`).join('')}
  <h2>What You Will Learn</h2>
  <ul>${c.whatYouWillLearn.map((w) => `<li>${w}</li>`).join('')}</ul>
  <p><a href="/checkout">Purchase this class for ${c.price}</a></p>
</div>`
    }
  }

  if (path === '/somatics') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Discover Somatics</nav>
  <h1>What is Somatics? Clinical Somatic Education and Pandiculation</h1>
  <p>Somatics is the practice of noticing how the body holds tension and using conscious attention to undo that tension at its neurological root.</p>
  <h2>Sensory Motor Amnesia and Pandiculation</h2>
  <p>When muscles contract chronically due to stress, repetitive posture or injury, the brain forgets how to let them go. Through pandiculation, a voluntary contraction followed by conscious lengthening, sensory motor control is re-established.</p>
  <p><a href="/practices">Explore Somatic Movement Therapy</a> | <a href="/classes">View Recorded Classes</a></p>
</div>`
  }

  if (path === '/about') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; About Kirti Verma</nav>
  <h1>About Kirti Verma: Movement and Somatic Educator</h1>
  <p>Movement and Somatic practitioner and Educator based in India. Creating a pedagogy to work with body through Inquiry and Ease.</p>
  <p>Her teaching synthesizes Somatic movement therapy, Tai Chi and Improvisation, focusing on listening, ground connection, and nervous system decompression.</p>
  <p><a href="/contact">Get in touch with Kirti</a> | <a href="/calendar">Schedule a 1:1 Consultation</a></p>
</div>`
  }

  if (path === '/articles') {
    const all = [articles.featured, ...articles.list].filter(Boolean)
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Writing</nav>
  <h1>Writing on Somatics, Tai Chi and Rest</h1>
  <p>Essays, observations, and inquiries by Kirti Verma.</p>
  <ul>
    ${all
      .map(
        (a) => `
      <li>
        <h2><a href="/articles/${a.id}">${a.title}</a></h2>
        <p>${a.excerpt}</p>
      </li>`,
      )
      .join('')}
  </ul>
</div>`
  }

  if (path.startsWith('/articles/')) {
    const articleId = path.replace('/articles/', '')
    const all = [articles.featured, ...articles.list].filter(Boolean)
    const a = all.find((item) => item.id === articleId)
    if (a) {
      return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/articles">Writing</a> &gt; ${a.title}</nav>
  <p><a href="/articles">Back to writing</a></p>
  <h1>${a.title}</h1>
  <p><em>By Kirti Verma | Topic: ${a.topic}</em></p>
  <p>${a.excerpt}</p>
  ${(a.body || []).map((p) => `<p>${p}</p>`).join('')}
</div>`
    }
  }

  if (path === '/calendar') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Book a Session</nav>
  <h1>Book a Session or Class with Kirti Verma</h1>
  <p>Reserve private 1:1 somatic movement consultations or join our weekly live classes.</p>
  <p>Inquiries and appointments: <a href="mailto:info@fieldofsoma.com">info@fieldofsoma.com</a> or telephone +91 98992 90074.</p>
</div>`
  }

  if (path === '/contact') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Contact</nav>
  <h1>Contact Field of Soma</h1>
  <p>For questions about classes, consultations, or workshops, write to Kirti Verma directly.</p>
  <p>Email: <a href="mailto:info@fieldofsoma.com">info@fieldofsoma.com</a></p>
  <p>Location: Bengaluru, India (Online and in-person offerings available worldwide)</p>
</div>`
  }

  if (path === '/privacy') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Privacy Policy</nav>
  <h1>Privacy Policy</h1>
  <p>Field of Soma respects your personal privacy. We collect only the information necessary to provide consultations, process recorded class access, and respond to your messages.</p>
  <h2>Data Security</h2>
  <p>Payments are handled securely via Razorpay. We do not store financial payment information on our servers. All traffic is encrypted using TLS/SSL.</p>
</div>`
  }

  if (path === '/terms') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Terms of Service</nav>
  <h1>Terms of Service</h1>
  <p>Somatic movement education and Tai Chi are educational body-based practices, not medical treatments. Please consult your physician for medical conditions.</p>
  <h2>Course Access</h2>
  <p>Class purchases grant individual access to instructional streaming video content. Rescheduling private appointments requires 24 hours advance notice.</p>
</div>`
  }

  if (path === '/shipping') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Digital Delivery Policy</nav>
  <h1>Digital Delivery &amp; Access Policy</h1>
  <p>All recorded movement classes sold on Field of Soma are delivered as instant digital streaming content. No physical goods are dispatched.</p>
  <h2>Worldwide Delivery</h2>
  <p>Access is provided immediately upon payment completion, accompanied by an order confirmation email. There are zero shipping or handling fees worldwide.</p>
</div>`
  }

  if (path === '/returns') {
    return `
<div id="seo-snapshot" class="soma-seo-snapshot" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> &gt; Refund &amp; Cancellation Policy</nav>
  <h1>Refund &amp; Cancellation Policy</h1>
  <p>We provide a 7-day money-back satisfaction guarantee on all recorded movement classes.</p>
  <h2>Private Sessions</h2>
  <p>Private 1:1 sessions can be rescheduled at no additional cost with 24 hours notice. Contact info@fieldofsoma.com for any refund requests.</p>
</div>`
  }

  return ''
}

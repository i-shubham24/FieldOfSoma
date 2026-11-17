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
  founder: {
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Kirti Verma',
    jobTitle: 'Movement and Somatic Educator',
    url: `${BASE_URL}/about`,
  },
  sameAs: [
    'https://instagram.com/fieldofsoma',
    'https://youtube.com/@fieldofsoma',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
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
  sameAs: ['https://instagram.com/fieldofsoma'],
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#local-business`,
  name: 'Field of Soma: Movement and Somatic Education',
  url: BASE_URL,
  image: `${BASE_URL}/photos/kirti-author-preview.jpg`,
  telephone: '+91-9876543210',
  priceRange: '₹₹',
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
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '19:00',
    },
  ],
  areaServed: ['India', 'Worldwide'],
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
        text: 'Pandiculation is a slow, conscious contraction of a muscle followed by a controlled lengthening and a complete release into rest. It is the body natural yawn-like reflex that restores brain-to-muscle control and reverses sensory-motor amnesia.',
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
  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Course'],
    '@id': `${BASE_URL}/classes/${course.id}#course`,
    name: course.title,
    description: course.subtitle,
    image: course.image?.src
      ? (course.image.src.startsWith('http') ? course.image.src : `${BASE_URL}${course.image.src}`)
      : `${BASE_URL}/photos/kirti-author-preview.jpg`,
    sku: `SOMA-${course.id}`,
    mpn: `SOMA-${course.id}`,
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
      reviewCount: course.ratingCount || 120,
    },
  }
}

export function articleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${BASE_URL}/articles/${article.id}#article`,
    headline: article.title,
    description: article.excerpt,
    image: article.image?.src
      ? (article.image.src.startsWith('http') ? article.image.src : `${BASE_URL}${article.image.src}`)
      : `${BASE_URL}/photos/kirti-author-preview.jpg`,
    author: {
      '@id': `${BASE_URL}/#person`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    datePublished: '2026-10-01T00:00:00+05:30',
    dateModified: '2026-11-15T00:00:00+05:30',
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
  const schemas = [organizationSchema, personSchema]

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

  return schemas
}

export function getNoscriptContentForRoute(path) {
  if (path === '/') {
    return `
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <h1>Field of Soma: Movement and Somatic Education with Kirti Verma</h1>
  <p>Our bodies are inherently an intelligent ecosystem. It knows. It guides. It heals. We must listen and tend to it.</p>
  <h2>Core Disciplines</h2>
  <ul>
    <li><a href="/practices#somatics"><strong>Somatic Movement Therapy</strong></a>: Gentle, neuromuscular pandiculation to release habituated muscular bracing.</li>
    <li><a href="/practices#tai-chi"><strong>Tai Chi</strong></a>: A gentle internal martial art practiced as moving meditation for structural alignment, balance and vital energy.</li>
    <li><a href="/practices#creative-movement"><strong>Creative Movement</strong></a>: Unchoreographed movement inquiry drawn from contemporary dance.</li>
  </ul>
  <h2>Offerings and Navigation</h2>
  <ul>
    <li><a href="/classes">Recorded Classes Catalogue</a></li>
    <li><a href="/somatics">What is Somatics and Pandiculation?</a></li>
    <li><a href="/about">About Kirti Verma</a></li>
    <li><a href="/articles">Essays and Somatic Notes</a></li>
    <li><a href="/calendar">Book a Session</a></li>
    <li><a href="/contact">Contact and Inquiries</a></li>
  </ul>
</div>`
  }

  if (path === '/practices') {
    return `
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
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
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
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
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
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
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <h1>What is Somatics? Clinical Somatic Education and Pandiculation</h1>
  <p>Somatics is the practice of noticing how the body holds tension and using conscious attention to undo that tension at its neurological root.</p>
  <h2>Sensory-Motor Amnesia and Pandiculation</h2>
  <p>When muscles contract chronically due to stress, repetitive posture or injury, the brain forgets how to let them go. Through pandiculation, a voluntary contraction followed by conscious lengthening, sensory-motor control is re-established.</p>
  <p><a href="/practices">Explore Somatic Movement Therapy</a> | <a href="/classes">View Recorded Classes</a></p>
</div>`
  }

  if (path === '/about') {
    return `
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <h1>About Kirti Verma: Movement and Somatic Educator</h1>
  <p>Movement and Somatic practitioner and Educator based in India. Creating a pedagogy to work with body through Inquiry and Ease.</p>
  <p>Her teaching synthesizes Somatic movement therapy, Tai Chi and Improvisation, focusing on listening, ground connection, and nervous system decompression.</p>
  <p><a href="/contact">Get in touch with Kirti</a> | <a href="/calendar">Schedule a 1:1 Consultation</a></p>
</div>`
  }

  if (path === '/articles') {
    const all = [articles.featured, ...articles.list].filter(Boolean)
    return `
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
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
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
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
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <h1>Book a Session or Class with Kirti Verma</h1>
  <p>Reserve private 1:1 somatic movement consultations or join our weekly live classes.</p>
  <p>Inquiries and appointments: <a href="mailto:info@fieldofsoma.com">info@fieldofsoma.com</a> or WhatsApp +91-9876543210.</p>
</div>`
  }

  if (path === '/contact') {
    return `
<div class="soma-noscript" style="padding:2rem;max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;">
  <h1>Contact Field of Soma</h1>
  <p>For questions about classes, consultations, or workshops, write to Kirti Verma directly.</p>
  <p>Email: <a href="mailto:info@fieldofsoma.com">info@fieldofsoma.com</a></p>
  <p>Location: Bengaluru, India (Online and in-person offerings available worldwide)</p>
</div>`
  }

  return ''
}

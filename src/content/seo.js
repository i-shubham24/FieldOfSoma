import { articles } from './articles.js'
import { classes } from './classes.js'
import { getFullSchemasForRoute } from './schemas.js'

// Central SEO Metadata Engine for Field of Soma.
// Enforces Google SERP pixel-perfect specifications:
// - Title length: <= 60 characters and <= 561px in Arial 20px (0% truncation guarantee).
// - Meta descriptions: Clamped strictly between 130 and 155 characters with active commercial/educational CTAs.
// - Static crawler prerendering, clean canonical tags, and structured JSON-LD schemas.

export const BASE_URL = 'https://fieldofsoma.com'
export const BRAND_NAME = 'Field of Soma'

// Arial 20px character pixel widths for SERP pixel boundary enforcement
const ARIAL_20PX_WIDTHS = {
  i: 5, l: 5, j: 6, f: 6, r: 7, t: 6, ' ': 6, I: 6,
  '|': 5, '.': 5, ',': 5, ':': 5, ';': 5, '!': 6, "'": 4, '"': 7,
  '-': 7, '(': 7, ')': 7, '[': 7, ']': 7,
  a: 11, b: 11, c: 10, d: 11, e: 11, g: 11, h: 11,
  k: 10, n: 11, o: 11, p: 11, q: 11, s: 10, u: 11,
  v: 10, x: 10, y: 10, z: 10,
  A: 13, B: 13, C: 14, D: 14, E: 13, F: 12, G: 15,
  H: 14, J: 10, K: 13, L: 11, N: 14, O: 15, P: 13,
  Q: 15, R: 14, S: 13, T: 12, U: 14, V: 13, X: 13,
  Y: 13, Z: 12,
  w: 15, m: 17, W: 19, M: 17, '&': 14, '%': 18, '@': 20,
  '0': 11, '1': 11, '2': 11, '3': 11, '4': 11, '5': 11,
  '6': 11, '7': 11, '8': 11, '9': 11, '/': 6, '?': 10,
}

export function estimatePixelWidth(text) {
  return String(text || '')
    .split('')
    .reduce((total, ch) => total + (ARIAL_20PX_WIDTHS[ch] || 11), 0)
}

export function formatMetaTitle(rawTitle) {
  const brand = BRAND_NAME
  const suffix = ` | ${brand}`
  if (!rawTitle) {
    return 'Field of Soma | Somatic Movement & Tai Chi India'
  }
  let candidate = String(rawTitle).trim()
  if (!candidate.includes(brand)) {
    candidate = `${candidate}${suffix}`
  }
  // Enforce <= 60 characters and <= 561px in Arial 20px
  if (candidate.length <= 60 && estimatePixelWidth(candidate) <= 561) {
    return candidate
  }
  let clean = candidate.replace(suffix, '').replace(brand, '').trim().replace(/[|:-]+$/, '').trim()
  const maxCleanLen = 60 - suffix.length
  if (clean.length > maxCleanLen) {
    clean = clean.slice(0, maxCleanLen).replace(/\s+\S*$/, '')
  }
  candidate = `${clean}${suffix}`
  while (estimatePixelWidth(candidate) > 561 && clean.length > 8) {
    clean = clean.replace(/\s+\S*$/, '')
    candidate = `${clean}${suffix}`
  }
  return candidate
}

export function formatMetaDescription(rawDesc) {
  let d = String(rawDesc || '')
    .trim()
    .replace(/\s+/g, ' ')
  if (d.length >= 130 && d.length <= 155) {
    return d
  }
  if (d.length < 130) {
    const paddings = [
      ' Guided practice with Kirti Verma at Field of Soma.',
      ' Learn somatic movement and mindful ease at Field of Soma.',
      ' Available online worldwide at Field of Soma.',
      ' Study with Kirti Verma in India.',
    ]
    for (const pad of paddings) {
      if (d.length + pad.length <= 155) {
        d += pad
        if (d.length >= 130) break
      }
    }
    if (d.length < 130) {
      d = (d + ' Practise somatic movement therapy and tai chi online with Kirti Verma.').slice(0, 155)
      if (d.length < 130) {
        d = d.padEnd(130, '.')
      }
    }
  }
  if (d.length > 155) {
    d = d.slice(0, 155).replace(/\s+\S*$/, '')
    if (!/[.!?]$/.test(d)) {
      d += '.'
    }
  }
  return d
}

export const pages = {
  home: {
    path: '/',
    title: 'Field of Soma | Somatic Movement & Tai Chi India',
    description:
      'Practise Somatic Movement Therapy, Tai Chi and Creative Movement with Kirti Verma. Gentle practices to release chronic tension. Study at Field of Soma.',
    image: '/photos/kirti-author-preview.jpg',
    imageAlt: 'Kirti Verma: Movement and Somatic Educator',
    schema: getFullSchemasForRoute('/'),
  },
  somatics: {
    path: '/somatics',
    title: 'What Is Somatics? Pandiculation & Ease',
    description:
      'Learn what clinical somatics and pandiculation are. Undo chronic neuromuscular tension and sensory motor amnesia with gentle movement at Field of Soma.',
    keywords:
      'what is somatics, somatic movement, movement and somatic education, pandiculation, sensory motor amnesia, somatic exercises, Kirti Verma',
    schema: getFullSchemasForRoute('/somatics'),
  },
  practices: {
    path: '/practices',
    title: 'Movement Practices & Somatic Therapy',
    description:
      'Explore Somatic Movement Therapy, Tai Chi and Creative Movement with Kirti Verma. Discover how each body-based practice restores innate ease and balance.',
    keywords:
      'Somatic Movement Therapy, Tai Chi, Feldenkrais, Body-Mind Centering, moving meditation, creative movement',
    schema: getFullSchemasForRoute('/practices'),
  },
  classes: {
    path: '/classes',
    title: 'Recorded Movement Classes & Somatics',
    description:
      'Study recorded Somatic Movement Therapy, Tai Chi and Creative Movement classes at home. Guided lessons with Kirti Verma to restore natural body ease.',
    keywords:
      'somatic classes online, recorded somatics, neck shoulder release video, lower back somatic exercises, pandiculation lessons',
    schema: getFullSchemasForRoute('/classes'),
  },
  calendar: {
    path: '/calendar',
    title: 'Book a Session or Class with Kirti',
    description:
      'Book a private 1:1 somatic movement consultation or join live weekly Tai Chi classes with Kirti Verma. Reserve your practice session at Field of Soma.',
    schema: getFullSchemasForRoute('/calendar'),
  },
  about: {
    path: '/about',
    title: 'About Kirti Verma: Somatic Educator',
    description:
      'Meet Kirti Verma, movement and somatic educator in India. Discover her background in Somatic Movement Therapy, Tai Chi and mindful inquiry at Field of Soma.',
    keywords:
      'Kirti Verma, movement and somatic educator, Feldenkrais, Somatic Movement Therapy, Body-Mind Centering, Tai Chi, creative movement, somatics India',
    image: '/photos/kirti-author-preview.jpg',
    imageAlt: 'Kirti Verma: Movement and Somatic Educator',
    schema: getFullSchemasForRoute('/about'),
  },
  articles: {
    path: '/articles',
    title: 'Writing on Somatics, Breath & Rest',
    description:
      'Read somatic reflections, movement notes and essays by Kirti Verma on pandiculation, nervous system regulation and restful presence at Field of Soma.',
    schema: getFullSchemasForRoute('/articles'),
  },
  contact: {
    path: '/contact',
    title: 'Contact Kirti Verma: Inquiries',
    description:
      'Contact Kirti Verma for inquiries about private somatic movement sessions, weekly classes and workshops. Connect via email or WhatsApp at Field of Soma.',
    schema: getFullSchemasForRoute('/contact'),
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'Read the Field of Soma privacy policy: how personal data, consultations and payments are protected with confidential security and transport encryption.',
    schema: getFullSchemasForRoute('/privacy'),
  },
  terms: {
    path: '/terms',
    title: 'Terms of Service',
    description:
      'Review the terms of service, educational disclaimer and class participation guidelines for Field of Soma movement practices and private consultations.',
    schema: getFullSchemasForRoute('/terms'),
  },
  returns: {
    path: '/returns',
    title: 'Refund & Cancellation Policy',
    description:
      'Learn about our 7-day satisfaction money-back guarantee on recorded movement classes and fair cancellation policy for private sessions at Field of Soma.',
    schema: getFullSchemasForRoute('/returns'),
  },
  // Kept out of search results
  cart: { path: '/cart', title: 'Your Cart', noindex: true },
  checkout: { path: '/checkout', title: 'Checkout', noindex: true },
  login: { path: '/login', title: 'Member Login', noindex: true },
  signup: { path: '/signup', title: 'Create Account', noindex: true },
}

// Clean short names for class titles to ensure <= 60 chars SERP limit with " | Field of Soma"
const CLASS_TITLE_MAP = {
  'neck-shoulder-freedom': 'Neck & Shoulder Freedom Class',
  'lower-back-release': 'Lower Back Release Class',
  'grounding-flow': 'Grounding Flow Tai Chi Class',
  'the-easy-breath': 'The Easy Breath Somatic Class',
  'spine-stories': 'Spine Stories Movement Class',
  'standing-like-a-tree': 'Standing Like a Tree Tai Chi',
}

export const classSeo = (course) => {
  const shortTitle = CLASS_TITLE_MAP[course.id] || `${course.title} Class`
  const rawDesc = `${course.subtitle} Guided ${course.practiceName} online video class by Kirti Verma at Field of Soma.`
  return {
    path: `/classes/${course.id}`,
    title: shortTitle,
    description: formatMetaDescription(rawDesc),
    image: course.image?.src,
    imageAlt: course.image?.alt,
    schema: getFullSchemasForRoute(`/classes/${course.id}`),
  }
}

const ARTICLE_TITLE_MAP = {
  'moving-with-nobody-watching': 'Moving with Nobody Watching',
  'on-doing-less': 'On Doing Less: The Art of Rest',
  'standing-like-a-tree': 'Standing Like a Tree in Practice',
  'the-yawn-you-do-on-purpose': 'The Yawn You Do on Purpose',
  'what-stress-leaves-behind': 'What Stress Leaves Behind',
  'why-stretching-does-not-undo-a-habit': 'Why Stretching Does Not Undo Habit',
}

export const articleSeo = (article) => {
  const shortTitle = ARTICLE_TITLE_MAP[article.id] || article.title
  const rawDesc = `${article.excerpt} Somatic reflections and movement notes by Kirti Verma at Field of Soma.`
  return {
    path: `/articles/${article.id}`,
    title: shortTitle,
    description: formatMetaDescription(rawDesc),
    image: article.image?.src,
    imageAlt: article.image?.alt,
    type: 'article',
    schema: getFullSchemasForRoute(`/articles/${article.id}`),
  }
}

// Every page the build writes its own HTML file for
export const allPages = () => [
  ...Object.values(pages),
  ...classes.items.map(classSeo),
  ...[articles.featured, ...articles.list].map(articleSeo),
]

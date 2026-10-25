import { articles } from './articles'
import { classes } from './classes'

// Titles and descriptions for every page, in one place. The pages use them while the site
// runs, and the build writes them into each page's own HTML file (scripts/prerender.mjs),
// so search engines and link previews on WhatsApp, Instagram and LinkedIn read the right
// words straight away, without running any script.
// Keep titles under about 60 characters with " | Field of Soma" added, and descriptions under 155.

export const pages = {
  home: {
    path: '/',
    title: '',
    description:
      'Movement and somatic education with Kirti Verma: Somatic Movement Therapy, Tai Chi and Creative Movement. Gentle practices to release held tension.',
    image: '/photos/kirti-author-preview.jpg',
    imageAlt: 'Kirti Verma: Movement and Somatic Educator',
  },
  somatics: {
    path: '/somatics',
    title: 'What Is Somatics? Gentle Movement and Somatic Education',
    description:
      'What Somatics is and how it helps: slow, gentle movement that lets long-held tension go. Movement and somatic education with Kirti Verma.',
    keywords:
      'what is somatics, somatic movement, movement and somatic education, pandiculation, sensory motor amnesia, somatic exercises, Kirti Verma',
  },
  practices: {
    path: '/practices',
    title: 'The Practices: Somatic Movement Therapy, Tai Chi and Creative Movement',
    description:
      'Somatic Movement Therapy, Tai Chi and Creative Movement with Kirti Verma: what each practice is, who it serves and how it helps.',
    keywords: 'Somatic Movement Therapy, Tai Chi, Feldenkrais, Body-Mind Centering, moving meditation, creative movement',
  },
  classes: {
    path: '/classes',
    title: 'Recorded Classes: Somatic Movement Therapy, Tai Chi and Creative Movement',
    description:
      'Recorded classes with Kirti Verma you can practise at home, in your own time: Somatic Movement Therapy, Tai Chi and Creative Movement.',
    keywords:
      'somatic classes online, recorded somatics, neck shoulder release video, lower back somatic exercises, pandiculation lessons',
  },
  calendar: {
    path: '/calendar',
    title: 'Book a Session or Class with Kirti Verma',
    description:
      'Book a private session with Kirti Verma, or join a weekly Somatic Movement Therapy, Tai Chi or Creative Movement class.',
  },
  about: {
    path: '/about',
    title: 'About Kirti Verma: Movement and Somatic Educator',
    description:
      'Kirti Verma is a movement and somatic educator. She teaches Somatic Movement Therapy and Tai Chi, with Creative Movement drawn from dance.',
    keywords:
      'Kirti Verma, movement and somatic educator, somatic movement therapy teacher, Tai Chi teacher, creative movement, somatics India',
    image: '/photos/kirti-author-preview.jpg',
    imageAlt: 'Kirti Verma: Movement and Somatic Educator',
  },
  articles: {
    path: '/articles',
    title: 'Writing on Somatics, Tai Chi and Rest',
    description:
      'Short pieces by Kirti Verma about Somatics, Tai Chi and paying attention to the body. Sign up for Field Notes.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Kirti Verma: Email, WhatsApp and Instagram',
    description:
      'Questions about a session, a class or somatic movement? Write to Kirti Verma by email, WhatsApp or Instagram, or send a message here.',
  },
  // Kept out of search results
  cart: { path: '/cart', title: 'Your Cart', noindex: true },
  checkout: { path: '/checkout', title: 'Checkout', noindex: true },
  login: { path: '/login', title: 'Member Login', noindex: true },
  signup: { path: '/signup', title: 'Create Account', noindex: true },
}

export const classSeo = (course) => ({
  path: `/classes/${course.id}`,
  title: `${course.title}: Recorded ${course.practiceName} Class`,
  description: `${course.subtitle} A recorded class with Kirti Verma.`,
  image: course.image?.src,
  imageAlt: course.image?.alt,
})

export const articleSeo = (article) => ({
  path: `/articles/${article.id}`,
  title: article.title,
  description: `${article.excerpt} A short piece by Kirti Verma, movement and somatic educator.`,
  image: article.image?.src,
  imageAlt: article.image?.alt,
  type: 'article',
})

// Every page the build writes its own HTML file for
export const allPages = () => [
  ...Object.values(pages),
  ...classes.items.map(classSeo),
  ...[articles.featured, ...articles.list].map(articleSeo),
]

import { about } from '../content/about'
import { articles as siteArticles } from '../content/articles'
import { calendar } from '../content/calendar'
import { classes } from '../content/classes'
import { voices } from '../content/home'
import { images } from '../content/images'
import { site } from '../content/site'
import { rupees } from './util'

// SAMPLE DATA for the admin preview. Nothing here is real: names, orders, messages and
// numbers only show how each screen works. seedData() is the starting point the admin's
// store (store.jsx) loads the first time, and again after "Reset sample data".
// Classes, the schedule, writing, photos and testimonials come from the site's own content files.

export const ADMIN_EMAIL = 'kirtiverma.kv@gmail.com'

// Raise this when the shape of the data changes, so old saved copies are replaced.
export const DATA_VERSION = 3

export { rupees }

export const MESSAGE_KINDS = [
  ['all', 'All'],
  ['message', 'Messages'],
  ['session', 'Session requests'],
  ['class', 'Class enquiries'],
  ['notes', 'Field Notes'],
]

export const KIND_LABEL = {
  message: 'Message',
  session: 'Session request',
  class: 'Class enquiry',
  notes: 'Field Notes',
}

export const PRACTICES = ['Somatic Movement Therapy', 'Tai Chi', 'Creative Movement']

// The money chart stays a sample until real payments arrive from Razorpay.
export const chartSets = {
  week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [400, 900, 0, 1100, 600, 1200, 500], total: 4700, caption: 'this week' },
  month: { labels: ['1 Oct', '9 Oct', '16 Oct', 'Today'], values: [400, 900, 600, 600, 800, 1100, 2000, 1200, 1700, 900, 1300, 1400, 1800, 1600, 2100], total: 18400, caption: 'this month' },
  year: { labels: ['Jan', 'Apr', 'Jul', 'Oct'], values: [6200, 7400, 5800, 8100, 9600, 8800, 10400, 11800, 15200, 18400], total: 101700, caption: 'this year so far' },
}

const messages = [
  {
    id: 1,
    kind: 'session',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+91 98765 43210',
    when: '9:42 am',
    received: 'today at 9:42 am',
    status: 'New',
    details: [
      ['Practice', 'Somatic Movement Therapy'],
      ['Format', 'Online, private'],
      ['Best time', 'Weekday mornings'],
    ],
    message:
      'Hello Kirti, I have had a stiff lower back for about two years, mostly from long hours at my desk. I would like to try a private session online. Weekday mornings suit me best.\n\nThank you, Priya',
  },
  {
    id: 2,
    kind: 'message',
    name: 'Arjun Mehta',
    email: 'arjun.m@example.com',
    phone: '',
    when: '8:15 am',
    received: 'today at 8:15 am',
    status: 'New',
    details: [['Practice', 'Tai Chi']],
    message:
      'Is the Wednesday Tai Chi class suitable for someone in their sixties with some knee trouble? I have never done Tai Chi before.',
  },
  {
    id: 3,
    kind: 'class',
    name: 'Sara Thomas',
    email: 'sara.thomas@example.com',
    phone: '',
    when: 'Yesterday',
    received: 'yesterday at 6:30 pm',
    status: 'New',
    details: [['Class', 'Spine Stories']],
    message: 'Will Spine Stories be available soon? I would love to buy it for my mother as well.',
  },
  {
    id: 4,
    kind: 'session',
    name: 'Neha Gupta',
    email: 'neha.g@example.com',
    phone: '+91 91234 56789',
    when: 'Yesterday',
    received: 'yesterday at 11:05 am',
    status: 'Replied',
    details: [
      ['Practice', 'Creative Movement'],
      ['Format', 'In person, group'],
      ['Best time', 'Saturday morning'],
    ],
    message: 'Hi, I would like to join the Saturday Creative Movement session this month. Is there still a place?',
  },
  {
    id: 5,
    kind: 'notes',
    name: 'rohan.b@example.com',
    email: 'rohan.b@example.com',
    phone: '',
    when: 'Thu',
    received: 'Thursday at 7:12 pm',
    status: 'New',
    details: [['Signed up from', 'Writing page']],
    message: 'New Field Notes sign-up.',
  },
  {
    id: 6,
    kind: 'message',
    name: 'Kavya Iyer',
    email: 'kavya.iyer@example.com',
    phone: '',
    when: 'Wed',
    received: 'Wednesday at 4:48 pm',
    status: 'Done',
    details: [['Practice', 'Not sure yet']],
    message:
      'Thank you for the session last week. My shoulders have felt so much lighter. Do you have a recorded class I can follow at home?',
  },
  {
    id: 7,
    kind: 'session',
    name: 'Imran Shaikh',
    email: 'imran.s@example.com',
    phone: '+91 99887 76655',
    when: 'Tue',
    received: 'Tuesday at 9:20 am',
    status: 'Done',
    details: [
      ['Practice', 'Tai Chi'],
      ['Format', 'In person, private'],
      ['Best time', 'Weekday evenings'],
    ],
    message: 'Looking for private Tai Chi lessons for my father and me. Evenings work best for us.',
  },
].map((message) => ({ ...message, note: '' }))

const classTitle = (id) => classes.items.find((item) => item.id === id)?.title ?? id

const orders = [
  { id: 'SOMA-MVK2A1', date: '24 Oct, 9:58 am', name: 'Ananya Sharma', email: 'ananya.s@example.com', items: [['neck-shoulder-freedom', 600]], promo: 'WELCOME10', discount: 60, method: 'UPI', status: 'Paid', payId: 'pay_PzT4mQ2c8LxV1a' },
  { id: 'SOMA-MVK1Z8', date: '24 Oct, 6:40 am', name: 'Rahul Kapoor', email: 'rahul.k@example.com', items: [['standing-like-a-tree', 400]], promo: '', discount: 0, method: 'Card', status: 'Paid', payId: 'pay_PzS9aN7kQ1rT0b' },
  { id: 'SOMA-MVJX44', date: '23 Oct, 7:12 pm', name: 'Meera Desai', email: 'meera.d@example.com', items: [['lower-back-release', 600]], promo: '', discount: 0, method: 'UPI', status: 'Refunded', payId: 'pay_PzK2fV5dW8mJ3c' },
  { id: 'SOMA-MVJW90', date: '23 Oct, 3:05 pm', name: 'David Lobo', email: 'david.l@example.com', items: [['grounding-flow', 700]], promo: '', discount: 0, method: 'Card', status: 'Failed', payId: 'pay_PzJ8cB1tX4nP6d' },
  { id: 'SOMA-MVJQ12', date: '22 Oct, 8:30 am', name: 'Priya Nair', email: 'priya.nair@example.com', items: [['neck-shoulder-freedom', 600], ['the-easy-breath', 500]], promo: 'FRIENDS', discount: 150, method: 'Net banking', status: 'Paid', payId: 'pay_PzE3hM9qL2vY7e' },
  { id: 'SOMA-MVJM07', date: '21 Oct, 9:48 pm', name: 'Kavya Iyer', email: 'kavya.iyer@example.com', items: [['spine-stories', 500]], promo: '', discount: 0, method: 'UPI', status: 'Paid', payId: 'pay_Pz8kR4wN6sB2f' },
  { id: 'SOMA-MVJ8C3', date: '20 Oct, 11:20 am', name: 'Arjun Mehta', email: 'arjun.m@example.com', items: [['standing-like-a-tree', 400], ['grounding-flow', 700]], promo: 'TAICHI20', discount: 220, method: 'UPI', status: 'Paid', payId: 'pay_Pz3pT8yC1kH5g' },
  { id: 'SOMA-MVJ2R9', date: '18 Oct, 10:15 am', name: 'Sara Thomas', email: 'sara.thomas@example.com', items: [['the-easy-breath', 500]], promo: 'WELCOME10', discount: 50, method: 'Wallet', status: 'Paid', payId: 'pay_PyW6vF3mZ9qD4h' },
].map((order) => ({
  ...order,
  items: order.items.map(([id, price]) => ({ id, title: classTitle(id), price })),
  amount: order.items.reduce((total, [, price]) => total + price, 0) - order.discount,
}))

const members = [
  { id: 'm1', name: 'Ananya Sharma', email: 'ananya.s@example.com', joined: '2 Oct 2026', owns: ['neck-shoulder-freedom'], spent: 540, lastVisit: 'Today', fieldNotes: true },
  { id: 'm2', name: 'Rahul Kapoor', email: 'rahul.k@example.com', joined: '24 Oct 2026', owns: ['standing-like-a-tree'], spent: 400, lastVisit: 'Today', fieldNotes: false },
  { id: 'm3', name: 'Priya Nair', email: 'priya.nair@example.com', joined: '5 Aug 2026', owns: ['neck-shoulder-freedom', 'the-easy-breath'], spent: 950, lastVisit: 'Today', fieldNotes: true },
  { id: 'm4', name: 'Meera Desai', email: 'meera.d@example.com', joined: '12 Sep 2026', owns: [], spent: 0, lastVisit: '3 days ago', fieldNotes: true },
  { id: 'm5', name: 'David Lobo', email: 'david.l@example.com', joined: '23 Oct 2026', owns: [], spent: 0, lastVisit: 'Yesterday', fieldNotes: false },
  { id: 'm6', name: 'Kavya Iyer', email: 'kavya.iyer@example.com', joined: '18 Jul 2026', owns: ['spine-stories'], spent: 500, lastVisit: 'Wednesday', fieldNotes: true },
  { id: 'm7', name: 'Arjun Mehta', email: 'arjun.m@example.com', joined: '20 Oct 2026', owns: ['standing-like-a-tree', 'grounding-flow'], spent: 880, lastVisit: 'Tuesday', fieldNotes: false },
  { id: 'm8', name: 'Sara Thomas', email: 'sara.thomas@example.com', joined: '18 Oct 2026', owns: ['the-easy-breath'], spent: 450, lastVisit: 'Yesterday', fieldNotes: true },
  { id: 'm9', name: 'Neha Gupta', email: 'neha.g@example.com', joined: '1 Sep 2026', owns: [], spent: 0, lastVisit: '2 weeks ago', fieldNotes: true },
  { id: 'm10', name: 'Imran Shaikh', email: 'imran.s@example.com', joined: '15 Oct 2026', owns: [], spent: 0, lastVisit: 'Tuesday', fieldNotes: false },
].map((member) => ({ ...member, note: '' }))

const reviews = [
  { id: 'r1', status: 'Waiting', name: 'Priya Nair', classId: 'neck-shoulder-freedom', stars: 5, when: '2 days ago', text: 'Slow and kind. I could feel my shoulders drop by the end of the first lesson.' },
  { id: 'r2', status: 'Waiting', name: 'Arjun Mehta', classId: 'standing-like-a-tree', stars: 4, when: '3 days ago', text: 'Simple to follow. I would love a longer version for the evenings.' },
  { id: 'r3', status: 'Waiting', name: 'Kavya Iyer', classId: 'spine-stories', stars: 5, when: '4 days ago', text: 'I did not expect to enjoy moving without any steps this much.' },
  { id: 'r4', status: 'Waiting', name: 'Sara Thomas', classId: 'the-easy-breath', stars: 5, when: '5 days ago', text: 'A good one before bed. My breathing feels easier afterwards.' },
  { id: 'r5', status: 'Approved', name: 'Ananya Sharma', classId: 'neck-shoulder-freedom', stars: 5, when: '2 weeks ago', text: 'I do the short reset at my desk most afternoons now.' },
  { id: 'r6', status: 'Hidden', name: 'Unknown', classId: 'lower-back-release', stars: 1, when: '3 weeks ago', text: 'Cheap followers here, visit my page.' },
]

// The site's sample testimonials (Home page), as the admin would list them.
const testimonials = voices.items.map((item, index) => ({
  id: `t${index + 1}`,
  quote: item.quote,
  name: item.name,
  context: item.context,
  permission: false,
  onHome: true,
  onAbout: index < 2,
}))

const promos = [
  { code: 'WELCOME10', kind: 'percent', value: 10, used: 18, limit: 100, starts: '1 Oct 2026', ends: 'No end date', status: 'Active', revenue: 9450 },
  { code: 'FRIENDS', kind: 'amount', value: 150, used: 3, limit: 20, starts: '15 Sep 2026', ends: '31 Dec 2026', status: 'Active', revenue: 2850 },
  { code: 'TAICHI20', kind: 'percent', value: 20, used: 6, limit: 50, starts: '1 Oct 2026', ends: '30 Nov 2026', status: 'Active', revenue: 3960 },
  { code: 'DIWALI25', kind: 'percent', value: 25, used: 0, limit: 200, starts: '5 Nov 2026', ends: '12 Nov 2026', status: 'Scheduled', revenue: 0 },
  { code: 'SUMMER15', kind: 'percent', value: 15, used: 37, limit: 0, starts: '1 Jun 2026', ends: '31 Aug 2026', status: 'Ended', revenue: 14200 },
].map((promo) => ({ ...promo, id: promo.code }))

// Every photo the site already uses, so they can be picked for classes, writing and the profile.
const photoName = (src) => src.split('/').pop().replace(/-\d+\.webp$/, '')
const photos = Object.entries(images).map(([key, image]) => ({
  id: key,
  source: 'site',
  name: photoName(image.src),
  src: image.src,
  srcSet: image.srcSet,
  alt: image.alt,
}))
const photoIdFor = (image) => photos.find((p) => p.src === image?.src)?.id ?? null

// Per-class figures. Lesson lists, prices and photos come from the site.
const CLASS_STATS = {
  'neck-shoulder-freedom': { status: 'Published', sold: 58, hasVideo: true },
  'lower-back-release': { status: 'Published', sold: 41, hasVideo: true },
  'standing-like-a-tree': { status: 'Published', sold: 33, hasVideo: true },
  'spine-stories': { status: 'Draft', sold: 0, hasVideo: false },
  'the-easy-breath': { status: 'Published', sold: 27, hasVideo: true },
  'grounding-flow': { status: 'Published', sold: 19, hasVideo: true },
}

const priceValue = (price) => Number(String(price ?? '').replace(/[^\d]/g, '')) || 0
const seconds = (length) =>
  String(length ?? '')
    .split(':')
    .map(Number)
    .reduce((total, part) => total * 60 + (part || 0), 0)

const adminClasses = classes.items.map((item) => {
  const stats = CLASS_STATS[item.id] ?? { status: 'Draft', sold: 0, hasVideo: false }
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle ?? '',
    practiceName: item.practiceName,
    level: item.level ?? 'All levels',
    duration: item.duration ?? '',
    priceValue: priceValue(item.price),
    originalValue: priceValue(item.originalPrice),
    status: stats.status,
    sold: stats.sold,
    revenue: stats.sold * priceValue(item.price),
    imageId: photoIdFor(item.image),
    overview: item.overview ?? [],
    whatYouWillLearn: item.whatYouWillLearn ?? [],
    requirements: item.requirements ?? [],
    lessons: (item.curriculum ?? []).map((lesson) => ({
      id: `${item.id}-${lesson.id}`,
      title: lesson.title,
      length: lesson.duration,
      preview: Boolean(lesson.previewable),
      // Sample lessons count as having a video, but there is no file behind them to play.
      video: stats.hasVideo ? { id: `sample-${item.id}-${lesson.id}`, sample: true, name: `${lesson.id}.mp4`, duration: seconds(lesson.duration) } : null,
    })),
    seoTitle: `${item.title}: Recorded ${item.practiceName} Class`,
    seoDescription: item.subtitle ? `${item.subtitle} A recorded class with Kirti Verma.` : '',
  }
})

// "7:00 am" becomes "07:00", for the time inputs
const to24 = (time) => {
  const [, h, m, ampm] = time.match(/(\d+):(\d+)\s*(am|pm)/i) ?? []
  if (!h) return ''
  const hour = (Number(h) % 12) + (ampm.toLowerCase() === 'pm' ? 12 : 0)
  return `${String(hour).padStart(2, '0')}:${m}`
}

const schedule = calendar.schedule.rows.map((row, index) => ({
  id: row.id,
  day: row.day,
  time: to24(row.time),
  title: row.title,
  format: row.format,
  onSite: true,
}))

// One to one sessions: requests from the contact form, and the times Kirti has booked.
const sessions = [
  { id: 's1', messageId: 1, name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+91 98765 43210', practice: 'Somatic Movement Therapy', format: 'Online', preferred: 'Weekday mornings', status: 'Requested', date: '', time: '', where: '', requested: 'Today' },
  { id: 's2', messageId: null, name: 'Kavya Iyer', email: 'kavya.iyer@example.com', phone: '', practice: 'Somatic Movement Therapy', format: 'Online', preferred: 'Early mornings', status: 'Booked', date: '2026-10-28', time: '07:30', where: 'Online, link sent by email', requested: '20 Oct' },
  { id: 's3', messageId: 4, name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 91234 56789', practice: 'Creative Movement', format: 'In person', preferred: 'Saturday morning', status: 'Booked', date: '2026-10-31', time: '10:00', where: 'Studio, Dharamshala', requested: 'Yesterday' },
  { id: 's4', messageId: 7, name: 'Imran Shaikh', email: 'imran.s@example.com', phone: '+91 99887 76655', practice: 'Tai Chi', format: 'In person', preferred: 'Weekday evenings', status: 'Done', date: '2026-10-21', time: '18:30', where: 'Studio, Dharamshala', requested: '14 Oct' },
].map((session) => ({ ...session, note: '' }))

const ARTICLE_DATES = ['2026-10-02', '2026-09-18', '2026-09-04', '2026-08-21', '2026-08-07', '2026-07-24']
const writing = [siteArticles.featured, ...siteArticles.list].map((piece, index) => ({
  id: piece.id,
  title: piece.title,
  topic: piece.topic,
  excerpt: piece.excerpt,
  body: (piece.paragraphs ?? []).join('\n\n'),
  imageId: photoIdFor(piece.image),
  status: 'Published',
  date: ARTICLE_DATES[index] ?? '2026-07-01',
  sendToNotes: false,
  sentToNotes: index < 3,
  seoTitle: piece.title,
  seoDescription: piece.excerpt,
}))

const profile = {
  name: site.person,
  role: 'Movement and Somatic Educator',
  bio: about.intro.lede,
  location: 'Dharamshala, and online',
  email: site.email,
  whatsapp: site.whatsapp,
  instagram: site.instagram,
  photoId: 'kirtiPortrait',
}

const settings = {
  bookingUrl: '',
  notifyEmail: ADMIN_EMAIL,
  notify: { messages: true, orders: true, reviews: true },
  policies: { refund: '', privacy: '', terms: '' },
  policiesUpdated: '',
}

export function seedData() {
  return {
    version: DATA_VERSION,
    seededAt: Date.now(),
    messages,
    orders,
    members,
    reviews,
    testimonials,
    promos,
    classes: adminClasses,
    schedule,
    sessions,
    writing,
    photos,
    profile,
    settings,
    activity: [],
  }
}

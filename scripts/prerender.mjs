// Runs after every build. Writes a copy of dist/index.html for each page (dist/about/index.html
// and so on) with that page's own title, description, canonical link and share details in the
// head. Search engines and link previews (WhatsApp, Instagram, LinkedIn, Facebook) then read the
// right words without running any script. The page itself still loads as the same React app.
// Titles and descriptions come from src/content/seo.js.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const BASE = 'https://fieldofsoma.com'
const SITE = 'Field of Soma'
const DEFAULT_TITLE = 'Field of Soma: Movement and Somatic Education with Kirti Verma'
const DEFAULT_IMAGE = `${BASE}/photos/kirti-forest-hero.jpg`
const DEFAULT_IMAGE_ALT = 'Kirti Verma standing among tall pines in a white dress'

// The content files use Vite-style imports, so let Vite load them.
const vite = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, entries: [] },
})
let allPages
try {
  ;({ allPages } = await vite.ssrLoadModule('/src/content/seo.js'))
} finally {
  await vite.close()
}

const template = readFileSync(join(dist, 'index.html'), 'utf8')

const escape = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Replaces a meta tag's content, or adds the tag when the template does not have it
function setMeta(html, attribute, key, value) {
  const tag = new RegExp(`(<meta\\s+${attribute}="${key.replace(/[:.]/g, '\\$&')}"\\s+content=")[^"]*(")`)
  if (tag.test(html)) return html.replace(tag, `$1${escape(value)}$2`)
  return html.replace('</head>', `  <meta ${attribute}="${key}" content="${escape(value)}" />\n  </head>`)
}

function headFor(page) {
  const title = !page.title ? DEFAULT_TITLE : page.title.includes(SITE) ? page.title : `${page.title} | ${SITE}`
  const url = `${BASE}${page.path}`
  const image = page.image ? (page.image.startsWith('/') ? `${BASE}${page.image}` : page.image) : DEFAULT_IMAGE
  const imageAlt = page.image ? page.imageAlt || title : DEFAULT_IMAGE_ALT

  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${escape(url)}$2`)
  html = setMeta(html, 'name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
  if (page.description) {
    html = setMeta(html, 'name', 'description', page.description)
    html = setMeta(html, 'property', 'og:description', page.description)
    html = setMeta(html, 'name', 'twitter:description', page.description)
  }
  if (page.keywords) html = setMeta(html, 'name', 'keywords', page.keywords)
  html = setMeta(html, 'property', 'og:type', page.type || 'website')
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', image)
  html = setMeta(html, 'property', 'og:image:alt', imageAlt)
  html = setMeta(html, 'name', 'twitter:title', title)
  html = setMeta(html, 'name', 'twitter:image', image)
  return html
}

const pages = allPages()
for (const page of pages) {
  const folder = page.path === '/' ? dist : join(dist, ...page.path.split('/').filter(Boolean))
  mkdirSync(folder, { recursive: true })
  writeFileSync(join(folder, 'index.html'), headFor(page))
}
console.log(`Page heads written for ${pages.length} pages.`)

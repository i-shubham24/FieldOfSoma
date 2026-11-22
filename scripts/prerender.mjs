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
const DEFAULT_TITLE = 'Field of Soma | Somatic Movement & Tai Chi India'
const DEFAULT_IMAGE = `${BASE}/photos/kirti-author-preview.jpg`
const DEFAULT_IMAGE_ALT = 'Kirti Verma: Movement and Somatic Educator'

// The content files use Vite-style imports, so let Vite load them.
const vite = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, entries: [] },
})
let allPages, getFullSchemasForRoute, getNoscriptContentForRoute, formatMetaTitle, formatMetaDescription
try {
  ;({ allPages, formatMetaTitle, formatMetaDescription } = await vite.ssrLoadModule('/src/content/seo.js'))
  ;({ getFullSchemasForRoute, getNoscriptContentForRoute } = await vite.ssrLoadModule('/src/content/schemas.js'))
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
  const rawTitle = page.title || DEFAULT_TITLE
  const title = formatMetaTitle ? formatMetaTitle(rawTitle) : (rawTitle.includes(SITE) ? rawTitle : `${rawTitle} | ${SITE}`)
  const url = `${BASE}${page.path}`
  let image = page.image ? (page.image.startsWith('/') ? `${BASE}${page.image}` : page.image) : DEFAULT_IMAGE
  if (image.endsWith('.webp')) {
    image = DEFAULT_IMAGE
  }
  const imageAlt = page.image && !page.image.endsWith('.webp') ? page.imageAlt || title : DEFAULT_IMAGE_ALT
  const description = page.description ? (formatMetaDescription ? formatMetaDescription(page.description) : page.description) : ''

  // Start with template and strip any default dev ld+json schemas to guarantee 0 duplicates
  let html = template.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${escape(url)}$2`)
  html = setMeta(html, 'name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
  if (description) {
    html = setMeta(html, 'name', 'description', description)
    html = setMeta(html, 'property', 'og:description', description)
    html = setMeta(html, 'name', 'twitter:description', description)
  }
  if (page.keywords) html = setMeta(html, 'name', 'keywords', page.keywords)
  html = setMeta(html, 'property', 'og:type', page.type || 'website')
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', image)
  html = setMeta(html, 'property', 'og:image:secure_url', image)
  html = setMeta(html, 'property', 'og:image:type', 'image/jpeg')
  html = setMeta(html, 'property', 'og:image:width', '1200')
  html = setMeta(html, 'property', 'og:image:height', '630')
  html = setMeta(html, 'property', 'og:image:alt', imageAlt)
  html = setMeta(html, 'name', 'twitter:title', title)
  html = setMeta(html, 'name', 'twitter:image', image)
  html = setMeta(html, 'name', 'twitter:image:alt', imageAlt)

  // Inject structured JSON-LD schemas
  const schemas = getFullSchemasForRoute ? getFullSchemasForRoute(page.path) : null
  if (schemas && schemas.length > 0) {
    const jsonLd = `  <script type="application/ld+json">${JSON.stringify(schemas)}</script>\n  </head>`
    html = html.replace('</head>', jsonLd)
  }

  // Inject crawler-ready noscript content fallback with semantic #seo-snapshot
  const noscript = getNoscriptContentForRoute ? getNoscriptContentForRoute(page.path) : null
  if (noscript) {
    html = html.replace('<div id="root">', `<noscript id="seo-snapshot">${noscript}</noscript>\n    <div id="root">`)
  }

  return html
}

const pages = allPages()
for (const page of pages) {
  const folder = page.path === '/' ? dist : join(dist, ...page.path.split('/').filter(Boolean))
  mkdirSync(folder, { recursive: true })
  writeFileSync(join(folder, 'index.html'), headFor(page))
}
console.log(`Page heads written for ${pages.length} pages.`)

// Writes public/sitemap.xml from the routes and content, so new classes and articles
// are listed automatically. Runs before every build.
import { readFileSync, writeFileSync } from 'node:fs'

// Content files use Vite-style imports, so read the ids from the source text instead.
// Class and article ids sit alone on their line at the top level of each item
// (`id: 'some-id',`, indented 4 or 6 spaces); lesson ids sit deeper and are skipped.
const ids = (file) =>
  [...readFileSync(new URL(`../src/content/${file}`, import.meta.url), 'utf8').matchAll(/^ {4,6}id: '([a-z0-9-]+)',$/gm)].map(
    (match) => match[1],
  )

const BASE = 'https://fieldofsoma.com'
const today = new Date().toISOString().slice(0, 10)

const pages = [
  ['/', '1.0'],
  ['/somatics', '0.9'],
  ['/practices', '0.9'],
  ['/classes', '0.9'],
  ['/calendar', '0.8'],
  ['/about', '0.8'],
  ['/articles', '0.7'],
  ['/contact', '0.6'],
  ...ids('classes.js').map((id) => [`/classes/${id}`, '0.7']),
  ...ids('articles.js').map((id) => [`/articles/${id}`, '0.6']),
]

const urls = pages
  .map(
    ([path, priority]) =>
      `  <url>\n    <loc>${BASE}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join('\n')

writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
console.log(`Sitemap written with ${pages.length} pages.`)

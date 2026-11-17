// Generates public/google-merchant.xml and public/feeds/google-merchant.xml
// for Google Merchant Center and Google Shopping automated product crawling.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const BASE = 'https://fieldofsoma.com'

const vite = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, entries: [] },
})

let classes
try {
  ;({ classes } = await vite.ssrLoadModule('/src/content/classes.js'))
} finally {
  await vite.close()
}

const escapeXml = (unsafe) =>
  String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const itemsXml = classes.items
  .map((course) => {
    const numericPrice = parseFloat(String(course.price || '').replace(/[^0-9.]/g, '')) || 600
    const imageUrl = course.image?.src
      ? (course.image.src.startsWith('http') ? course.image.src : `${BASE}${course.image.src}`)
      : `${BASE}/photos/kirti-author-preview.jpg`

    return `    <item>
      <g:id>SOMA-${escapeXml(course.id)}</g:id>
      <g:title>${escapeXml(course.title)}</g:title>
      <g:description>${escapeXml(course.subtitle)}</g:description>
      <g:link>${BASE}/classes/${escapeXml(course.id)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${numericPrice.toFixed(2)} INR</g:price>
      <g:brand>Field of Soma</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Media &gt; Digital Goods &amp; Currency</g:google_product_category>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Immediate Digital Streaming</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Field of Soma: Recorded Movement Classes</title>
    <link>${BASE}</link>
    <description>Recorded classes in Somatic Movement Therapy, Tai Chi, and Improvisation with Kirti Verma.</description>
${itemsXml}
  </channel>
</rss>
`

const publicDir = join(root, 'public')
const publicFeedsDir = join(publicDir, 'feeds')
mkdirSync(publicFeedsDir, { recursive: true })
writeFileSync(join(publicDir, 'google-merchant.xml'), xml)
writeFileSync(join(publicFeedsDir, 'google-merchant.xml'), xml)

const distDir = join(root, 'dist')
if (existsSync(distDir)) {
  const distFeedsDir = join(distDir, 'feeds')
  mkdirSync(distFeedsDir, { recursive: true })
  writeFileSync(join(distDir, 'google-merchant.xml'), xml)
  writeFileSync(join(distFeedsDir, 'google-merchant.xml'), xml)
}

console.log(`Google Merchant Center XML feeds written (${classes.items.length} items).`)

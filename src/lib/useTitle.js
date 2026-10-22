import { useEffect } from 'react'
import { site } from '../content/site'

const DEFAULT_TITLE = `${site.name}: Movement and Somatic Education with ${site.person}`
const DEFAULT_DESC =
  'Somatic Movement Therapy and Tai Chi with Kirti Verma. Gentle, body-based practices for releasing held tension and moving with ease.'
const BASE_URL = 'https://fieldofsoma.com'

function setMeta(attribute, name, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attribute, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

function setJsonLd(schema) {
  const SCRIPT_ID = 'route-json-ld'
  let script = document.getElementById(SCRIPT_ID)
  if (!schema) {
    if (script) script.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(schema)
}

const DEFAULT_OG_IMAGE = 'https://fieldofsoma.com/photos/kirti-forest-hero.jpg'

// Sets page title, meta description, OpenGraph tags, canonical link, breadcrumbs and JSON-LD schema.
export default function useTitle(titleOrOptions, maybeOptions = {}) {
  const options =
    typeof titleOrOptions === 'object' && titleOrOptions !== null
      ? titleOrOptions
      : { title: titleOrOptions, ...maybeOptions }

  const title = options.title
  const description = options.description || DEFAULT_DESC
  const path = options.path || (typeof window !== 'undefined' ? window.location.pathname : '')
  const keywords = options.keywords || null
  const image = options.image || null
  const schema = options.schema || null
  const breadcrumbs = options.breadcrumbs || null
  const noindex = Boolean(options.noindex)
  // Pages build their schema and breadcrumbs inline, so compare them by value: otherwise
  // the JSON-LD would be torn down and rebuilt on every render.
  const schemaKey = JSON.stringify(schema)
  const crumbsKey = JSON.stringify(breadcrumbs)

  useEffect(() => {
    const fullTitle = title
      ? title.includes(site.name)
        ? title
        : `${title} | ${site.name}`
      : DEFAULT_TITLE
    document.title = fullTitle

    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    if (keywords) setMeta('name', 'keywords', keywords)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', `${BASE_URL}${path}`)
    const shareImage = image ? (image.startsWith('/') ? `${BASE_URL}${image}` : image) : DEFAULT_OG_IMAGE
    setMeta('property', 'og:image', shareImage)

    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', shareImage)

    setCanonical(`${BASE_URL}${path}`)

    // Assemble unified JSON-LD schema with optional breadcrumb navigation
    let finalSchema = schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`,
          },
          ...breadcrumbs.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: b.name,
            item: b.path ? `${BASE_URL}${b.path}` : undefined,
          })),
        ],
      }

      if (schema) {
        finalSchema = {
          '@context': 'https://schema.org',
          '@graph': [
            breadcrumbSchema,
            ...(Array.isArray(schema['@graph']) ? schema['@graph'] : [schema]),
          ],
        }
      } else {
        finalSchema = {
          '@context': 'https://schema.org',
          ...breadcrumbSchema,
        }
      }
    }

    setJsonLd(finalSchema)

    return () => {
      const script = document.getElementById('route-json-ld')
      if (script) script.remove()
    }
    // schema and breadcrumbs are read through their keys above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, keywords, image, schemaKey, crumbsKey, noindex])
}

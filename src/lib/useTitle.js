import { useEffect } from 'react'
import { site } from '../content/site'

const DEFAULT_TITLE = `${site.name}: Movement and Somatic Education with ${site.person}`

// Sets the browser tab title for a page. Without an argument it restores the site title.
export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : DEFAULT_TITLE
  }, [title])
}

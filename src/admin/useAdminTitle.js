import useTitle from '../lib/useTitle'

// Admin pages are private: give each a clear tab title and keep them out of search results.
export default function useAdminTitle(name) {
  useTitle(`${name}: Admin`, { noindex: true })
}

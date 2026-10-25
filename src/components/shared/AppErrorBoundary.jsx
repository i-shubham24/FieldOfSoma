import { Component } from 'react'

// After a new version of the site goes live, a tab that was already open can ask for a page
// file that no longer exists. That shows up as a failed import: reload once to fetch the new
// version. Anything else shows a calm message instead of a blank page.
const RELOAD_KEY = 'soma_reloaded_for_update'

const isStaleFile = (error) =>
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk|ChunkLoadError/i.test(
    String(error?.message ?? error),
  )

export default class AppErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (!isStaleFile(error)) return
    try {
      // Reload at most once a minute, so a real outage cannot cause a reload loop
      const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
      if (Date.now() - last < 60000) return
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    } catch {
      return
    }
    window.location.reload()
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-soma-paper px-6 text-center text-soma-ink">
        <div className="max-w-md">
          <h1 className="font-display text-[2rem] leading-tight">Something did not load</h1>
          <p className="mt-4 text-[1rem] leading-relaxed text-soma-ink/80">
            The page may have been updated while it was open. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex min-h-12 cursor-pointer items-center justify-center bg-soma-moss px-6 text-sm font-medium text-soma-paper transition-colors hover:bg-soma-moss-light"
          >
            Reload the page
          </button>
        </div>
      </main>
    )
  }
}

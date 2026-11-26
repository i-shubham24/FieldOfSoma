import SomaLogo from './SomaLogo'

// The name, set in Cormorant Garamond with wide tracking
// Enhanced with the new client spiral emblem anchored by the signature terracotta dot
export default function Wordmark({
  className = '',
  showSpiral = true,
  spiralVariant = 'core',
  spiralSize = 24,
  palette = 'walnut',
}) {
  const hasColor = /text-/.test(className)
  return (
    <span
      className={`font-brand font-normal tracking-[0.2em] uppercase whitespace-nowrap inline-flex items-center gap-2.5 ${
        hasColor ? '' : 'text-soma-ink'
      } ${className}`}
    >
      {showSpiral && (
        <SomaLogo
          variant={spiralVariant}
          palette={palette}
          size={spiralSize}
          strokeWidth={2.4}
        />
      )}
      <span>Field of Soma</span>
      {!showSpiral && (
        <svg className="h-2 w-2 shrink-0 fill-[#B24C28]" viewBox="0 0 8 8" aria-hidden="true">
          <circle cx="4" cy="4" r="3.5" />
        </svg>
      )}
    </span>
  )
}

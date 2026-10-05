// The name, set in Astralaga (the bespoke brand display font from atelierakuko.com)
export default function Wordmark({ className = '' }) {
  const hasColor = /text-/.test(className)
  return (
    <span
      className={`font-brand font-normal tracking-[0.2em] uppercase whitespace-nowrap inline-flex items-center gap-2 ${
        hasColor ? '' : 'text-soma-ink'
      } ${className}`}
    >
      <span>Field of Soma</span>
      {/* Signature warm terracotta circle dot from Atelier Akuko */}
      <svg className="h-2 w-2 shrink-0 fill-[#B24C28]" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3.5" />
      </svg>
    </span>
  )
}

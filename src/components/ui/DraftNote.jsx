// A quiet marker on placeholder content, so a draft is never mistaken for Kirti's own words.
// Remove the note (or its `placeholder` flag in the content file) once the real text is in.
export default function DraftNote({ children, className = '' }) {
  return (
    <p className={`text-[0.75rem] leading-normal text-soma-clay-deep ${className}`}>{children}</p>
  )
}

// The name, set in the display serif with an italic "of".
export default function Wordmark({ className = '' }) {
  return (
    <span className={`font-display font-medium whitespace-nowrap ${className}`}>
      Field <span className="font-normal italic">of</span> Soma
    </span>
  )
}

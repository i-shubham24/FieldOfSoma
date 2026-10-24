// A field only bots fill in. People never see it: it sits off screen, out of the tab order
// and hidden from screen readers. sendForm() quietly drops any form where it has a value.
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}

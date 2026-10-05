import { booking } from '../../content/site'
import Reveal from '../motion/Reveal'
import Button from '../ui/Button'
import TextLink from '../ui/TextLink'

// The last thing on an inner page: one sentence, the booking action, one way onward.
// After a paper section it opens with a hairline; after a coloured band pass rule={false}.
export default function ClosingCall({
  heading,
  body,
  secondary,
  booking: showBooking = true,
  rule = true,
}) {
  return (
    <section className={rule ? 'pb-28 md:pb-40' : 'py-28 md:py-40'}>
      <div className="shell">
        <Reveal
          className={`mx-auto max-w-6xl text-center ${
            rule ? 'border-t border-soma-sand pt-24 md:pt-32' : ''
          }`}
        >
          <h2 className="mx-auto max-w-[18ch] text-heading">{heading}</h2>
          {body ? (
            <p className="mx-auto mt-6 max-w-[44ch] text-lede font-light text-soma-ink/80">
              {body}
            </p>
          ) : null}
          <div className="mt-10 flex flex-col items-center justify-center gap-7 sm:flex-row sm:gap-9">
            {showBooking ? (
              <Button to={booking.to} arrow>
                {booking.label}
              </Button>
            ) : null}
            {secondary ? <TextLink to={secondary.to}>{secondary.label}</TextLink> : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

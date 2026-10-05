import Reveal from '../../components/motion/Reveal'
import Button from '../../components/ui/Button'
import TextLink from '../../components/ui/TextLink'
import { invitation } from '../../content/home'
import { booking } from '../../content/site'
import NewsletterForm from './NewsletterForm'

// The closing invitation: come and practise, or stay in touch by letter.
export default function Invitation() {
  return (
    <section className="pb-28 md:pb-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-16 border-t border-soma-sand pt-20 md:pt-28 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <h2 className="text-heading">{invitation.heading}</h2>
            <p className="mt-6 max-w-[42ch] text-lede font-light text-soma-ink/80">
              {invitation.body}
            </p>
            <div className="mt-10 flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:gap-9">
              <Button to={booking.to} arrow>
                {booking.label}
              </Button>
              <TextLink to={invitation.schedule.to}>{invitation.schedule.label}</TextLink>
            </div>
          </Reveal>

          <Reveal
            delay={0.12}
            className="lg:col-span-5 lg:col-start-8 lg:border-l lg:border-soma-sand lg:pl-10 xl:pl-14"
          >
            <NewsletterForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

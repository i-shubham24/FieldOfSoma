import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import Button from '../components/ui/Button'
import TextLink from '../components/ui/TextLink'
import { formatPrice, priceValue, useCart } from '../lib/cart'
import { PAGE_TOP } from '../lib/layout'
import { usePurchasedClasses } from '../lib/purchases'
import useTitle from '../lib/useTitle'

export default function Cart() {
  useTitle('Your Cart', { noindex: true })
  const cart = useCart()
  const { isPurchased } = usePurchasedClasses()

  // A class bought since it was added has no business staying in the cart
  useEffect(() => {
    cart.items.filter((item) => isPurchased(item.id)).forEach((item) => cart.remove(item.id))
  }, [cart, isPurchased])

  const off = cart.original > cart.total ? Math.round((1 - cart.total / cart.original) * 100) : 0

  return (
    <section className={`${PAGE_TOP} pb-28 md:pb-40`}>
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <Reveal as="h1" className="text-display">
            Your cart
          </Reveal>
          <p className="mt-4 text-[0.9375rem] text-soma-clay-deep">
            {cart.count === 0
              ? 'Nothing here yet.'
              : `${cart.count} ${cart.count === 1 ? 'class' : 'classes'} in your cart`}
          </p>

          {cart.count === 0 ? (
            <div className="mt-14 border-t border-soma-sand pt-14">
              <p className="max-w-[40ch] text-lede font-light text-soma-ink/80">
                Browse the recorded classes and add the ones you would like to practise.
              </p>
              <Button to="/classes" arrow className="mt-8">
                Browse classes
              </Button>
            </div>
          ) : (
            <div className="mt-12 grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
              <ul className="divide-y divide-soma-sand border-y border-soma-sand lg:col-span-8">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-6 sm:gap-6">
                    <Link to={`/classes/${item.id}`} className="block h-20 w-28 shrink-0 overflow-hidden bg-soma-sand sm:h-24 sm:w-36" tabIndex={-1}>
                      <img src={item.image.src} alt="" loading="lazy" className="photo h-full w-full object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                      <div className="min-w-0">
                        <Link to={`/classes/${item.id}`} className="font-display text-[1.25rem] leading-[1.2] transition-colors hover:text-soma-moss">
                          {item.title}
                        </Link>
                        <p className="mt-1 text-[0.8125rem] text-soma-clay-deep">
                          By Kirti Verma / {item.practiceName} / {item.duration}
                        </p>
                        <button
                          type="button"
                          onClick={() => cart.remove(item.id)}
                          className="link-rest mt-2 min-h-8 cursor-pointer text-[0.8125rem] text-soma-ink/75 hover:text-soma-ink"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        <p className="font-semibold tabular-nums">{item.price}</p>
                        {priceValue(item.originalPrice) > priceValue(item.price) ? (
                          <p className="text-[0.8125rem] text-soma-clay-deep line-through tabular-nums">{item.originalPrice}</p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="border border-soma-sand bg-soma-paper p-6 sm:p-8 lg:sticky lg:top-28 lg:col-span-4">
                <p className="text-label font-medium tracking-wider text-soma-clay-deep uppercase">Total</p>
                <p className="mt-2 font-sans text-[2.25rem] leading-none font-semibold tabular-nums">
                  {formatPrice(cart.total)}
                </p>
                {off > 0 ? (
                  <p className="mt-2 text-[0.875rem] text-soma-clay-deep">
                    <span className="line-through tabular-nums">{formatPrice(cart.original)}</span>
                    <span className="ml-2 font-medium text-soma-moss">{off}% off</span>
                  </p>
                ) : null}
                <Button to="/checkout" arrow className="mt-8 w-full">
                  Checkout
                </Button>
                <TextLink to="/classes" className="mt-6">
                  Keep browsing
                </TextLink>
              </aside>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

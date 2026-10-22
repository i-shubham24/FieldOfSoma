import { useEffect, useState } from 'react'
import { classes } from '../content/classes'

// The cart lives in this browser (localStorage), like a guest cart on any shop.
const STORAGE_KEY = 'field_of_soma_cart'
const EVENT = 'soma_cart_changed'

const read = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

const write = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage blocked: the cart still works for this page view
  }
  window.dispatchEvent(new Event(EVENT))
}

// "₹1,200" -> 1200
export const priceValue = (price) => Number(String(price ?? '').replace(/[^\d.]/g, '')) || 0

export const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`

export const findClass = (id) => classes.items.find((item) => item.id === id)

export function addToCart(id) {
  const ids = read()
  if (!ids.includes(id)) write([...ids, id])
}

export function removeFromCart(id) {
  write(read().filter((item) => item !== id))
}

export function clearCart() {
  write([])
}

// Totals for a list of classes: what they would cost at full price, and what they cost now.
export function totalsFor(items) {
  const total = items.reduce((sum, item) => sum + priceValue(item.price), 0)
  const original = items.reduce(
    (sum, item) => sum + (priceValue(item.originalPrice) || priceValue(item.price)),
    0,
  )
  return { total, original, saving: Math.max(0, original - total) }
}

export function useCart() {
  const [ids, setIds] = useState(read)

  useEffect(() => {
    const update = () => setIds(read())
    window.addEventListener(EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  // Ignore ids of classes that no longer exist in the catalogue
  const items = ids.map(findClass).filter(Boolean)

  return {
    items,
    count: items.length,
    inCart: (id) => ids.includes(id),
    add: addToCart,
    remove: removeFromCart,
    clear: clearCart,
    ...totalsFor(items),
  }
}

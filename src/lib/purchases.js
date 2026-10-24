import { useEffect, useState } from 'react'

// Orders and the classes they unlock, kept in this browser for now. When real accounts
// arrive (Supabase or Clerk), these move to the server and follow the person's login.
// This list only changes what the page shows. It must never be the thing that grants
// access: anyone can edit their own browser storage. The server checks every purchase.
const PURCHASES_KEY = 'field_of_soma_purchases'
const ORDERS_KEY = 'field_of_soma_orders'
const EVENT = 'soma_purchases_changed'

const read = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function getPurchasedClasses() {
  return read(PURCHASES_KEY)
}

export function getOrders() {
  return read(ORDERS_KEY)
}

export function getOrder(id) {
  return getOrders().find((order) => order.id === id)
}

// Saves a paid order and unlocks its classes. `order` is
// { id, classIds, total, name, email, paymentId, mode, createdAt }.
export function recordOrder(order) {
  write(ORDERS_KEY, [order, ...getOrders()])
  const owned = getPurchasedClasses()
  write(PURCHASES_KEY, [...owned, ...order.classIds.filter((id) => !owned.includes(id))])
  window.dispatchEvent(new Event(EVENT))
}

export function usePurchasedClasses() {
  const [purchases, setPurchases] = useState(getPurchasedClasses)

  useEffect(() => {
    const update = () => setPurchases(getPurchasedClasses())
    window.addEventListener(EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  return {
    purchases,
    isPurchased: (id) => purchases.includes(id),
  }
}

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'field_of_soma_purchases'

export function getPurchasedClasses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addPurchasedClass(classId) {
  try {
    const current = getPurchasedClasses()
    if (!current.includes(classId)) {
      const updated = [...current, classId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('soma_purchases_changed'))
      return updated
    }
    return current
  } catch {
    return []
  }
}

export function isClassPurchased(classId) {
  return getPurchasedClasses().includes(classId)
}

export function clearPurchasedClasses() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('soma_purchases_changed'))
  } catch {
    // ignore
  }
}

export function usePurchasedClasses() {
  const [purchases, setPurchases] = useState(() => getPurchasedClasses())

  useEffect(() => {
    const handleUpdate = () => {
      setPurchases(getPurchasedClasses())
    }
    window.addEventListener('soma_purchases_changed', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('soma_purchases_changed', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return {
    purchases,
    isPurchased: (id) => purchases.includes(id),
    purchase: (id) => addPurchasedClass(id),
    clearPurchases: () => clearPurchasedClasses(),
  }
}

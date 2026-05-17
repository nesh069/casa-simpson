import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../firebase'
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const prevUserRef = useRef(user)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Load cart from Firestore when user changes
  useEffect(() => {
    const prevUser = prevUserRef.current
    prevUserRef.current = user

    if (!user) {
      setCartItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    const cartRef = doc(db, 'users', user.uid, 'cart', 'items')

    // Merge guest cart items into the user's Firestore cart on login
    if (!prevUser && cartItems.length > 0) {
      getDoc(cartRef).then((snap) => {
        const firestoreItems = snap.exists() ? (snap.data().items || []) : []
        const merged = [...firestoreItems]
        for (const guestItem of cartItems) {
          const existing = merged.find((i) => i.id === guestItem.id)
          if (existing) {
            existing.quantity = Math.max(existing.quantity, guestItem.quantity)
          } else {
            merged.push(guestItem)
          }
        }
        setDoc(cartRef, { items: merged, updatedAt: new Date().toISOString() })
      })
    }

    const unsubscribe = onSnapshot(
      cartRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setCartItems(snapshot.data().items || [])
        } else {
          setCartItems([])
        }
        setLoading(false)
      },
      (err) => {
        console.error('Cart load error:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const saveCart = async (items) => {
    if (!user) return
    const cartRef = doc(db, 'users', user.uid, 'cart', 'items')
    await setDoc(cartRef, { items, updatedAt: new Date().toISOString() })
  }

  const addToCart = async (item) => {
    const existing = cartItems.find((i) => i.id === item.id)
    let newItems

    if (existing) {
      newItems = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    } else {
      newItems = [...cartItems, { ...item, quantity: 1 }]
    }

    setCartItems(newItems)

    if (!user) return  // guest cart lives in local state only
    await saveCart(newItems)
    toast.success(`${item.name} added to cart`)
  }

  const removeFromCart = async (itemId) => {
    const newItems = cartItems.filter((i) => i.id !== itemId)
    setCartItems(newItems)
    if (!user) return
    await saveCart(newItems)
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(itemId)
      return
    }

    const newItems = cartItems.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    )
    setCartItems(newItems)
    if (!user) return
    await saveCart(newItems)
  }

  const clearCart = async () => {
    setCartItems([])
    if (user) {
      const cartRef = doc(db, 'users', user.uid, 'cart', 'items')
      await deleteDoc(cartRef)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
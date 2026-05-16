import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../firebase'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import toast from 'react-hot-toast'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const { user } = useAuth()
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Load user's bookings
  useEffect(() => {
    if (!user) {
      setMyBookings([])
      setLoading(false)
      return
    }

    setLoading(true)
    const bookingsRef = collection(db, 'bookings')
    const q = query(bookingsRef, where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setMyBookings(bookings)
        setLoading(false)
      },
      (err) => {
        console.error('Bookings load error:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  /**
   * Create a booking with conflict prevention using Firestore transaction.
   * This ensures two users cannot book the same room for overlapping dates.
   */
  const createBooking = async (roomId, roomName, checkIn, checkOut, totalPrice) => {
    if (!user) {
      toast.error('Please sign in to book a room')
      return { success: false, error: 'Not authenticated' }
    }

    const bookingId = `${user.uid}_${roomId}_${Date.now()}`
    const roomRef = doc(db, 'rooms', roomId)
    const bookingRef = doc(db, 'bookings', bookingId)

    try {
      const result = await runTransaction(db, async (transaction) => {
        // 1. Get current room data
        const roomSnap = await transaction.get(roomRef)
        if (!roomSnap.exists()) {
          throw new Error('Room not found')
        }

        const roomData = roomSnap.data()

        // 2. Check if room is available
        if (roomData.available === false) {
          throw new Error('Room is no longer available')
        }

        // 3. Check for overlapping bookings
        const bookingsRef = collection(db, 'bookings')
        const overlapQuery = query(
          bookingsRef,
          where('roomId', '==', roomId),
          where('status', 'in', ['confirmed', 'pending'])
        )
        const existingBookings = await getDocs(overlapQuery)

        const newCheckIn = new Date(checkIn).getTime()
        const newCheckOut = new Date(checkOut).getTime()

        for (const existing of existingBookings.docs) {
          const b = existing.data()
          const existingCheckIn = new Date(b.checkIn).getTime()
          const existingCheckOut = new Date(b.checkOut).getTime()

          // Check overlap: new booking overlaps if NOT (new ends before existing starts OR new starts after existing ends)
          const hasOverlap = !(newCheckOut <= existingCheckIn || newCheckIn >= existingCheckOut)

          if (hasOverlap) {
            throw new Error(
              `Room is already booked from ${b.checkIn} to ${b.checkOut}. Please choose different dates.`
            )
          }
        }

        // 4. Mark room as unavailable (optional — depends on your business logic)
        // transaction.update(roomRef, { available: false })

        // 5. Create the booking
        transaction.set(bookingRef, {
          userId: user.uid,
          userEmail: user.email,
          roomId,
          roomName,
          checkIn,
          checkOut,
          totalPrice,
          status: 'confirmed',
          createdAt: serverTimestamp(),
        })

        return { success: true, bookingId }
      })

      toast.success('Booking confirmed!')
      return result
    } catch (err) {
      const msg = err.message || 'Booking failed. Please try again.'
      toast.error(msg)
      return { success: false, error: msg }
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId)
      await updateDoc(bookingRef, { status: 'cancelled' })
      toast.success('Booking cancelled')
      return { success: true }
    } catch (err) {
      toast.error('Failed to cancel booking')
      return { success: false, error: err.message }
    }
  }

  return (
    <BookingContext.Provider
      value={{
        myBookings,
        createBooking,
        cancelBooking,
        loading,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within BookingProvider')
  return context
}
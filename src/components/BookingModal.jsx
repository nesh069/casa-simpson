import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../hooks/useFirestore'
import { formatCurrency, generateBookingRef } from '../utils/helpers'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function BookingModal({ room, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addDocument } = useCollection('bookings')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          )
        )
      : 0
  const total = nights * room.price

  const handleBooking = async (e) => {
    e.preventDefault()

    // Validation
    if (!user) {
      toast.error('Please sign in to book a room')
      navigate('/login')
      return
    }
    if (!checkIn) {
      toast.error('Please select a check-in date')
      return
    }
    if (!checkOut) {
      toast.error('Please select a check-out date')
      return
    }
    if (new Date(checkIn) < new Date(today)) {
      toast.error('Check-in date cannot be in the past')
      return
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error('Check-out must be after check-in')
      return
    }
    if (nights < 1) {
      toast.error('Minimum stay is 1 night')
      return
    }
    if (!guests || guests < 1) {
      toast.error('Please select number of guests')
      return
    }

    setLoading(true)
    try {
      const ref = generateBookingRef()
      await addDocument({
        userId: user.uid,
        userEmail: user.email,
        roomId: room.id,
        roomName: room.name,
        checkIn,
        checkOut,
        guests,
        nights,
        total,
        bookingRef: ref,
        status: 'confirmed',
      })
      toast.success(`Booking confirmed! Ref: ${ref}`)
      onClose()
    } catch (err) {
      toast.error('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">
            Book {room.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleBooking} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check In <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check Out <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests <span className="text-red-500">*</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} Guest{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {nights > 0 && (
            <div className="bg-stone-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {formatCurrency(room.price)} × {nights} night
                  {nights > 1 ? 's' : ''}
                </span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || nights < 1}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all"
          >
            {loading ? 'Confirming...' : nights < 1 ? 'Select dates to book' : 'Confirm Booking'}
          </button>

          {!user && (
            <p className="text-center text-sm text-gray-500">
              You need to{' '}
              <button
                type="button"
                onClick={() => { onClose(); navigate('/login') }}
                className="text-brand font-semibold hover:underline"
              >
                sign in
              </button>{' '}
              to book
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
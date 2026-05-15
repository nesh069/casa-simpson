import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFirestore } from '../hooks/useFirestore'
import { formatCurrency, generateBookingRef } from '../utils/helpers'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function BookingModal({ room, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 0

  const total = nights * room.price

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (nights < 1) { toast.error('Please select valid dates'); return }

    setLoading(true)
    try {
      const { addDocument } = useFirestoreDoc()
      await addDocument({
        roomId: room.id,
        roomName: room.name,
        userId: user.uid,
        userEmail: user.email,
        checkIn,
        checkOut,
        guests,
        nights,
        total,
        ref: generateBookingRef(),
        status: 'confirmed',
      })
      toast.success('Booking confirmed! Check your email.')
      onClose()
    } catch (err) {
      toast.error('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Book {room.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleBooking} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                required
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {nights > 0 && (
            <div className="bg-stone-50 rounded-xl p-4 text-sm space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>{formatCurrency(room.price)} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}
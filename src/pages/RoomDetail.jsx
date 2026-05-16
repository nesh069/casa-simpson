import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { formatCurrency, getNights, generateBookingRef } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../hooks/useFirestore'
import PaymentModal from '../components/PaymentModal'
import toast from 'react-hot-toast'
import { FiCheck, FiArrowLeft } from 'react-icons/fi'

export default function RoomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addDocument } = useCollection('bookings')

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const snap = await getDoc(doc(db, 'rooms', id))
        if (snap.exists()) {
          setRoom({ id: snap.id, ...snap.data() })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ff4757] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-6xl mb-4">🏨</p>
          <p className="text-[#f1f2f6] text-xl font-semibold mb-2">Room not found</p>
          <button
            onClick={() => navigate('/rooms')}
            className="mt-4 text-[#ff4757] hover:underline"
          >
            ← Back to Rooms
          </button>
        </div>
      </div>
    )
  }

  const nights = getNights(checkIn, checkOut)
  const total = nights * room.price

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please sign in to book a room')
      navigate('/login', { state: { from: { pathname: `/rooms/${id}` } } })
      return
    }
    if (!checkIn) { toast.error('Please select a check-in date'); return }
    if (!checkOut) { toast.error('Please select a check-out date'); return }
    if (nights < 1) { toast.error('Check-out must be after check-in'); return }
    setShowPayment(true)
  }

  const handlePaymentSuccess = async () => {
  const bookingData = {
    roomId: room.id,
    roomName: room.name,
    roomImage: room.image,
    userId: user.uid,
    userEmail: user.email,
    checkIn,
    checkOut,
    guests,
    nights,
    total,
    ref: generateBookingRef(),
    status: 'confirmed',
  }
  await addDocument(bookingData)
  navigate('/booking-confirmation', { state: { booking: bookingData } })
}

  const typeColor = {
    single: 'bg-[#ff4757]/20 text-[#ff4757]',
    double: 'bg-[#ffa502]/20 text-[#ffa502]',
    suite: 'bg-[#f7c948]/20 text-[#f7c948]',
  }

  return (
    <div className="bg-[#0d0d1a] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate('/rooms')}
          className="flex items-center gap-2 text-[#a4b0be] hover:text-[#f1f2f6] mb-6 transition-colors"
        >
          <FiArrowLeft size={18} /> Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a]/60 to-transparent" />
            </div>

            <div className="mt-6">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${typeColor[room.type] || typeColor.single}`}>
                {room.type}
              </span>
              <h1 className="text-3xl font-bold font-['Poppins'] text-[#f1f2f6] mt-3 mb-3">
                {room.name}
              </h1>
              <p className="text-[#a4b0be] leading-relaxed mb-6">{room.description}</p>

              <h3 className="font-semibold text-[#f1f2f6] mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {(room.amenities || []).map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-[#a4b0be] bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg px-3 py-2">
                    <FiCheck className="text-[#2ed573] shrink-0" size={14} />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 h-fit sticky top-24">
            <div className="flex items-baseline gap-2 mb-6 pb-4 border-b border-[#2a2a3e]">
              <span className="text-3xl font-bold text-[#f1f2f6]">{formatCurrency(room.price)}</span>
              <span className="text-[#a4b0be]">/ night</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#a4b0be] mb-1">Check In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#12122a] border border-[#2a2a3e] rounded-xl px-3 py-2 text-sm text-[#f1f2f6] focus:outline-none focus:border-[#ff4757] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a4b0be] mb-1">Check Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#12122a] border border-[#2a2a3e] rounded-xl px-3 py-2 text-sm text-[#f1f2f6] focus:outline-none focus:border-[#ff4757] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a4b0be] mb-1">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-[#12122a] border border-[#2a2a3e] rounded-xl px-3 py-2 text-sm text-[#f1f2f6] focus:outline-none focus:border-[#ff4757] transition-colors"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {nights > 0 && (
              <div className="bg-[#12122a] border border-[#2a2a3e] rounded-xl p-4 mb-6 text-sm space-y-2">
                <div className="flex justify-between text-[#a4b0be]">
                  <span>{formatCurrency(room.price)} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-[#2a2a3e] pt-2">
                  <span className="text-[#f1f2f6]">Total</span>
                  <span className="text-[#ffa502]">{formatCurrency(total)}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleBookNow}
              disabled={!room.available}
              className="w-full bg-[#ff4757] hover:bg-[#ff6b81] disabled:bg-[#2a2a3e] disabled:text-[#a4b0be] disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
            >
              {room.available ? 'Book Now' : 'Not Available'}
            </button>

            {!user && room.available && (
              <p className="text-center text-xs text-[#a4b0be] mt-3">
                You need to{' '}
                <button onClick={() => navigate('/login')} className="text-[#ff4757] hover:underline font-semibold">
                  sign in
                </button>{' '}
                to book
              </p>
            )}
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={total}
          orderType="room"
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
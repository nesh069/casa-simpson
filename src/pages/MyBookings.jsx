import { useCollection } from '../hooks/useFirestore'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../utils/helpers'
import { FiCalendar, FiUsers, FiTag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { where, query, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useState, useEffect } from 'react'
import { onSnapshot, orderBy } from 'firebase/firestore'

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q,
      (snap) => {
        setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [user])

  const statusColor = {
    confirmed: 'bg-[#2ed573]/20 text-[#2ed573] border-[#2ed573]/30',
    pending: 'bg-[#ffa502]/20 text-[#ffa502] border-[#ffa502]/30',
    cancelled: 'bg-[#ff4757]/20 text-[#ff4757] border-[#ff4757]/30',
  }

  return (
    <div className="bg-[#0d0d1a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
            My Bookings
          </h1>
          <p className="text-[#a4b0be]">
            {user?.displayName || user?.email}'s reservations
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-[#1a1a2e] rounded-2xl h-36 animate-pulse border border-[#2a2a3e]"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🏨</p>
            <p className="text-xl font-semibold text-[#f1f2f6] mb-2">
              No bookings yet
            </p>
            <p className="text-[#a4b0be] mb-8">
              You haven't made any reservations yet.
            </p>
            <Link
              to="/rooms"
              className="bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
            >
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#ff4757]/30 rounded-2xl p-6 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-[#f1f2f6]">
                        {booking.roomName}
                      </h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColor[booking.status] || statusColor.confirmed}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[#a4b0be]">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar size={14} className="text-[#ff4757]" />
                        {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiUsers size={14} className="text-[#ff4757]" />
                        {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiTag size={14} className="text-[#ff4757]" />
                        <span className="font-mono text-[#ff4757]">{booking.ref}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-[#ffa502]">
                      {formatCurrency(booking.total)}
                    </p>
                    <p className="text-xs text-[#a4b0be]">
                      {booking.nights} night{booking.nights > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
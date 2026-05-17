import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { formatCurrency, formatKES, formatDate } from '../utils/helpers'
import { FiCalendar, FiUsers, FiTag } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function MyBookings() {
  const { user } = useAuth()
  const { myBookings: bookings, loading } = useBooking()

  const statusColor = {
    confirmed: 'bg-[#2ed573]/20 text-[#2ed573] border-[#2ed573]/30',
    pending: 'bg-[#ffa502]/20 text-[#ffa502] border-[#ffa502]/30',
    cancelled: 'bg-[#ff4757]/20 text-[#ff4757] border-[#ff4757]/30',
  }

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-text mb-2">My Bookings</h1>
          <p className="text-muted">{user?.displayName || user?.email}'s reservations</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-card rounded-2xl h-36 animate-pulse border border-border" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🏨</p>
            <p className="text-xl font-semibold text-text mb-2">No bookings yet</p>
            <p className="text-muted mb-8">You haven't made any reservations yet.</p>
            <Link
              to="/rooms"
              className="bg-brand hover:bg-brand-hover text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
            >
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-card border border-border hover:border-brand/30 rounded-2xl p-6 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-text">{booking.roomName}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColor[booking.status] || statusColor.confirmed}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar size={14} className="text-brand" />
                        {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiUsers size={14} className="text-brand" />
                        {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiTag size={14} className="text-brand" />
                        <span className="font-mono text-brand">{booking.ref}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-accent">{formatCurrency(booking.totalPrice || booking.total)}</p>
                    <p className="text-sm text-muted">{formatKES(booking.totalPrice || booking.total)}</p>
                    <p className="text-xs text-muted">{booking.nights} night{booking.nights > 1 ? 's' : ''}</p>
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

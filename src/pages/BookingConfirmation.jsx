import { useLocation, useNavigate, Link } from 'react-router-dom'
import { formatCurrency, formatKES, formatDate } from '../utils/helpers'
import { FiCheck, FiCalendar, FiUsers, FiHome } from 'react-icons/fi'

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state?.booking

  if (!booking) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center text-center px-4">
        <div>
          <p className="text-6xl mb-4">🏨</p>
          <p className="text-text text-xl font-semibold mb-2">No booking found</p>
          <Link to="/rooms" className="text-brand hover:underline">Browse our rooms</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/20 border-2 border-success rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(46,213,115,0.3)]">
            <FiCheck size={36} className="text-success" />
          </div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-text mb-2">Booking Confirmed!</h1>
          <p className="text-muted">Your stay has been successfully booked.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          {booking.roomImage && (
            <img src={booking.roomImage} alt={booking.roomName} className="w-full h-40 object-cover" />
          )}

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3">
              <span className="text-muted text-sm">Booking Reference</span>
              <span className="text-brand font-bold font-mono tracking-wider">{booking.ref}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand/20 rounded-full flex items-center justify-center shrink-0">
                <FiHome size={16} className="text-brand" />
              </div>
              <div>
                <p className="text-xs text-muted">Room</p>
                <p className="text-text font-semibold">{booking.roomName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                <FiCalendar size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted">Dates</p>
                <p className="text-text font-semibold">
                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                </p>
                <p className="text-muted text-xs">{booking.nights} night{booking.nights > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-success/20 rounded-full flex items-center justify-center shrink-0">
                <FiUsers size={16} className="text-success" />
              </div>
              <div>
                <p className="text-xs text-muted">Guests</p>
                <p className="text-text font-semibold">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="text-muted font-semibold">Total Paid</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-accent">{formatCurrency(booking.totalPrice || booking.total)}</p>
                <p className="text-xs text-muted">{formatKES(booking.totalPrice || booking.total)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-success/10 border border-success/30 rounded-xl px-4 py-3 mb-6">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-success text-sm font-semibold">Booking status: Confirmed</span>
        </div>

        <div className="space-y-3">
          <Link
            to="/bookings"
            className="block w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl text-center transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="block w-full bg-card border border-border hover:border-brand/40 text-text font-semibold py-3 rounded-xl text-center transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

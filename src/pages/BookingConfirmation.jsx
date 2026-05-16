import { useLocation, useNavigate, Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../utils/helpers'
import { FiCheck, FiCalendar, FiUsers, FiHome } from 'react-icons/fi'

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state?.booking

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-6xl mb-4">🏨</p>
          <p className="text-[#f1f2f6] text-xl font-semibold mb-2">
            No booking found
          </p>
          <Link to="/rooms" className="text-[#ff4757] hover:underline">
            Browse our rooms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#2ed573]/20 border-2 border-[#2ed573] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(46,213,115,0.3)]">
            <FiCheck size={36} className="text-[#2ed573]" />
          </div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-[#a4b0be]">
            Your stay has been successfully booked.
          </p>
        </div>

        {/* Booking details card */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl overflow-hidden mb-6">
          {/* Room image */}
          {booking.roomImage && (
            <img
              src={booking.roomImage}
              alt={booking.roomName}
              className="w-full h-40 object-cover"
            />
          )}

          <div className="p-6 space-y-4">
            {/* Booking ref */}
            <div className="flex items-center justify-between bg-[#12122a] border border-[#2a2a3e] rounded-xl px-4 py-3">
              <span className="text-[#a4b0be] text-sm">Booking Reference</span>
              <span className="text-[#ff4757] font-bold font-mono tracking-wider">
                {booking.ref}
              </span>
            </div>

            {/* Room name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ff4757]/20 rounded-full flex items-center justify-center shrink-0">
                <FiHome size={16} className="text-[#ff4757]" />
              </div>
              <div>
                <p className="text-xs text-[#a4b0be]">Room</p>
                <p className="text-[#f1f2f6] font-semibold">{booking.roomName}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ffa502]/20 rounded-full flex items-center justify-center shrink-0">
                <FiCalendar size={16} className="text-[#ffa502]" />
              </div>
              <div>
                <p className="text-xs text-[#a4b0be]">Dates</p>
                <p className="text-[#f1f2f6] font-semibold">
                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                </p>
                <p className="text-[#a4b0be] text-xs">
                  {booking.nights} night{booking.nights > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2ed573]/20 rounded-full flex items-center justify-center shrink-0">
                <FiUsers size={16} className="text-[#2ed573]" />
              </div>
              <div>
                <p className="text-xs text-[#a4b0be]">Guests</p>
                <p className="text-[#f1f2f6] font-semibold">
                  {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-[#2a2a3e] pt-4 flex justify-between items-center">
              <span className="text-[#a4b0be] font-semibold">Total Paid</span>
              <span className="text-2xl font-bold text-[#ffa502]">
                {formatCurrency(booking.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-center gap-2 bg-[#2ed573]/10 border border-[#2ed573]/30 rounded-xl px-4 py-3 mb-6">
          <span className="w-2 h-2 bg-[#2ed573] rounded-full animate-pulse" />
          <span className="text-[#2ed573] text-sm font-semibold">
            Booking status: Confirmed
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/bookings"
            className="block w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-bold py-3 rounded-xl text-center transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="block w-full bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#ff4757]/40 text-[#f1f2f6] font-semibold py-3 rounded-xl text-center transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
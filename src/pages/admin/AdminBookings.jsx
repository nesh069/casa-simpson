import { useState } from 'react'
import { useCollection } from '../../hooks/useFirestore'
import { formatCurrency, formatKES, formatDate } from '../../utils/helpers'
import { FiCalendar, FiUsers, FiTag, FiSearch } from 'react-icons/fi'

const statusColor = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/30',
  pending: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function AdminBookings() {
  const { data: bookings, loading } = useCollection('bookings', { ordered: false })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || 
      b.roomName?.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.ref?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const statuses = ['all', 'confirmed', 'pending', 'cancelled']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Poppins'] text-text mb-2">Bookings</h1>
        <p className="text-muted">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by room, email, or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand"
          />
        </div>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'bg-brand text-white'
                  : 'bg-card text-muted hover:text-text border border-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings list */}
      <div className="space-y-3">
        {filtered.map((booking) => (
          <div key={booking.id} className="bg-card border border-border rounded-2xl p-5 hover:border-brand/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-text">{booking.roomName || 'Unknown Room'}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${statusColor[booking.status] || statusColor.confirmed}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={14} className="text-brand" />
                    {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiUsers size={14} className="text-brand" />
                    {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiTag size={14} className="text-brand" />
                    <span className="font-mono text-xs">{booking.ref || booking.id?.slice(0, 8)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted">{booking.userEmail}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-accent">{formatCurrency(booking.totalPrice || booking.total || 0)}</p>
                <p className="text-xs text-muted">{formatKES(booking.totalPrice || booking.total || 0)}</p>
                <p className="text-xs text-muted">{booking.nights || '-'} night{booking.nights !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏨</p>
          <p className="text-muted">No bookings found</p>
        </div>
      )}
    </div>
  )
}

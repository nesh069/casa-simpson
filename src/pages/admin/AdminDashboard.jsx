import { useCollection } from '../../hooks/useFirestore'
import { FiHome, FiShoppingBag, FiStar, FiTool, FiUsers, FiDollarSign } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link
      to={to}
      className="bg-card border border-border hover:border-brand/30 rounded-2xl p-6 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{value}</p>
          <p className="text-sm text-muted">{label}</p>
        </div>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const { data: rooms } = useCollection('rooms', { ordered: false })
  const { data: bookings } = useCollection('bookings', { ordered: false })
  const { data: orders } = useCollection('orders', { ordered: false })
  const { data: reviews } = useCollection('reviews', { ordered: false })

  const stats = [
    {
      icon: FiHome,
      label: 'Total Rooms',
      value: rooms.length,
      color: 'bg-blue-500/10 text-blue-400',
      to: '/admin/rooms',
    },
    {
      icon: FiShoppingBag,
      label: 'Total Bookings',
      value: bookings.length,
      color: 'bg-green-500/10 text-green-400',
      to: '/admin/bookings',
    },
    {
      icon: FiTool,
      label: 'Food Orders',
      value: orders.length,
      color: 'bg-orange-500/10 text-orange-400',
      to: '/admin/orders',
    },
    {
      icon: FiStar,
      label: 'Reviews',
      value: reviews.length,
      color: 'bg-purple-500/10 text-purple-400',
      to: '/admin/reviews',
    },
  ]

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed')
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || b.total || 0), 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Poppins'] text-text mb-2">Dashboard</h1>
        <p className="text-muted">Overview of your Casa Simpson operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-4">Revenue Overview</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted">
                from {confirmedBookings.length} confirmed booking{confirmedBookings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/rooms"
              className="bg-surface border border-border hover:border-brand/30 rounded-xl p-4 text-center transition-all"
            >
              <FiHome size={20} className="mx-auto mb-2 text-brand" />
              <p className="text-sm text-text font-medium">Manage Rooms</p>
            </Link>
            <Link
              to="/admin/menu"
              className="bg-surface border border-border hover:border-brand/30 rounded-xl p-4 text-center transition-all"
            >
              <FiStar size={20} className="mx-auto mb-2 text-brand" />
              <p className="text-sm text-text font-medium">Manage Menu</p>
            </Link>
            <Link
              to="/admin/bookings"
              className="bg-surface border border-border hover:border-brand/30 rounded-xl p-4 text-center transition-all"
            >
              <FiShoppingBag size={20} className="mx-auto mb-2 text-brand" />
              <p className="text-sm text-text font-medium">View Bookings</p>
            </Link>
            <Link
              to="/admin/orders"
              className="bg-surface border border-border hover:border-brand/30 rounded-xl p-4 text-center transition-all"
            >
              <FiTool size={20} className="mx-auto mb-2 text-brand" />
              <p className="text-sm text-text font-medium">View Orders</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

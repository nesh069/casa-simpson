import { useCollection } from '../../hooks/useFirestore'
import { formatCurrency, formatKES } from '../../utils/helpers'
import { FiClock, FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi'
import { useState } from 'react'

const statusIcon = {
  paid: FiCheckCircle,
  pending: FiClock,
  failed: FiXCircle,
}

const statusColor = {
  paid: 'text-green-400',
  pending: 'text-orange-400',
  failed: 'text-red-400',
}

export default function AdminOrders() {
  const { data: orders, loading } = useCollection('orders', { ordered: false })
  const [search, setSearch] = useState('')

  const filtered = orders.filter((o) =>
    !search ||
    o.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    o.transactionId?.toString().includes(search) ||
    o.status?.toLowerCase().includes(search.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold font-['Poppins'] text-text mb-2">Food Orders</h1>
        <p className="text-muted">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search by email, transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand"
        />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const StatusIcon = statusIcon[order.status] || FiClock
          const sColor = statusColor[order.status] || 'text-muted'

          return (
            <div key={order.id} className="bg-card border border-border rounded-2xl p-5 hover:border-brand/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text">Order #{order.txRef || order.id?.slice(0, 8)}</h3>
                    <StatusIcon size={16} className={sColor} />
                    <span className={`text-xs font-medium capitalize ${sColor}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-muted">{order.userEmail}</p>
                  {order.items && order.items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {order.items.map((item) => (
                        <span key={item.id} className="text-xs bg-surface text-muted px-2 py-0.5 rounded-full">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                  {order.transactionId && (
                    <p className="text-xs text-muted font-mono">TX: {order.transactionId}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-accent">{formatCurrency(order.amount || 0)}</p>
                  <p className="text-xs text-muted">{formatKES(order.amount || 0)}</p>
                  <p className="text-xs text-muted capitalize mt-1">{order.orderType} order</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-muted">No orders found</p>
        </div>
      )}
    </div>
  )
}

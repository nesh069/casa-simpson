import { useState, useMemo } from 'react'
import { menuItems } from '../data/menu'
import MenuCard from '../components/MenuCard'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/helpers'
import PaymentModal from '../components/PaymentModal'
import { FiShoppingBag } from 'react-icons/fi'

const CATEGORIES = ['all', 'starters', 'mains', 'desserts', 'drinks']

export default function Restaurant() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showPayment, setShowPayment] = useState(false)
  const { cartTotal, cartCount } = useCart()

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory),
    [activeCategory]
  )

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-text mb-2">
            Restaurant & Bar
          </h1>
          <p className="text-muted">
            Fine dining and craft drinks, crafted with care
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-brand text-white shadow-[0_0_12px_rgba(255,71,87,0.4)]'
                  : 'bg-card text-muted border border-border hover:border-brand/40 hover:text-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-sm">
          <button
            onClick={() => setShowPayment(true)}
            className="w-full flex items-center justify-between bg-brand hover:bg-brand-hover text-white font-semibold px-5 py-4 rounded-2xl shadow-[0_0_30px_rgba(255,71,87,0.4)] transition-all"
          >
            <div className="flex items-center gap-2">
              <FiShoppingBag size={20} />
              <span>
                {cartCount} item{cartCount > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatCurrency(cartTotal)}</span>
              <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-xl">
                Pay Now →
              </span>
            </div>
          </button>
        </div>
      )}

      {showPayment && (
        <PaymentModal
          amount={cartTotal}
          orderType="food"
          onClose={() => setShowPayment(false)}
          onSuccess={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
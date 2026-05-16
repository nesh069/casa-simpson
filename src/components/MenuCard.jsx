import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const USD_TO_KES = 129.50

const formatUSD = (amount) => `$${Number(amount).toFixed(2)}`
const formatKES = (amount) =>
  `KES ${Math.round(amount * USD_TO_KES).toLocaleString('en-KE')}`

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'

export default function MenuCard({ item }) {
  const { addToCart } = useCart()

  const handleAdd = () => {
    addToCart(item)
    toast.success(`${item.name} added to order`)
  }

  return (
    <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden border border-[#2a2a3e] hover:border-[#ff4757]/40 hover:shadow-[0_0_20px_rgba(255,71,87,0.1)] transition-all duration-300 flex flex-col group">
      <div className="overflow-hidden bg-[#12122a] h-44">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            if (e.target.src !== FALLBACK_IMAGE) {
              e.target.src = FALLBACK_IMAGE
            }
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1 gap-2">
          <h3 className="font-bold text-[#f1f2f6]">{item.name}</h3>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[#ffa502] font-bold whitespace-nowrap">
              {formatUSD(item.price)}
            </span>
            <span className="text-[#a4b0be] text-xs whitespace-nowrap">
              {formatKES(item.price)}
            </span>
          </div>
        </div>

        <p className="text-[#a4b0be] text-sm flex-1 mb-4 leading-relaxed">
          {item.description}
        </p>

        <button
          onClick={handleAdd}
          className="w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,71,87,0.4)]"
        >
          Add to Order
        </button>
      </div>
    </div>
  )
}
import { formatCurrency } from '../utils/helpers'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function MenuCard({ item }) {
  const { addToCart } = useCart()

  const handleAdd = () => {
    addToCart(item)
    toast.success(`${item.name} added to order`)
  }

  return (
    <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden border border-[#2a2a3e] hover:border-[#ff4757]/40 hover:shadow-[0_0_20px_rgba(255,71,87,0.1)] transition-all duration-300 flex flex-col group">
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1 gap-2">
          <h3 className="font-bold text-[#f1f2f6]">{item.name}</h3>
          <span className="text-[#ffa502] font-bold whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
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
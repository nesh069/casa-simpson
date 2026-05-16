import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const USD_TO_KES = 129.50 // update this rate as needed

const formatUSD = (amount) =>
  `$${Number(amount).toFixed(2)}`

const formatKES = (amount) =>
  `KES ${Math.round(amount * USD_TO_KES).toLocaleString('en-KE')}`

export default function MenuCard({ item }) {
  const { addToCart } = useCart()

  const handleAdd = () => {
    addToCart(item)
    toast.success(`${item.name} added to order`)
  }

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-brand/40 hover:shadow-[0_0_20px_rgba(255,71,87,0.1)] transition-all duration-300 flex flex-col group">
      <div className="overflow-hidden bg-zinc-800 h-44">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-44 flex items-center justify-center text-muted text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1 gap-2">
          <h3 className="font-bold text-text">{item.name}</h3>
          <div className="flex flex-col items-end">
            <span className="text-accent font-bold whitespace-nowrap">
              {formatUSD(item.price)}
            </span>
            <span className="text-muted text-xs whitespace-nowrap">
              {formatKES(item.price)}
            </span>
          </div>
        </div>
        <p className="text-muted text-sm flex-1 mb-4 leading-relaxed">
          {item.description}
        </p>
        <button
          onClick={handleAdd}
          className="w-full bg-brand hover:bg-brand-hover text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,71,87,0.4)]"
        >
          Add to Order
        </button>
      </div>
    </div>
  )
}
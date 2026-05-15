import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/helpers'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ open, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()
  const navigate = useNavigate()

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#1a1a2e] border-l border-[#2a2a3e] z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a3e]">
          <div className="flex items-center gap-2">
            <FiShoppingCart size={20} className="text-[#ff4757]" />
            <h2 className="text-lg font-bold text-[#f1f2f6]">
              Your Order
              {cartCount > 0 && (
                <span className="ml-2 text-sm font-normal text-[#a4b0be]">
                  ({cartCount} item{cartCount > 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#12122a] rounded-full text-[#a4b0be] hover:text-[#f1f2f6] transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-[#a4b0be]">
              <p className="text-5xl mb-4">🛒</p>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1 text-[#a4b0be]/60">
                Add items from the menu
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 items-center bg-[#12122a] rounded-xl p-3 border border-[#2a2a3e]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#f1f2f6] text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-[#ffa502] font-bold text-sm">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-[#2a2a3e] hover:bg-[#ff4757] text-[#f1f2f6] flex items-center justify-center transition-colors"
                    >
                      <FiMinus size={11} />
                    </button>
                    <span className="text-sm font-bold text-[#f1f2f6] w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-[#2a2a3e] hover:bg-[#ff4757] text-[#f1f2f6] flex items-center justify-center transition-colors"
                    >
                      <FiPlus size={11} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-[#ff4757]/20 hover:text-[#ff4757] text-[#a4b0be] rounded-full transition-colors"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#2a2a3e]">
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-[#a4b0be]">Total</span>
              <span className="font-bold text-xl text-[#f1f2f6]">
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <button
              onClick={() => { onClose(); navigate('/delivery') }}
              className="w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
            >
              Proceed to Delivery
            </button>
          </div>
        )}
      </div>
    </>
  )
}
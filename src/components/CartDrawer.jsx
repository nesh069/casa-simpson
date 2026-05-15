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
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <FiShoppingCart size={20} className="text-brand" />
            <h2 className="text-lg font-bold text-text">
              Your Order
              {cartCount > 0 && (
                <span className="ml-2 text-sm font-normal text-muted">
                  ({cartCount} item{cartCount > 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-full text-muted hover:text-text transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <p className="text-5xl mb-4">🛒</p>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1 text-muted/60">
                Add items from the menu
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 items-center bg-surface rounded-xl p-3 border border-border"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-accent font-bold text-sm">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-border hover:bg-brand text-text flex items-center justify-center transition-colors"
                    >
                      <FiMinus size={11} />
                    </button>
                    <span className="text-sm font-bold text-text w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-border hover:bg-brand text-text flex items-center justify-center transition-colors"
                    >
                      <FiPlus size={11} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-brand/20 hover:text-brand text-muted rounded-full transition-colors"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-border">
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-muted">Total</span>
              <span className="font-bold text-xl text-text">
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <button
              onClick={() => { onClose(); navigate('/delivery') }}
              className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
            >
              Proceed to Delivery
            </button>
          </div>
        )}
      </div>
    </>
  )
}
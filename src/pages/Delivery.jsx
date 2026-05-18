import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import PaymentModal from '../components/PaymentModal'
import { FiPhone, FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import { formatCurrency, formatKES } from '../utils/helpers'

export default function Delivery() {
  const { user } = useAuth()
  const { cartItems, cartTotal, cartCount, clearCart } = useCart()
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleOrderSuccess = () => {
    setShowPayment(false)
    setOrderPlaced(true)
    clearCart()
    toast.success('Order placed successfully!')
  }

  const handlePlaceOrder = () => {
    if (!user) { toast.error('Please sign in to place an order'); return }
    if (!phone.trim()) { toast.error('Please enter your phone number'); return }
    const clean = phone.replace(/\s/g, '')
    const valid = /^(07\d{8}|\+254\d{9})$/.test(clean)
    if (!valid) { toast.error('Use format: 0712345678 or +254712345678'); return }
    if (cartCount === 0) { toast.error('Please add items from the menu first'); return }
    setShowPayment(true)
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#f1f2f6] pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
            Food Delivery
          </h1>
          <p className="text-[#a4b0be]">
            Order from home and we'll bring your favourite dishes right to your door
          </p>
        </div>

        {/* Order Confirmed View */}
        {orderPlaced ? (
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold font-['Poppins'] mb-2">
              Order Confirmed!
            </h2>
            <p className="text-[#a4b0be] mb-1">
              We'll call you at:{' '}
              <span className="text-[#f1f2f6] font-semibold">{phone}</span>
            </p>
            <p className="text-[#a4b0be] text-sm mb-8">
              Our driver will contact you to confirm.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Empty cart notice */}
            {cartCount === 0 && (
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 text-center">
                <p className="text-4xl mb-3">🛒</p>
                <h3 className="text-lg font-semibold text-[#f1f2f6] mb-2">
                  Your cart is empty
                </h3>
                <p className="text-[#a4b0be] text-sm mb-5">
                  Add items from the restaurant menu before placing a delivery order.
                </p>
                <button
                  onClick={() => navigate('/restaurant')}
                  className="bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  Browse Menu
                </button>
              </div>
            )}

            {/* Phone number input */}
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#f1f2f6] mb-4">
                📱 Contact Details
              </h2>
              <label className="block text-sm font-medium text-[#a4b0be] mb-2">
                <FiPhone className="inline mr-1 text-[#ff4757]" size={14} />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 712 345 678"
                className="w-full bg-[#12122a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-sm text-[#f1f2f6] placeholder-[#a4b0be] focus:outline-none focus:border-[#ff4757] transition-colors"
              />
              <p className="text-xs text-[#a4b0be] mt-2">
                Our driver will call you to confirm your delivery location
              </p>
            </div>

            {/* Order summary */}
            {cartCount > 0 && (
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiShoppingCart size={18} className="text-[#ff4757]" />
                  <h2 className="text-lg font-bold text-[#f1f2f6]">
                    Order Summary ({cartCount} item{cartCount > 1 ? 's' : ''})
                  </h2>
                </div>

                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-[#2a2a3e] last:border-0"
                    >
                      <div>
                        <p className="text-[#f1f2f6] text-sm font-medium">{item.name}</p>
                        <p className="text-[#a4b0be] text-xs">× {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#f1f2f6] text-sm font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <p className="text-[#a4b0be] text-xs">
                          {formatKES(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#12122a] border border-[#2a2a3e] rounded-xl p-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#f1f2f6]">Total</span>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#ffa502]">
                        {formatCurrency(cartTotal)}
                      </p>
                      <p className="text-xs text-[#a4b0be]">{formatKES(cartTotal)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)] text-lg"
                >
                  Place Order — {formatCurrency(cartTotal)}
                  <span className="block text-xs font-normal opacity-80 mt-0.5">
                    {formatKES(cartTotal)}
                  </span>
                </button>

                <button
                  onClick={() => navigate('/restaurant')}
                  className="w-full mt-3 text-[#a4b0be] hover:text-[#f1f2f6] text-sm py-2 transition-colors flex items-center justify-center gap-1"
                >
                  <FiArrowLeft size={14} />
                  Add more items
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          amount={cartTotal}
          orderType="food"
          onClose={() => setShowPayment(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  )
}
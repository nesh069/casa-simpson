import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCollection } from '../hooks/useFirestore'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import PaymentModal from '../components/PaymentModal'
import { FiPhone, FiShoppingCart } from 'react-icons/fi'
import { formatCurrency } from '../utils/helpers'

export default function Delivery() {
  const { user } = useAuth()
  const { cartItems, cartTotal, cartCount, clearCart, loading: cartLoading } = useCart()
  const { data: menuItems, loading: menuLoading, error } = useCollection('menu', { ordered: false })

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
    if (!user) {
      toast.error('Please sign in to place an order')
      return
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      toast.error('Please enter a valid phone number (at least 10 digits)')
      return
    }
    if (cartCount === 0) {
      toast.error('Please add items to your cart first')
      return
    }
    setShowPayment(true)
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#f1f2f6] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
            Food Delivery
          </h1>
          <p className="text-[#a4b0be] text-lg">
            Order from our menu and get it delivered to you
          </p>
        </div>

        {/* Order Confirmed View */}
        {orderPlaced ? (
          <div className="max-w-lg mx-auto">
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-10 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold font-['Poppins'] mb-2">
                Order Confirmed!
              </h2>
              <p className="text-[#a4b0be] mb-1">
                We'll call you at:{' '}
                <span className="text-[#f1f2f6] font-semibold">{phone}</span>
              </p>
              <p className="text-[#a4b0be] text-sm mb-6">
                Our driver will contact you to confirm your location.
              </p>
              <p className="text-[#a4b0be] text-sm">
                Estimated delivery time: 30–45 minutes
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Menu Items */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-[#f1f2f6]">
                Choose Your Items
              </h2>

              {error && (
                <div className="bg-[#ff4757]/10 border border-[#ff4757]/20 rounded-xl p-4 mb-6">
                  <p className="text-[#ff4757] text-sm">
                    Failed to load menu. Please refresh the page.
                  </p>
                </div>
              )}

              {menuLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="bg-[#1a1a2e] rounded-2xl h-72 animate-pulse border border-[#2a2a3e]"
                    />
                  ))}
                </div>
              ) : menuItems.length === 0 ? (
                <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-10 text-center">
                  <p className="text-4xl mb-3">🍽️</p>
                  <h3 className="text-lg font-semibold text-[#f1f2f6] mb-2">
                    Menu is currently unavailable
                  </h3>
                  <p className="text-[#a4b0be] text-sm">
                    Please check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menuItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Details Panel */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#f1f2f6] mb-6">
                  Delivery Details
                </h2>

                {/* Phone input */}
                <div className="mb-6">
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
                    Our driver will call you to confirm your location
                  </p>
                </div>

                {/* Cart summary */}
                <div className="border-t border-[#2a2a3e] pt-5">
                  {cartLoading ? (
                    <div className="text-center py-8 text-[#a4b0be]">
                      <p className="text-sm">Loading your cart...</p>
                    </div>
                  ) : cartCount > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <FiShoppingCart size={16} className="text-[#ff4757]" />
                        <h3 className="font-semibold text-[#f1f2f6]">
                          Your Order ({cartCount} item{cartCount > 1 ? 's' : ''})
                        </h3>
                      </div>

                      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-[#a4b0be]">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-[#f1f2f6] font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t border-[#2a2a3e] pt-4 mb-5">
                        <span className="font-bold text-[#f1f2f6]">Total</span>
                        <span className="font-bold text-lg text-[#ffa502]">
                          {formatCurrency(cartTotal)}
                        </span>
                      </div>

                      <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                      >
                        Place Order — {formatCurrency(cartTotal)}
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-[#a4b0be]">
                      <p className="text-4xl mb-3">🛒</p>
                      <p className="text-sm">
                        Add items from the menu to place a delivery order
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          amount={cartTotal}
          orderType="food"
          deliveryAddress={phone}
          onClose={() => setShowPayment(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  )
}

function MenuCard({ item }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl overflow-hidden hover:border-[#ff4757]/40 hover:shadow-[0_0_20px_rgba(255,71,87,0.1)] transition-all duration-300 group flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' }}
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-[#f1f2f6]">{item.name}</h3>
          <span className="text-[#ffa502] font-bold whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
        </div>
        <p className="text-[#a4b0be] text-sm mb-4 flex-1 line-clamp-2">
          {item.description}
        </p>
        <button
          onClick={() => {
            addToCart(item)
            toast.success(`${item.name} added to order`)
          }}
          className="w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold py-2.5 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,71,87,0.3)]"
        >
          Add to Order
        </button>
      </div>
    </div>
  )
}
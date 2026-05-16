import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCollection } from '../hooks/useFirestore'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import PaymentModal from '../components/PaymentModal'

export default function Delivery() {
  const { user } = useAuth()
  const { cartItems, cartTotal, cartCount, clearCart } = useCart()
  const { data: menuItems, loading, error } = useCollection('menu', { ordered: false })

  const [address, setAddress] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [deliveryStep, setDeliveryStep] = useState(0)

  const handleOrderSuccess = () => {
    setShowPayment(false)
    setOrderPlaced(true)
    clearCart()

    const steps = [1, 2, 3, 4]
    steps.forEach((step, i) => {
      setTimeout(() => setDeliveryStep(step), (i + 1) * 3000)
    })

    toast.success('Order placed successfully!')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#f1f2f6] pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-3">
            Food Delivery
          </h1>
          <p className="text-[#a4b0be] text-lg">
            Order from our menu and get it delivered to you
          </p>
        </div>

        {orderPlaced ? (
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-10 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-[#a4b0be] mb-6">
              Delivering to: <span className="text-[#f1f2f6]">{address}</span>
            </p>
            <p className="text-[#ff4757] font-semibold">
              {deliveryStep < 4
                ? 'Your order is on its way...'
                : '🏠 Your order has been delivered!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold font-['Poppins'] mb-6">
                Choose Your Items
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                  <p className="text-red-400 text-sm">Failed to load menu: {error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-red-400 text-sm underline mt-2 hover:text-red-300"
                  >
                    Retry
                  </button>
                </div>
              )}

              {loading ? (
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
                  <p className="text-[#a4b0be] text-sm mb-4">
                    Our menu items are being prepared. Please check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menuItems.slice(0, 8).map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Details */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold font-['Poppins'] mb-6">
                  Delivery Details
                </h2>

                {/* Address Input - Simplified, no Google Maps dependency */}
                <div className="mb-6">
                  <label className="block text-sm text-[#a4b0be] mb-2">
                    📍 Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    rows={3}
                    className="w-full bg-[#12122a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-sm text-[#f1f2f6] placeholder-[#a4b0be] focus:outline-none focus:border-[#ff4757] transition-colors resize-none"
                  />
                  <p className="text-xs text-[#a4b0be] mt-2">
                    Include building name, floor, and any delivery instructions
                  </p>
                </div>

                {/* Cart Summary */}
                <div className="border-t border-[#2a2a3e] pt-6">
                  {cartCount > 0 ? (
                    <>
                      <h3 className="font-semibold mb-4">Your Order</h3>
                      <div className="space-y-3 mb-4">
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
                      <div className="flex justify-between items-center border-t border-[#2a2a3e] pt-4 mb-6">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-lg text-[#ff4757]">
                          {formatCurrency(cartTotal)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (!address.trim()) {
                            toast.error('Please enter a delivery address')
                            return
                          }
                          if (!user) {
                            toast.error('Please sign in to place an order')
                            return
                          }
                          setShowPayment(true)
                        }}
                        className="w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                      >
                        Place Order ({formatCurrency(cartTotal)})
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

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={cartTotal}
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
    <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl overflow-hidden hover:border-[#ff4757]/30 transition-all duration-300 group">
      <div className="h-48 overflow-hidden">
        <img
          src={item.image || '/casa-simpson/placeholder-food.jpg'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-[#f1f2f6]">{item.name}</h3>
          <span className="text-[#ff4757] font-bold">${item.price}</span>
        </div>
        <p className="text-[#a4b0be] text-sm mb-4 line-clamp-2">{item.description}</p>
        <button
          onClick={() => {
            addToCart(item)
            toast.success(`Added ${item.name} to cart`)
          }}
          className="w-full bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold py-2.5 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,71,87,0.3)]"
        >
          Add to Order
        </button>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useCollection } from '../hooks/useFirestore'
import MenuCard from '../components/MenuCard'
import DeliveryTracker from '../components/DeliveryTracker'
import PaymentModal from '../components/PaymentModal'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/helpers'
import { LoadScript, Autocomplete } from '@react-google-maps/api'
import { FiMapPin } from 'react-icons/fi'
import toast from 'react-hot-toast'

const LIBRARIES = ['places']

export default function Delivery() {
  const { data: menuItems, loading } = useCollection('menu', { ordered: false })
  const { cartItems, cartTotal, cartCount } = useCart()
  const [address, setAddress] = useState('')
  const [autocomplete, setAutocomplete] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [deliveryStep, setDeliveryStep] = useState(1)

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      setAddress(place.formatted_address || place.name)
    }
  }

  const handleOrderSuccess = () => {
    setOrderPlaced(true)
    setDeliveryStep(2)
    const interval = setInterval(() => {
      setDeliveryStep((prev) => {
        if (prev >= 4) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 3000)
  }

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address')
      return
    }
    if (cartCount === 0) {
      toast.error('Please add items to your cart first')
      return
    }
    setShowPayment(true)
  }

  return (
    <div className="bg-[#0d0d1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
            Food Delivery
          </h1>
          <p className="text-[#a4b0be]">Order from our menu and get it delivered to you</p>
        </div>

        {orderPlaced ? (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8">
              <p className="text-6xl mb-4">🎉</p>
              <h2 className="text-2xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
                Order Confirmed!
              </h2>
              <p className="text-[#a4b0be] mb-6">
                Delivering to:{' '}
                <span className="text-[#f1f2f6] font-medium">{address}</span>
              </p>
              <DeliveryTracker currentStep={deliveryStep} />
              <p className="text-sm text-[#a4b0be] mt-4">
                {deliveryStep < 4
                  ? 'Your order is on its way...'
                  : '🏠 Your order has been delivered!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-[#f1f2f6] mb-4">
                Choose Your Items
              </h2>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-[#1a1a2e] rounded-2xl h-64 animate-pulse border border-[#2a2a3e]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menuItems.slice(0, 8).map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#f1f2f6] mb-5">
                  Delivery Details
                </h2>

                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  libraries={LIBRARIES}
                >
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-[#a4b0be] mb-2">
                      <FiMapPin className="inline mr-1 text-[#ff4757]" size={14} />
                      Delivery Address
                    </label>
                    <Autocomplete
                      onLoad={(a) => setAutocomplete(a)}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="Enter your delivery address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#12122a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-sm text-[#f1f2f6] placeholder-[#a4b0be] focus:outline-none focus:border-[#ff4757] transition-colors"
                      />
                    </Autocomplete>
                  </div>
                </LoadScript>

                {cartCount > 0 ? (
                  <>
                    <div className="space-y-2 mb-5 text-sm max-h-40 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-[#a4b0be]">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#2a2a3e] pt-2 flex justify-between font-bold">
                        <span className="text-[#f1f2f6]">Total</span>
                        <span className="text-[#ffa502]">{formatCurrency(cartTotal)}</span>
                      </div>
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
                    <p className="text-3xl mb-2">🛒</p>
                    <p className="text-sm">Add items from the menu to place a delivery order</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          amount={cartTotal}
          orderType="food"
          deliveryAddress={address}
          onClose={() => setShowPayment(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  )
}
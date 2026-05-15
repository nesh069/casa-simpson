import { useState } from 'react'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCollection } from '../hooks/useFirestore'
import { formatCurrency, generateBookingRef } from '../utils/helpers'
import { FiX, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function PaymentModal({
  amount,
  onClose,
  onSuccess,
  orderType = 'food',
  deliveryAddress = '',
}) {
  const { user } = useAuth()
  const { clearCart, cartItems } = useCart()
  const { addDocument } = useCollection('orders')
  const [loading, setLoading] = useState(false)

  const config = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: generateBookingRef(),
    amount,
    currency: 'USD',
    payment_options: 'card',
    customer: {
      email: user?.email || 'guest@casasimpson.com',
      name: user?.displayName || 'Guest',
    },
    customizations: {
      title: 'Casa Simpson',
      description: orderType === 'food' ? 'Food & Drinks Order' : 'Room Booking',
      logo: '',
    },
  }

  const handleFlutterPayment = useFlutterwave(config)

  const handlePay = () => {
    setLoading(true)
    handleFlutterPayment({
      callback: async (response) => {
        closePaymentModal()
        if (response.status === 'successful') {
          await addDocument({
            userId: user?.uid,
            userEmail: user?.email,
            amount,
            orderType,
            deliveryAddress,
            items: cartItems,
            transactionId: response.transaction_id,
            status: 'paid',
          })
          clearCart()
          toast.success('Payment successful! 🎉')
          onSuccess && onSuccess(response)
          onClose()
        } else {
          toast.error('Payment was not completed.')
        }
        setLoading(false)
      },
      onClose: () => setLoading(false),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a3e]">
          <div className="flex items-center gap-2">
            <FiLock size={18} className="text-[#ff4757]" />
            <h2 className="text-lg font-bold text-[#f1f2f6]">Secure Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#12122a] rounded-full text-[#a4b0be] transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-[#12122a] border border-[#2a2a3e] rounded-xl p-4 text-center">
            <p className="text-[#a4b0be] text-sm mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-[#f1f2f6]">
              {formatCurrency(amount)}
            </p>
            <p className="text-xs text-[#a4b0be] mt-1 capitalize">{orderType} order</p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-[#a4b0be] text-sm">
              Powered by{' '}
              <span className="text-[#ffa502] font-semibold">Flutterwave</span>
            </p>
            <p className="text-xs text-[#a4b0be]/60">
              Test card: 5531886652142950 · Exp: 09/32 · CVV: 564
            </p>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-[#ff4757] hover:bg-[#ff6b81] disabled:bg-[#2a2a3e] disabled:text-[#a4b0be] disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
          >
            {loading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
          </button>

          <button
            onClick={onClose}
            className="w-full text-[#a4b0be] hover:text-[#f1f2f6] text-sm py-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
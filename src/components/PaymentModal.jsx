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
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <FiLock size={18} className="text-brand" />
            <h2 className="text-lg font-bold text-text">Secure Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-full text-muted transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <p className="text-muted text-sm mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-text">
              {formatCurrency(amount)}
            </p>
            <p className="text-xs text-muted mt-1 capitalize">{orderType} order</p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-muted text-sm">
              Powered by{' '}
              <span className="text-accent font-semibold">Flutterwave</span>
            </p>
            <p className="text-xs text-muted/60">
              Test card: 5531886652142950 · Exp: 09/32 · CVV: 564
            </p>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover disabled:bg-border disabled:text-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
          >
            {loading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
          </button>

          <button
            onClick={onClose}
            className="w-full text-muted hover:text-text text-sm py-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
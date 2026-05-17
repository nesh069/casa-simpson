import { useState, useMemo } from 'react'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCollection } from '../hooks/useFirestore'
import { formatCurrency, formatKES, generateBookingRef } from '../utils/helpers'
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

  // Generate a stable tx_ref for this modal instance
  const txRef = useMemo(() => generateBookingRef(), [])

  // Ensure customer always has valid values — never undefined
  const customerEmail = user?.email || `guest_${Date.now()}@casasimpson.com`
  const customerName = user?.displayName || user?.email?.split('@')[0] || 'Guest'

  const config = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: txRef,
    amount: Number(amount) || 1,
    currency: 'USD',
    payment_options: 'card',
    customer: {
      email: customerEmail,
      name: customerName,
      phone_number: deliveryAddress || '',
    },
    customizations: {
      title: 'Casa Simpson',
      description: orderType === 'food' ? 'Food & Drinks Order' : 'Room Booking',
      logo: '',
    },
  }

  const handleFlutterPayment = useFlutterwave(config)

  const handlePay = () => {
    if (!import.meta.env.VITE_FLW_PUBLIC_KEY) {
      toast.error('Payment not configured. Please try again later.')
      return
    }
    setLoading(true)
    try {
      handleFlutterPayment({
        callback: async (response) => {
          closePaymentModal()
          if (response.status === 'successful' || response.status === 'completed') {
            try {
              await addDocument({
                userId: user?.uid || 'guest',
                userEmail: customerEmail,
                amount,
                orderType,
                deliveryAddress,
                items: cartItems,
                transactionId: response.transaction_id,
                txRef,
                status: 'paid',
              })
              clearCart()
              toast.success('Payment successful! 🎉')
              onSuccess && onSuccess(response)
              onClose()
            } catch (err) {
              console.error('Order save error:', err)
              toast.success('Payment successful! 🎉')
              onSuccess && onSuccess(response)
              onClose()
            }
          } else {
            toast.error('Payment was not completed. Please try again.')
          }
          setLoading(false)
        },
        onClose: () => {
          setLoading(false)
        },
      })
    } catch (err) {
      console.error('Payment error:', err)
      toast.error('Payment failed to open. Please refresh and try again.')
      setLoading(false)
    }
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
            <p className="text-4xl font-bold text-text">{formatCurrency(amount)}</p>
            <p className="text-sm text-muted mt-1">{formatKES(amount)}</p>
            <p className="text-xs text-muted/60 mt-1 capitalize">{orderType} order</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-3 text-xs text-muted space-y-1">
            <p className="font-semibold text-text text-sm">Test Card Details</p>
            <p>Card: <span className="font-mono text-accent">5531886652142950</span></p>
            <p>Expiry: <span className="font-mono">09/32</span> · CVV: <span className="font-mono">564</span></p>
            <p>PIN: <span className="font-mono">3310</span> · OTP: <span className="font-mono">12345</span></p>
          </div>

          <div className="text-center">
            <p className="text-muted text-sm">
              Powered by <span className="text-accent font-semibold">Flutterwave</span>
            </p>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover disabled:bg-border disabled:text-muted disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
          >
            {loading ? 'Opening payment...' : `Pay ${formatCurrency(amount)}`}
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

import { useState } from 'react'

export default function Delivery() {
  const [address, setAddress] = useState('')
  const [cartItems] = useState([
    { id: 1, name: 'Bruschetta', price: 8, quantity: 1 },
    { id: 2, name: 'Soup of the Day', price: 7, quantity: 1 }
  ])
  const [showPayment, setShowPayment] = useState(false)

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div style={{ padding: '100px 20px 20px', maxWidth: '1200px', margin: '0 auto', color: '#f1f2f6' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Food Delivery</h1>
      <p style={{ color: '#a4b0be', marginBottom: '30px' }}>Order from our menu and get it delivered to you</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Menu Items */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Choose Your Items</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '15px' }}>
                <h3>{item.name}</h3>
                <p style={{ color: '#ff4757', fontWeight: 'bold' }}>${item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div style={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Delivery Details</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#a4b0be', marginBottom: '8px', fontSize: '0.9rem' }}>
              📍 Delivery Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              style={{
                width: '100%',
                background: '#12122a',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                padding: '10px',
                color: '#f1f2f6',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ borderTop: '1px solid #2a2a3e', paddingTop: '15px' }}>
            <h3 style={{ marginBottom: '10px' }}>Your Order</h3>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: '#a4b0be' }}>{item.name} × {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #2a2a3e', paddingTop: '10px', marginTop: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Total</span>
              <span style={{ color: '#ff4757', fontWeight: 'bold' }}>${cartTotal}</span>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              style={{
                width: '100%',
                background: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Place Order (${cartTotal})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

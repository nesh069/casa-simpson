import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Delivery from '../pages/Delivery'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('../context/AuthContext')
vi.mock('../context/CartContext')
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() }
}))

vi.mock('../components/PaymentModal', () => ({
  default: function PaymentModal({ onClose, onSuccess, amount }) {
    return (
      <div data-testid="payment-modal">
        <span data-testid="payment-amount">{amount}</span>
        <button onClick={onSuccess}>Confirm Payment</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    )
  }
}))

vi.mock('../utils/helpers', () => ({
  formatCurrency: (v) => `$${v}`,
  formatKES: (v) => `KES ${v}`
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

const mockClearCart = vi.fn()

function renderDelivery() {
  return render(
    <MemoryRouter>
      <Delivery />
    </MemoryRouter>
  )
}

describe('Delivery Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuth.mockReturnValue({ user: { uid: '123', email: 'test@test.com' } })
    useCart.mockReturnValue({
      cartItems: [],
      cartTotal: 0,
      cartCount: 0,
      clearCart: mockClearCart
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders header and description', () => {
    renderDelivery()
    expect(screen.getByText('Food Delivery')).toBeInTheDocument()
    expect(screen.getByText(/Order from home/)).toBeInTheDocument()
  })

  it('shows empty cart notice when cart is empty', () => {
    renderDelivery()
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText('Browse Menu')).toBeInTheDocument()
  })

  it('shows contact details section with phone and address inputs', () => {
    renderDelivery()
    expect(screen.getByText('📱 Contact Details')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('+254 712 345 678')).toBeInTheDocument()
    expect(screen.getByText('Delivery Address')).toBeInTheDocument()
    expect(screen.getByTestId('location-autocomplete')).toBeInTheDocument()
    expect(screen.getByText(/Search for your location/)).toBeInTheDocument()
  })

  it('updates phone input on change', () => {
    renderDelivery()
    const input = screen.getByPlaceholderText('+254 712 345 678')
    fireEvent.change(input, { target: { value: '+254723363961' } })
    expect(input).toHaveValue('+254723363961')
  })

  it('validates address is provided before placing order', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.change(screen.getByPlaceholderText('+254 712 345 678'), {
      target: { value: '+254723363961' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    expect(toast.error).toHaveBeenCalledWith('Please enter your delivery address')
  })

  it('shows order summary when cart has items', () => {
    useCart.mockReturnValue({
      cartItems: [
        { id: '1', name: 'Burger', price: 10, quantity: 2 },
        { id: '2', name: 'Fries', price: 5, quantity: 1 }
      ],
      cartTotal: 25,
      cartCount: 3,
      clearCart: mockClearCart
    })
    renderDelivery()
    expect(screen.getByText('Order Summary (3 items)')).toBeInTheDocument()
    expect(screen.getByText('Burger')).toBeInTheDocument()
    expect(screen.getByText('Fries')).toBeInTheDocument()
    expect(screen.getByText('$25')).toBeInTheDocument()
  })

  it('validates user is signed in before placing order', () => {
    useAuth.mockReturnValue({ user: null })
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.change(screen.getByPlaceholderText('+254 712 345 678'), {
      target: { value: '+254723363961' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    expect(toast.error).toHaveBeenCalledWith('Please sign in to place an order')
  })

  it('validates phone number is provided', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    expect(toast.error).toHaveBeenCalledWith('Please enter your phone number')
  })

  it('validates phone number has at least 10 digits', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.change(screen.getByPlaceholderText('+254 712 345 678'), {
      target: { value: '123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    expect(toast.error).toHaveBeenCalledWith('Use format: 0712345678 or +254712345678')
  })

  it('accepts international format +254...', () => {
    useAuth.mockReturnValue({ user: { uid: 'test' } })
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.change(screen.getByPlaceholderText('+254 712 345 678'), {
      target: { value: '+254712345678' }
    })
    fireEvent.change(screen.getByTestId('location-autocomplete'), {
      target: { value: '123 Main St' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    expect(screen.getByTestId('payment-modal')).toBeInTheDocument()
  })

  it('does not show Place Order button when cart is empty', () => {
    renderDelivery()
    expect(screen.queryByRole('button', { name: /Place Order/ })).not.toBeInTheDocument()
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('opens payment modal when all validations pass', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.change(screen.getByPlaceholderText('+254 712 345 678'), {
      target: { value: '+254723363961' }
    })
    fireEvent.change(screen.getByTestId('location-autocomplete'), {
      target: { value: '123 Main St, Nairobi' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    expect(screen.getByTestId('payment-modal')).toBeInTheDocument()
    expect(screen.getByTestId('payment-amount')).toHaveTextContent('10')
  })

  it('closes payment modal on cancel', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.change(screen.getByPlaceholderText('+254 712 345 678'), {
      target: { value: '+254723363961' }
    })
    fireEvent.change(screen.getByTestId('location-autocomplete'), {
      target: { value: '123 Main St, Nairobi' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByTestId('payment-modal')).not.toBeInTheDocument()
  })

  it('shows order confirmed view after successful payment', async () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    fireEvent.change(screen.getByPlaceholderText('+254 712 345 678'), {
      target: { value: '+254723363961' }
    })
    fireEvent.change(screen.getByTestId('location-autocomplete'), {
      target: { value: '123 Main St, Nairobi' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Place Order/ }))
    fireEvent.click(screen.getByText('Confirm Payment'))

    expect(await screen.findByText('Order Confirmed!')).toBeInTheDocument()
    expect(screen.getByText(/We'll call you at:/)).toBeInTheDocument()
    expect(screen.getByText('+254723363961')).toBeInTheDocument()
    expect(screen.getByText(/Delivering to:/)).toBeInTheDocument()
    expect(screen.getByText('123 Main St, Nairobi')).toBeInTheDocument()
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
    expect(toast.success).toHaveBeenCalledWith('Order placed successfully!')
    expect(mockClearCart).toHaveBeenCalled()
  })

  it('shows add more items button when cart has items', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartCount: 1,
      clearCart: mockClearCart
    })
    renderDelivery()
    expect(screen.getByText('Add more items')).toBeInTheDocument()
  })

  it('renders total with dual currency formatting', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Burger', price: 10, quantity: 2 }],
      cartTotal: 20,
      cartCount: 2,
      clearCart: mockClearCart
    })
    renderDelivery()
    // Multiple $20 elements exist (item line + total), so use getAllByText
    expect(screen.getAllByText('$20').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('KES 20').length).toBeGreaterThanOrEqual(2)
  })

  it('renders item quantities in order summary', () => {
    useCart.mockReturnValue({
      cartItems: [
        { id: '1', name: 'Burger', price: 10, quantity: 3 },
        { id: '2', name: 'Soda', price: 2, quantity: 1 }
      ],
      cartTotal: 32,
      cartCount: 4,
      clearCart: mockClearCart
    })
    renderDelivery()
    expect(screen.getByText('× 3')).toBeInTheDocument()
    expect(screen.getByText('× 1')).toBeInTheDocument()
    expect(screen.getByText('$30')).toBeInTheDocument()
    expect(screen.getByText('$2')).toBeInTheDocument()
  })
})
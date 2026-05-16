import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
}))
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}))

const mockItem = { id: 'm1', name: 'Bruschetta', price: 8 }

function TestComponent() {
  const { addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, cartItems } = useCart()
  return (
    <div>
      <button onClick={() => addToCart(mockItem)}>Add</button>
      <button onClick={() => removeFromCart('m1')}>Remove</button>
      <button onClick={() => updateQuantity('m1', 3)}>SetQty3</button>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="total">{cartTotal}</span>
      <span data-testid="items">{cartItems.length}</span>
    </div>
  )
}

// Helper to wrap with both providers
function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {ui}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('CartContext', () => {
  it('starts with empty cart', () => {
    renderWithProviders(<TestComponent />)
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
    expect(screen.getByTestId('items').textContent).toBe('0')
  })

  it('adds item to cart', () => {
    renderWithProviders(<TestComponent />)
    act(() => screen.getByText('Add').click())
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('increments quantity when same item added twice', () => {
    renderWithProviders(<TestComponent />)
    act(() => screen.getByText('Add').click())
    act(() => screen.getByText('Add').click())
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('items').textContent).toBe('1')
  })

  it('removes item from cart', () => {
    renderWithProviders(<TestComponent />)
    act(() => screen.getByText('Add').click())
    act(() => screen.getByText('Remove').click())
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('calculates total correctly', () => {
    renderWithProviders(<TestComponent />)
    act(() => screen.getByText('Add').click())
    expect(screen.getByTestId('total').textContent).toBe('8')
  })

  it('updates quantity correctly', () => {
    renderWithProviders(<TestComponent />)
    act(() => screen.getByText('Add').click())
    act(() => screen.getByText('SetQty3').click())
    expect(screen.getByTestId('count').textContent).toBe('3')
    expect(screen.getByTestId('total').textContent).toBe('24')
  })
})
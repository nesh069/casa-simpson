import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from '../context/CartContext'

const mockItem = { id: 'm1', name: 'Bruschetta', price: 8, quantity: 1 }

function TestComponent() {
  const { cartItems, addToCart, removeFromCart, cartTotal, cartCount } = useCart()
  return (
    <div>
      <button onClick={() => addToCart(mockItem)}>Add</button>
      <button onClick={() => removeFromCart('m1')}>Remove</button>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="total">{cartTotal}</span>
    </div>
  )
}

describe('CartContext', () => {
  it('starts with empty cart', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('adds item to cart', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    act(() => screen.getByText('Add').click())
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('removes item from cart', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    act(() => screen.getByText('Add').click())
    act(() => screen.getByText('Remove').click())
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('calculates total correctly', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    act(() => screen.getByText('Add').click())
    expect(screen.getByTestId('total').textContent).toBe('8')
  })
})
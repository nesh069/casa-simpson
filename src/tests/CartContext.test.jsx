import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from '../context/CartContext'

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

describe('CartContext', () => {
  it('starts with empty cart', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  it('adds item to cart', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    act(() => screen.getByText('Add').click())
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('increments quantity when same item added twice', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    act(() => screen.getByText('Add').click())
    act(() => screen.getByText('Add').click())
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('items').textContent).toBe('1')
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

  it('updates quantity correctly', () => {
    render(<CartProvider><TestComponent /></CartProvider>)
    act(() => screen.getByText('Add').click())
    act(() => screen.getByText('SetQty3').click())
    expect(screen.getByTestId('count').textContent).toBe('3')
    expect(screen.getByTestId('total').textContent).toBe('24')
  })
})
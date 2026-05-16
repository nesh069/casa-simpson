import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MenuCard from '../components/MenuCard'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import { BrowserRouter } from 'react-router-dom'

const mockItem = {
  id: 'm1',
  name: 'Bruschetta',
  category: 'starters',
  price: 8,
  description: 'Grilled bread with tomatoes.',
  image: 'https://example.com/food.jpg',
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

describe('MenuCard', () => {
  it('renders item name', () => {
    renderWithProviders(<MenuCard item={mockItem} />)
    expect(screen.getByText('Bruschetta')).toBeInTheDocument()
  })

  it('renders item price', () => {
    renderWithProviders(<MenuCard item={mockItem} />)
    expect(screen.getByText('$8.00')).toBeInTheDocument()
  })

  it('renders description', () => {
    renderWithProviders(<MenuCard item={mockItem} />)
    expect(screen.getByText('Grilled bread with tomatoes.')).toBeInTheDocument()
  })

  it('renders Add to Order button', () => {
    renderWithProviders(<MenuCard item={mockItem} />)
    expect(screen.getByRole('button', { name: /add to order/i })).toBeInTheDocument()
  })

  it('clicking Add to Order does not throw', () => {
    renderWithProviders(<MenuCard item={mockItem} />)
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /add to order/i }))
    ).not.toThrow()
  })
})
import { render, screen, fireEvent } from '@testing-library/react'
import MenuCard from '../components/MenuCard'
import { CartProvider } from '../context/CartContext'

const mockItem = {
  id: 'm1',
  name: 'Bruschetta',
  category: 'starters',
  price: 8,
  description: 'Grilled bread with tomatoes.',
  image: 'https://example.com/food.jpg',
}

const renderWithCart = (ui) => render(<CartProvider>{ui}</CartProvider>)

describe('MenuCard', () => {
  it('renders item name', () => {
    renderWithCart(<MenuCard item={mockItem} />)
    expect(screen.getByText('Bruschetta')).toBeInTheDocument()
  })

  it('renders item price', () => {
    renderWithCart(<MenuCard item={mockItem} />)
    expect(screen.getByText('$8.00')).toBeInTheDocument()
  })

  it('renders description', () => {
    renderWithCart(<MenuCard item={mockItem} />)
    expect(screen.getByText('Grilled bread with tomatoes.')).toBeInTheDocument()
  })

  it('renders Add to Order button', () => {
    renderWithCart(<MenuCard item={mockItem} />)
    expect(screen.getByRole('button', { name: /add to order/i })).toBeInTheDocument()
  })

  it('clicking Add to Order does not throw', () => {
    renderWithCart(<MenuCard item={mockItem} />)
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /add to order/i }))
    ).not.toThrow()
  })
})
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import Navbar from '../components/Navbar'

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

describe('Navbar', () => {
  it('renders brand name', async () => {
    renderWithProviders(<Navbar />)
    expect(await screen.findByRole('link', { name: /Casa Simpson/i })).toBeInTheDocument()
  })

  it('renders nav links', async () => {
    renderWithProviders(<Navbar />)
    expect(await screen.findByText(/Home/i)).toBeInTheDocument()
    expect(await screen.findByText(/Rooms/i)).toBeInTheDocument()
  })
})
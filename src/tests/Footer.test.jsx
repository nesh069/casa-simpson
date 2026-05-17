import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../components/Footer'

describe('Footer', () => {
  it('renders brand name and tagline', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText('Casa')).toBeInTheDocument()
    expect(screen.getByText(/Where luxury meets home/)).toBeInTheDocument()
  })

  it('renders quick links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Rooms')).toBeInTheDocument()
    expect(screen.getByText('Restaurant & Bar')).toBeInTheDocument()
    expect(screen.getByText('Delivery')).toBeInTheDocument()
    expect(screen.getByText('Guest Reviews')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByText('Nairobi, Kenya')).toBeInTheDocument()
    expect(screen.getByText('+254723363961')).toBeInTheDocument()
    expect(screen.getByText('muneneemmanuel953@gmail.com')).toBeInTheDocument()
  })

  it('renders copyright and built by text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText(/Casa Simpson. All rights reserved./)).toBeInTheDocument()
    expect(screen.getByText('Built by Simpson')).toBeInTheDocument()
  })
})
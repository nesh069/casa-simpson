import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RoomCard from '../components/RoomCard'

const mockRoom = {
  id: 'r1',
  name: 'Classic Room',
  type: 'single',
  price: 120,
  description: 'A cozy room.',
  amenities: ['WiFi', 'AC'],
  image: 'https://example.com/room.jpg',
  available: true,
}

describe('RoomCard', () => {
  it('renders room name', () => {
    render(<MemoryRouter><RoomCard room={mockRoom} /></MemoryRouter>)
    expect(screen.getByText('Classic Room')).toBeInTheDocument()
  })

  it('renders room price', () => {
    render(<MemoryRouter><RoomCard room={mockRoom} /></MemoryRouter>)
    expect(screen.getByText('$120.00')).toBeInTheDocument()
  })

  it('renders View Room button when available', () => {
    render(<MemoryRouter><RoomCard room={mockRoom} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /view room/i })).toBeInTheDocument()
  })

  it('shows Unavailable when not available', () => {
    render(<MemoryRouter><RoomCard room={{ ...mockRoom, available: false }} /></MemoryRouter>)
    expect(screen.getByText('Not Available')).toBeInTheDocument()
  })

  it('renders amenities', () => {
    render(<MemoryRouter><RoomCard room={mockRoom} /></MemoryRouter>)
    expect(screen.getByText('WiFi')).toBeInTheDocument()
  })
})
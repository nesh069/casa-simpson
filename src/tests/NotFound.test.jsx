import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '../pages/NotFound'

describe('NotFound Page', () => {
  it('renders 404 message and back link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByText(/404/)).toBeInTheDocument()
    expect(screen.getByText(/Page Not Found/)).toBeInTheDocument()
    expect(screen.getByText(/Back to Home/)).toBeInTheDocument()
  })
})
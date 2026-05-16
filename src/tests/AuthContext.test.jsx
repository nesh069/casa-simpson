import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

vi.mock('../firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, cb) => {
    cb(null)
    return () => {}
  },
  signOut: vi.fn(),
}))

function TestComponent() {
  const { user, loading } = useAuth()
  if (loading) return <span>Loading</span>
  return <span data-testid="status">{user ? `user:${user.email}` : 'no-user'}</span>
}

describe('AuthContext', () => {
  it('shows no user when unauthenticated', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>)
    expect(screen.getByTestId('status').textContent).toBe('no-user')
  })

  it('does not show loading after auth resolves', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>)
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })
})
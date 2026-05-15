import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

vi.mock('../firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (auth, cb) => { cb(null); return () => {} },
  signOut: vi.fn(),
}))

function TestComponent() {
  const { user, loading } = useAuth()
  if (loading) return <span>Loading</span>
  return <span>{user ? user.email : 'No user'}</span>
}

describe('AuthContext', () => {
  it('renders no user when unauthenticated', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>)
    expect(screen.getByText('No user')).toBeInTheDocument()
  })
})
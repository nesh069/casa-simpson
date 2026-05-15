import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (auth, cb) => { cb(null); return () => {} },
  signOut: vi.fn(),
}))

describe('ProtectedRoute', () => {
  it('redirects to login when unauthenticated', () => {
    render(
      <MemoryRouter initialEntries={['/restaurant']}>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
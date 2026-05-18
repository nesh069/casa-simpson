import { vi } from 'vitest'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'

// Mock Firebase before any imports
vi.mock('../firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null)
      return () => {}
    })
  },
  db: {},
  googleProvider: {},
  githubProvider: {},
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: 'test', email: 'test@test.com' } })),
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: 'test', email: 'test@test.com' } })),
  signInWithPopup: vi.fn(() => Promise.resolve({ user: { uid: 'test', displayName: 'Test User' } })),
  signInWithPhoneNumber: vi.fn(() => Promise.resolve({ 
    confirm: vi.fn(() => Promise.resolve({ user: { uid: 'test' } }))
  })),
  RecaptchaVerifier: vi.fn(function() { 
    this.verify = vi.fn(() => Promise.resolve())
  }),
  signOut: vi.fn(() => Promise.resolve())
}))

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  doc: vi.fn(() => ({})),
  addDoc: vi.fn(() => Promise.resolve({ id: 'test-id' })),
  updateDoc: vi.fn(() => Promise.resolve()),
  setDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  onSnapshot: vi.fn(() => () => {}),
  serverTimestamp: vi.fn(() => new Date()),
  runTransaction: vi.fn(() => Promise.resolve({ success: true }))
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock useAdmin
vi.mock('../hooks/useAdmin', () => ({
  useAdmin: () => ({
    isAdmin: false,
    userRole: null,
    loading: false,
    user: null,
    canAccess: false,
    isSuperAdmin: false,
  })
}))

// Mock AdminRoute (just pass children through)
vi.mock('../components/AdminRoute', () => ({
  default: ({ children }) => children
}))

// Mock AdminLayout (just pass children through)
vi.mock('../components/AdminLayout', () => ({
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>
}))

// Global mocks
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  }
}

// Custom render wrapper with all providers
export function renderWithProviders(ui, options = {}) {
  const AllProviders = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: AllProviders, ...options })
}
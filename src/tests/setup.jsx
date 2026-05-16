import { vi } from 'vitest'
import '@testing-library/jest-dom'

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
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  onSnapshot: vi.fn(() => () => {}),
  serverTimestamp: vi.fn(() => new Date())
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock Google Maps
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }) => <div>{children}</div>,
  Marker: () => <div>Marker</div>,
  useLoadScript: () => ({ isLoaded: true, loadError: null })
}))

// Global mocks
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  }
}
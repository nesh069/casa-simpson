export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    callback(null)
    return () => {}
  }
}

export const db = {}
export const googleProvider = {}
export const githubProvider = {}

export const signInWithEmailAndPassword = () => Promise.resolve({ user: { uid: 'test', email: 'test@test.com' } })
export const createUserWithEmailAndPassword = () => Promise.resolve({ user: { uid: 'test', email: 'test@test.com' } })
export const signInWithPopup = () => Promise.resolve({ user: { uid: 'test', displayName: 'Test User' } })
export const signInWithPhoneNumber = () => Promise.resolve({ confirm: () => Promise.resolve({ user: { uid: 'test' } }) })
export const RecaptchaVerifier = function() { this.verify = () => Promise.resolve() }
export const signOut = () => Promise.resolve()

// Firestore mocks
export const collection = () => ({})
export const getDocs = () => Promise.resolve({ docs: [] })
export const getDoc = () => Promise.resolve({ exists: () => false, data: () => ({}) })
export const doc = () => ({})
export const addDoc = () => Promise.resolve({ id: 'test-id' })
export const updateDoc = () => Promise.resolve()
export const query = () => ({})
export const where = () => ({})
export const orderBy = () => ({})
export const limit = () => ({})
export const onSnapshot = () => () => {}
export const serverTimestamp = () => new Date()
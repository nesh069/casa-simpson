import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signOut as firebaseSignOut,
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Social Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Email Auth
export const signUpWithEmail = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

// Social Auth
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGithub = () => signInWithPopup(auth, githubProvider);

// Phone Auth
export const setupRecaptcha = (containerId) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => console.log('Recaptcha verified')
  });
};

export const sendPhoneOTP = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return { confirmationResult, error: null };
  } catch (error) {
    return { confirmationResult: null, error };
  }
};

export const verifyPhoneOTP = async (confirmationResult, code) => {
  try {
    const result = await confirmationResult.confirm(code);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Sign Out
export const signOutUser = () => firebaseSignOut(auth);

// Auth State Observer
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// ==================== FIRESTORE DATABASE ====================

export const getRoomsFromFirestore = async () => {
  const roomsRef = collection(db, 'rooms');
  const snapshot = await getDocs(roomsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRoomByIdFromFirestore = async (id) => {
  const roomRef = doc(db, 'rooms', id);
  const snapshot = await getDoc(roomRef);
  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
  return null;
};

export const subscribeToRooms = (callback) => {
  const roomsRef = collection(db, 'rooms');
  return onSnapshot(roomsRef, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(rooms);
  });
};

export const getReviewsFromFirestore = async () => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMenusFromFirestore = async () => {
  const menusRef = collection(db, 'menus');
  const snapshot = await getDocs(menusRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserBookingsFromFirestore = async (userId) => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createBookingInFirestore = async (booking) => {
  const bookingsRef = collection(db, 'bookings');
  return await addDoc(bookingsRef, { ...booking, createdAt: serverTimestamp(), status: 'confirmed' });
};

export const cancelBookingInFirestore = async (bookingId) => {
  const bookingRef = doc(db, 'bookings', bookingId);
  return await updateDoc(bookingRef, { status: 'cancelled' });
};
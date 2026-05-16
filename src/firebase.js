import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

// ── Phone Auth Helpers ────────────────────────────────────────────────

export function setupRecaptcha(containerId) {
  // Clear any existing reCAPTCHA instance
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear()
    } catch (e) {
      // ignore cleanup errors
    }
    window.recaptchaVerifier = null
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        window.recaptchaVerifier = null
      },
    }
  )

  return window.recaptchaVerifier
}

export async function sendPhoneOTP(phoneNumber, appVerifier) {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    )
    return { confirmationResult, error: null }
  } catch (error) {
    // Clean up verifier on failure
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear()
      } catch (e) {}
      window.recaptchaVerifier = null
    }
    return { confirmationResult: null, error }
  }
}

export async function verifyPhoneOTP(confirmationResult, otp) {
  try {
    const result = await confirmationResult.confirm(otp)
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}
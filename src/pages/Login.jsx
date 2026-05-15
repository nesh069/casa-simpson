import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '../firebase'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [tab, setTab] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmResult, setConfirmResult] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef(null)

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear() } catch (e) { /* ignore */ }
        window.recaptchaVerifier = null
      }
    }
  }, [])

  const getErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account found with this email. Create one instead.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
      'auth/weak-password': 'Password must be at least 6 characters long.',
      'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled. Contact support.',
      'auth/invalid-phone-number': 'Please enter a valid phone number with country code (e.g. +254...).',
      'auth/missing-phone-number': 'Please enter your phone number.',
      'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
      'auth/invalid-verification-code': 'Invalid OTP code. Please check and try again.',
      'auth/code-expired': 'The OTP has expired. Please request a new one.',
    }
    return messages[code] || 'Something went wrong. Please try again.'
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    if (!email.trim()) { toast.error('Please enter your email'); return }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email.trim(), password)
        toast.success('Account created! Welcome to Casa Simpson.')
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
        toast.success('Welcome back!')
      }
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider, name) => {
    try {
      await signInWithPopup(auth, provider)
      toast.success(`Signed in with ${name}!`)
      navigate('/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error(getErrorMessage(err.code))
      }
    }
  }

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear() } catch (e) { /* ignore */ }
      window.recaptchaVerifier = null
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      recaptchaRef.current,
      { size: 'invisible' }
    )
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    const cleaned = phone.trim()
    if (!cleaned) { toast.error('Please enter a phone number'); return }
    if (!cleaned.startsWith('+')) {
      toast.error('Include country code (e.g. +254 for Kenya)')
      return
    }
    setLoading(true)
    try {
      setupRecaptcha()
      const result = await signInWithPhoneNumber(
        auth,
        cleaned,
        window.recaptchaVerifier
      )
      setConfirmResult(result)
      toast.success('OTP sent to your phone!')
    } catch (err) {
      toast.error(getErrorMessage(err.code))
      // Reset recaptcha on failure
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear() } catch (e) { /* ignore */ }
        window.recaptchaVerifier = null
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp || otp.length < 6) { toast.error('Please enter the 6-digit OTP'); return }
    setLoading(true)
    try {
      await confirmResult.confirm(otp)
      toast.success('Phone verified! Welcome to Casa Simpson.')
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-page">
      {/* Recaptcha container - MUST be in the DOM */}
      <div ref={recaptchaRef} id="recaptcha-container"></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold font-['Poppins'] text-text">
            Casa <span className="text-brand">Simpson</span>
          </Link>
          <p className="text-muted mt-2">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          {/* Tab selector */}
          <div className="flex bg-surface rounded-xl p-1 mb-6">
            {['email', 'phone'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setConfirmResult(null) }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  tab === t
                    ? 'bg-brand text-white shadow-[0_0_10px_rgba(255,71,87,0.3)]'
                    : 'text-muted hover:text-text'
                }`}
              >
                {t === 'email' ? '✉️ Email' : '📱 Phone'}
              </button>
            ))}
          </div>

          {tab === 'email' ? (
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-muted" size={16} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-text placeholder-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-muted" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 bg-surface border border-border rounded-xl text-sm text-text placeholder-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand-hover disabled:bg-border disabled:text-muted text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
              >
                {loading
                  ? 'Please wait...'
                  : isRegister
                  ? 'Create Account'
                  : 'Sign In'}
              </button>
            </form>
          ) : (
            <div className="mb-6">
              {!confirmResult ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-muted" size={16} />
                    <input
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-text placeholder-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted">
                    Include country code e.g. +254 for Kenya
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand-hover disabled:bg-border text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-muted text-sm text-center">
                    Enter the 6-digit code sent to{' '}
                    <span className="text-text font-medium">{phone}</span>
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl tracking-[0.5em] py-3 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-brand transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand-hover disabled:bg-border text-white font-bold py-3 rounded-xl transition-all"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConfirmResult(null); setOtp('') }}
                    className="w-full text-muted hover:text-text text-sm py-2"
                  >
                    ← Change number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Logins */}
          {tab === 'email' && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-[1px] bg-border" />
                <span className="text-muted text-xs">or continue with</span>
                <div className="flex-1 h-[1px] bg-border" />
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleSocialLogin(googleProvider, 'Google')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface border border-border rounded-xl text-sm text-text hover:border-brand/30 hover:bg-card transition-all"
                >
                  <FaGoogle size={16} className="text-[#ff4757]" />
                  Google
                </button>
                <button
                  onClick={() => handleSocialLogin(githubProvider, 'GitHub')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface border border-border rounded-xl text-sm text-text hover:border-brand/30 hover:bg-card transition-all"
                >
                  <FaGithub size={16} />
                  GitHub
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-muted">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-brand hover:underline font-semibold"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
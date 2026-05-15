import { useState } from 'react'
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

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast.success('Account created! Welcome to Casa Simpson.')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Welcome back!')
      }
      navigate('/')
    } catch (err) {
      toast.error(
        err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim()
      )
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
      toast.error(`${name} sign-in failed. Please try again.`)
    }
  }

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        { size: 'invisible' }
      )
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!phone) { toast.error('Please enter a phone number'); return }
    setLoading(true)
    try {
      setupRecaptcha()
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      )
      setConfirmResult(result)
      toast.success('OTP sent to your phone!')
    } catch (err) {
      toast.error('Failed to send OTP. Check your number and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp) { toast.error('Please enter the OTP'); return }
    setLoading(true)
    try {
      await confirmResult.confirm(otp)
      toast.success('Phone verified! Welcome to Casa Simpson.')
      navigate('/')
    } catch (err) {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-page">
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
                onClick={() => setTab(t)}
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
                    <span className="text-text font-semibold">{phone}</span>
                  </p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-muted text-center tracking-[0.5em] text-lg font-bold focus:outline-none focus:border-brand transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand-hover disabled:bg-border text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmResult(null)}
                    className="w-full text-muted text-sm hover:text-text transition-colors"
                  >
                    ← Change number
                  </button>
                </form>
              )}
              <div id="recaptcha-container" />
            </div>
          )}

          {tab === 'email' && (
            <>
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-3 text-muted">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleSocialLogin(googleProvider, 'Google')}
                  className="flex items-center justify-center gap-2 bg-surface border border-border hover:border-brand/40 py-3 rounded-xl transition-all text-text text-sm font-medium"
                >
                  <FaGoogle className="text-brand" size={16} />
                  Google
                </button>
                <button
                  onClick={() => handleSocialLogin(githubProvider, 'GitHub')}
                  className="flex items-center justify-center gap-2 bg-surface border border-border hover:border-brand/40 py-3 rounded-xl transition-all text-text text-sm font-medium"
                >
                  <FaGithub className="text-text" size={16} />
                  GitHub
                </button>
              </div>

              <p className="text-center text-sm text-muted">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-brand font-semibold hover:underline"
                >
                  {isRegister ? 'Sign In' : 'Create one'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
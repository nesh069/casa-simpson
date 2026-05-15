import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '../firebase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const from = location.state?.from?.pathname || '/'

  const [isRegister, setIsRegister] = useState(false)
  const [tab, setTab] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmResult, setConfirmResult] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

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
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.message
        .replace('Firebase: ', '')
        .replace(/\(auth\/.*\)\.?/, '')
        .trim()
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider, name) => {
    setLoading(true)
    try {
      await signInWithPopup(auth, provider)
      toast.success(`Signed in with ${name}!`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(`${name} sign-in failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          toast.error('reCAPTCHA expired. Please try again.')
        },
      }
    )
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!phone.startsWith('+')) {
      toast.error('Phone number must start with + and country code (e.g. +254...)')
      return
    }
    setLoading(true)
    try {
      setupRecaptcha()
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      )
      setConfirmResult(result)
      toast.success('OTP sent! Check your phone.')
    } catch (err) {
      toast.error('Failed to send OTP. Check your number and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      await confirmResult.confirm(otp)
      toast.success('Phone verified! Welcome to Casa Simpson.')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-[#0d0d1a] py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold font-['Poppins'] text-[#f1f2f6]">
            Casa <span className="text-[#ff4757]">Simpson</span>
          </Link>
          <p className="text-[#a4b0be] mt-2">
            {isRegister ? 'Create your account' : 'Welcome back — sign in to continue'}
          </p>
        </div>

        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl shadow-2xl p-8">
          {/* Tab selector */}
          <div className="flex bg-[#12122a] rounded-xl p-1 mb-6">
            {[
              { key: 'email', label: '✉️ Email' },
              { key: 'phone', label: '📱 Phone' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setConfirmResult(null) }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.key
                    ? 'bg-[#ff4757] text-white shadow-[0_0_10px_rgba(255,71,87,0.3)]'
                    : 'text-[#a4b0be] hover:text-[#f1f2f6]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'email' ? (
            <>
              <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-[#a4b0be]" size={16} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#12122a] border border-[#2a2a3e] rounded-xl text-sm text-[#f1f2f6] placeholder-[#a4b0be] focus:outline-none focus:border-[#ff4757] transition-colors"
                  />
                </div>

                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-[#a4b0be]" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-3 bg-[#12122a] border border-[#2a2a3e] rounded-xl text-sm text-[#f1f2f6] placeholder-[#a4b0be] focus:outline-none focus:border-[#ff4757] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#a4b0be] hover:text-[#f1f2f6] transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ff4757] hover:bg-[#ff6b81] disabled:bg-[#2a2a3e] disabled:text-[#a4b0be] text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                >
                  {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2a2a3e]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[#1a1a2e] px-3 text-[#a4b0be]">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => handleSocialLogin(googleProvider, 'Google')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#12122a] border border-[#2a2a3e] hover:border-[#ff4757]/40 py-3 rounded-xl transition-all text-[#f1f2f6] text-sm font-medium disabled:opacity-50"
                >
                  <FaGoogle className="text-[#ff4757]" size={16} />
                  Google
                </button>
                <button
                  onClick={() => handleSocialLogin(githubProvider, 'GitHub')}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#12122a] border border-[#2a2a3e] hover:border-[#ff4757]/40 py-3 rounded-xl transition-all text-[#f1f2f6] text-sm font-medium disabled:opacity-50"
                >
                  <FaGithub className="text-[#f1f2f6]" size={16} />
                  GitHub
                </button>
              </div>

              <p className="text-center text-sm text-[#a4b0be]">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[#ff4757] font-semibold hover:underline"
                >
                  {isRegister ? 'Sign In' : 'Create one'}
                </button>
              </p>
            </>
          ) : (
            <div>
              {!confirmResult ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-[#a4b0be]" size={16} />
                    <input
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#12122a] border border-[#2a2a3e] rounded-xl text-sm text-[#f1f2f6] placeholder-[#a4b0be] focus:outline-none focus:border-[#ff4757] transition-colors"
                    />
                  </div>
                  <p className="text-xs text-[#a4b0be]">
                    ℹ️ Include country code — e.g. +254 for Kenya, +1 for USA
                  </p>
                  <div id="recaptcha-container" />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ff4757] hover:bg-[#ff6b81] disabled:bg-[#2a2a3e] text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-[#12122a] border border-[#2a2a3e] rounded-xl p-4 text-center">
                    <p className="text-[#a4b0be] text-sm">
                      OTP sent to{' '}
                      <span className="text-[#f1f2f6] font-bold">{phone}</span>
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    className="w-full px-4 py-4 bg-[#12122a] border border-[#2a2a3e] rounded-xl text-[#f1f2f6] placeholder-[#a4b0be] text-center tracking-[0.6em] text-xl font-bold focus:outline-none focus:border-[#ff4757] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-[#ff4757] hover:bg-[#ff6b81] disabled:bg-[#2a2a3e] disabled:text-[#a4b0be] text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConfirmResult(null); setOtp('') }}
                    className="w-full text-[#a4b0be] text-sm hover:text-[#f1f2f6] transition-colors py-1"
                  >
                    ← Change number
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
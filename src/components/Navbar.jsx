import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'
import { FiShoppingCart, FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMenuOpen(false)
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/restaurant', label: 'Restaurant' },
    { to: '/delivery', label: 'Delivery' },
    { to: '/reviews', label: 'Reviews' },
  ]

  const isActive = (path) =>
    location.pathname === path
      ? 'text-[#ff4757] font-semibold'
      : 'text-[#a4b0be] hover:text-[#f1f2f6]'

  return (
    <>
      <nav className="bg-[#0d0d1a]/90 backdrop-blur-md border-b border-[#2a2a3e] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-bold text-[#f1f2f6] font-['Poppins']">
                Casa{' '}
                <span className="text-[#ff4757]">Simpson</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors duration-200 ${isActive(link.to)}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-[#1a1a2e] rounded-full transition-colors text-[#a4b0be] hover:text-[#f1f2f6]"
              >
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff4757] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-[0_0_8px_rgba(255,71,87,0.6)]">
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-[#1a1a2e] border border-[#2a2a3e] rounded-full px-3 py-1.5">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="avatar"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <FiUser size={14} className="text-[#a4b0be]" />
                    )}
                    <span className="text-sm font-medium text-[#f1f2f6] max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-[#ff4757]/20 hover:text-[#ff4757] text-[#a4b0be] rounded-full transition-colors"
                    title="Logout"
                  >
                    <FiLogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:shadow-[0_0_15px_rgba(255,71,87,0.4)]"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-[#1a1a2e] rounded-full text-[#a4b0be] transition-colors"
              >
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#1a1a2e] border-t border-[#2a2a3e] px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-[#ff4757]/10 text-[#ff4757] font-semibold'
                    : 'text-[#a4b0be] hover:bg-[#12122a] hover:text-[#f1f2f6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#2a2a3e] mt-2">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 text-[#a4b0be] text-sm">
                    <FiUser size={14} />
                    <span className="truncate">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-sm text-[#ff4757] hover:bg-[#ff4757]/10 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm bg-[#ff4757] text-white text-center py-2.5 rounded-xl font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
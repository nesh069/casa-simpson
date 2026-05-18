import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../hooks/useAdmin'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'
import { FiShoppingCart, FiMenu, FiX, FiLogOut, FiUser, FiCalendar, FiSettings } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isAdmin } = useAdmin()
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
      <nav className="bg-page/90 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <span className="text-xl font-bold text-text font-['Poppins']">
                Casa <span className="text-brand">Simpson</span>
              </span>
            </Link>

            {/* Desktop nav links */}
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

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-card rounded-full transition-colors text-muted hover:text-text"
              >
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-[0_0_8px_rgba(255,71,87,0.6)]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Authenticated user — desktop */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  {/* User pill */}
                  <div className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="avatar"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <FiUser size={14} className="text-muted" />
                    )}
                    <span className="text-sm font-medium text-text max-w-25 truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </div>

                  {/* My Bookings icon */}
                  <Link
                    to="/bookings"
                    title="My Bookings"
                    className={`p-2 rounded-full transition-colors ${
                      location.pathname === '/bookings'
                        ? 'bg-brand/20 text-brand'
                        : 'hover:bg-card text-muted hover:text-text'
                    }`}
                  >
                    <FiCalendar size={18} />
                  </Link>

                  {/* Admin icon (desktop) */}
                  {user && isAdmin && (
                    <Link
                      to="/admin"
                      title="Admin Panel"
                      className={`p-2 rounded-full transition-colors ${
                        location.pathname.startsWith('/admin')
                          ? 'bg-brand/20 text-brand'
                          : 'hover:bg-card text-muted hover:text-text'
                      }`}
                    >
                      <FiSettings size={18} />
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 hover:bg-brand/20 hover:text-brand text-muted rounded-full transition-colors"
                  >
                    <FiLogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex bg-brand hover:bg-brand-hover text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:shadow-[0_0_15px_rgba(255,71,87,0.4)]"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-card rounded-full text-muted transition-colors"
              >
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-brand/10 text-brand font-semibold'
                    : 'text-muted hover:bg-surface hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-border mt-2 space-y-1">
              {user ? (
                <>
                  {/* User info row */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="avatar"
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-brand/20 rounded-full flex items-center justify-center">
                        <FiUser size={14} className="text-brand" />
                      </div>
                    )}
                    <span className="text-sm text-muted truncate">
                      {user.displayName || user.email}
                    </span>
                  </div>

                  {/* My Bookings mobile link */}
                  <Link
                    to="/bookings"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      location.pathname === '/bookings'
                        ? 'bg-brand/10 text-brand font-semibold'
                        : 'text-muted hover:bg-surface hover:text-text'
                    }`}
                  >
                    <FiCalendar size={15} />
                    My Bookings
                  </Link>

                  {/* Admin mobile link */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                        location.pathname.startsWith('/admin')
                          ? 'bg-brand/10 text-brand font-semibold'
                          : 'text-muted hover:bg-surface hover:text-text'
                      }`}
                    >
                      <FiSettings size={15} />
                      Admin Panel
                    </Link>
                  )}

                  {/* Logout mobile */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-brand hover:bg-brand/10 rounded-lg transition-colors"
                  >
                    <FiLogOut size={15} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm bg-brand text-white text-center py-2.5 rounded-xl font-semibold hover:bg-brand-hover transition-colors"
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
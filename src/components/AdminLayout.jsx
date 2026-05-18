import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import {
  FiGrid, FiHome, FiBookOpen, FiShoppingBag, FiStar,
  FiMenu, FiX, FiLogOut, FiChevronLeft, FiSettings, FiTool
} from 'react-icons/fi'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/rooms', label: 'Rooms', icon: FiHome },
  { to: '/admin/menu', label: 'Menu', icon: FiBookOpen },
  { to: '/admin/bookings', label: 'Bookings', icon: FiShoppingBag },
  { to: '/admin/orders', label: 'Orders', icon: FiTool },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
]

export default function AdminLayout({ children }) {
  const { user, isAdmin, logout } = useAdmin()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-brand/10 text-brand border-l-2 border-brand'
      : 'text-muted hover:bg-card hover:text-text border-l-2 border-transparent'

  const linkClass = (link) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive(link.to)}`

  return (
    <div className="min-h-screen bg-page flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
            <Link to="/admin" className="flex items-center gap-2">
              <FiSettings size={18} className="text-brand" />
              <span className="font-bold font-['Poppins'] text-text">
                Admin Panel
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-surface rounded-lg text-muted transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={linkClass(link)}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="px-3 py-4 border-t border-border shrink-0 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-text hover:bg-card rounded-lg transition-colors"
            >
              <FiChevronLeft size={16} />
              Back to Site
            </Link>
            <div className="flex items-center gap-3 px-4 py-2.5">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 bg-brand/20 rounded-full flex items-center justify-center">
                  <FiSettings size={12} className="text-brand" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 hover:bg-brand/20 hover:text-brand rounded-lg text-muted transition-colors"
              >
                <FiLogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 lg:hidden bg-card/90 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 hover:bg-surface rounded-lg text-muted transition-colors"
          >
            <FiMenu size={20} />
          </button>
          <span className="font-semibold text-sm text-text">Admin Panel</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

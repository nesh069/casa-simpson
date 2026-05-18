import { Navigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'

export default function AdminRoute({ children }) {
  const { loading, user, canAccess } = useAdmin()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4757] mx-auto mb-4"></div>
          <p className="text-[#a4b0be]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!canAccess) return <Navigate to="/" replace />

  return children
}

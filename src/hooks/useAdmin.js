import { useAuth } from '../context/AuthContext'

export function useAdmin() {
  const { user, userRole, isAdmin, loading } = useAuth()

  return {
    isAdmin,
    userRole,
    loading,
    user,
    isSuperAdmin: userRole === 'superadmin',
    canAccess: isAdmin || userRole === 'superadmin',
  }
}

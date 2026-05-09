import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader } from 'lucide-react'
import MobileOnlyNotice from './MobileOnlyNotice'

export default function ProtectedRoute({ children, allowedRoles = ['ADMIN'] }) {
  const { session, profile, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showMobileNotice, setShowMobileNotice] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !profile) {
      navigate('/login', { replace: true })
      return
    }

    const role = profile.role

    if (!allowedRoles.includes(role)) {
      // Role-based handling - NO signout
      if (role === 'DRIVER' || role === 'PARENT') {
        setShowMobileNotice(true)
        return
      }
      // For other unauthorized roles, redirect to login or home
      navigate('/unauthorized', { replace: true })
      return
    }
  }, [isAuthenticated, profile, isLoading, navigate, allowedRoles])

  // Full screen loader to prevent flicker
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center shadow-xl">
            <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-16 h-16 object-cover rounded-2xl" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Authenticating and fetching your profile...</p>
          <div className="flex justify-center mt-6">
            <div className="w-12 h-12 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return null // Will redirect
  }

  // Render mobile notice for blocked roles
  if (showMobileNotice) {
    return <MobileOnlyNotice />
  }

  // Authorized - render children
  return children
}


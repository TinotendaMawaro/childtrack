import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import SplashScreen from './SplashScreen'
import Login from './Login'
import FullScreenLoader from './ui/FullScreenLoader'
import GuidedTour from './ui/GuidedTour'
import { useAuth } from '../hooks/useAuth'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from './AdminLayout'
import StaffDashboard from './StaffDashboard'
import DriverDashboard from './DriverDashboard'
import LiveRouteScreen from './LiveRouteScreen'
import MobileOnlyNotice from './MobileOnlyNotice'
import TermsModal from './ui/TermsModal'

export default function FlowManager() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading: authLoading, profile, userRole, session, roleLoading } = useAuth()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [firstLogin, setFirstLogin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('terms-accepted') === 'true'
    setTermsAccepted(accepted)
    setFirstLogin(!localStorage.getItem('tour-completed'))
  }, [])

  useEffect(() => {
    if (authLoading || roleLoading) return

    if (!isAuthenticated) {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true })
      }
      return
    }

    if (!profile) return
    if (!termsAccepted) {
      setShowTerms(true)
      return
    }

    switch (profile.role) {
      case 'ADMIN':
        navigate('/admin/dashboard', { replace: true })
        break
      case 'STAFF':
        navigate('/staff/dashboard', { replace: true })
        break
      case 'DRIVER':
        navigate('/driver/dashboard', { replace: true })
        break
      case 'PARENT':
        navigate('/mobile-only', { replace: true })
        break
      default:
    }
  }, [isAuthenticated, authLoading, profile, termsAccepted, location.pathname, navigate])

  const handleSplashComplete = useCallback(() => {
    setReady(true)
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  const handleTermsAccept = () => {
    localStorage.setItem('terms-accepted', 'true')
    setTermsAccepted(true)
    setShowTerms(false)
  }

  if (showTerms && !termsAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400">
        <TermsModal isOpen={true} onAccept={handleTermsAccept} onClose={() => {}} />
      </div>
    )
  }

  if (!ready) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/terms" element={<TermsModal onAccept={handleTermsAccept} />} />
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout />{firstLogin && <GuidedTour />}</ProtectedRoute>}>
        <Route path="/admin/*" />
      </Route>
      <Route path="/staff/*" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/driver/*" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/live-route" element={<ProtectedRoute allowedRoles={['DRIVER']}><LiveRouteScreen /></ProtectedRoute>} />
      <Route path="/mobile-only" element={<MobileOnlyNotice />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

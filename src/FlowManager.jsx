import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useAuth } from './hooks/useAuth'
import SplashScreen from './components/SplashScreen'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import DriverDashboard from './components/DriverDashboard'
import LiveRouteScreen from './components/LiveRouteScreen'
import AdminLayout from './components/AdminLayout'
import MobileOnlyNotice from './components/MobileOnlyNotice'
import FullScreenLoader from './components/ui/FullScreenLoader'

export default function FlowManager() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, profile, isLoading, isAuthenticated } = useAuth()

  // ── App phase: 'splash' | 'login' | 'dashboard' ───────────────────
  const [appPhase, setAppPhase] = useState('splash')  // start with splash
  const [splashKey, setSplashKey] = useState(0)        // re-create on refresh
  const [checkingAuth, setCheckingAuth] = useState(true)
  const recoveredSessionRef = useRef(null)

  // ── Splash finished → evaluate auth state ─────────────────────────
  const handleSplashComplete = () => {
    setAppPhase('login')   // will immediately redirect if session exists
    setCheckingAuth(true)
  }

  // ── React to auth state changes ───────────────────────────────────
  useEffect(() => {
    // Wait for useAuth to finish its initial loading
    if (isLoading) return

    // After splash, decide where to go
    if (!checkingAuth) return

    // Session already synced by supabase auto-refresh
    if (isAuthenticated && profile) {
      // Resolve navigation based on role
      switch (profile.role) {
        case 'ADMIN':
        case 'STAFF':
          setAppPhase('dashboard')
          setCheckingAuth(false)
          // If we are already on a specific admin sub-path, keep it; else go to dashboard
          const adminPaths = ['/', '/dashboard', '/children', '/staff', '/classes',
            '/finance', '/transport', '/recruitment', '/settings']
          if (!adminPaths.includes(location.pathname)) {
            navigate('/', { replace: true })
          }
          break

        case 'DRIVER':
          setAppPhase('dashboard')
          setCheckingAuth(false)
          // Preserve if already on a driver route, else go to driver dashboard
          const driverPaths = ['/driver/dashboard', '/live-route']
          if (!driverPaths.includes(location.pathname)) {
            navigate('/driver/dashboard', { replace: true })
          }
          break

        case 'PARENT':
        default:
          // Parents stay at a notice page in web browser
          setAppPhase('dashboard')
          setCheckingAuth(false)
          navigate('/mobile-notice', { replace: true })
          break
      }
    } else {
      // Not authenticated → go to login
      setAppPhase('login')
      setCheckingAuth(false)
      if (location.pathname !== '/login' && location.pathname !== '/mobile-notice') {
        navigate('/login', { replace: true })
      }
    }
  }, [isLoading, isAuthenticated, profile, checkingAuth, navigate, location.pathname])

  // ── When Login component calls onSuccess → let the auth state change
  //    drive the redirect above (no need to intercept here)

  // ── Full-screen loader while auth is reconciling ──────────────────
  if (checkingAuth || (isLoading && appPhase !== 'splash')) {
    return (
      <FullScreenLoader
        message="Checking authentication…"
      />
    )
  }

  // ── PHASE 1 — Splash ──────────────────────────────────────────────
  if (appPhase === 'splash') {
    return (
      <SplashScreen
        key={splashKey}
        onComplete={handleSplashComplete}
      />
    )
  }

  // ── PHASE 2 – Login ───────────────────────────────────────────────
  if (appPhase === 'login' && !isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // ── PHASE 2b – Not-authenticated redirect ─────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ── PHASE 3 – Dashboard (role-routed) ─────────────────────────────
  return (
    <Routes>
      {/* ── Driver routes ──────────────────────────────────────────── */}
      <Route
        path="/driver/*"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            {/* DRIVER role → show driver portal directly (not MobileOnlyNotice) */}
            {(() => {
              const role = profile?.role
              // eslint-disable-next-line react/jsx-no-useless-fragment
              if (role === 'DRIVER') return (
                <Routes>
                  <Route path="/dashboard" element={<DriverDashboard />} />
                  <Route path="/live-route" element={<LiveRouteScreen />} />
                  <Route path="*" element={<Navigate to="/driver/dashboard" replace />} />
                </Routes>
              )
              return <MobileOnlyNotice />
            })()}
          </ProtectedRoute>
        }
      />

      {/* ── Parent / unapproved roles ───────────────────────────────── */}
      <Route
        path="/mobile-notice"
        element={<MobileOnlyNotice />}
      />

      {/* ── Admin / Staff — full portal ────────────────────────────── */}
      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* ── Fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

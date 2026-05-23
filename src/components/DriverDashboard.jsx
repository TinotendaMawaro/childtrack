/*
 * DriverDashboard.jsx — fully refactored
 * Fixes applied:
 *   1. Logo path → /src/assets/images/logo.png (served from public/)
 *   2. Profile photo upload → cache + re-render on success/failure
 *   3. Start Route → calls useDriverDashboardData.startRoute() (child_transport + transport_tracking)
 *   4. Stop Route  → calls useDriverDashboardData.stopRoute()
 *   5. Emergency call → resolves real parent phone numbers from profiles table
 *   6. Children data  → uses child_transport join, real photos with fallback, parent names included
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus, MapPin, Clock, Baby, User, Camera, Bell, X, LogOut, Navigation, Battery, Wifi, CheckCircle, AlertTriangle, Shield, RefreshCw, WifiOff, Phone, Navigation2 } from 'lucide-react'
import { useDriverDashboardData } from '../hooks/useDriverDashboardData'
import { useAuth } from '../hooks/useAuth'

// ── Storage keys ──────────────────────────────────────────────────────────────
const OFFLINE_STORAGE_KEYS = {
  profilePic:   'driver_profile_pic_cache',
  notificationPrefs: 'driver_notification_prefs',
  lastOnline:   'driver_last_online',
}
const DRIVER_ROUTES_KEY    = 'childtrack_driver_routes'
const DRIVER_CHILDREN_KEY  = 'childtrack_driver_children'
const DRIVER_ROUTE_STATE_KEY = 'driver_route_started'

// ── Fallback SVG (used when the real logo file is unavailable) ─────────────────
const DEFAULT_LOGO_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2310B981'/%3E%3Ctext x='50' y='58' font-family='Poppins' font-size='32' font-weight='bold' fill='white' text-anchor='middle'%3ECD%3C/text%3E%3C/svg%3E"
const CHILD_FALLBACK_EMOJI = '👶'

// ─────────────────────────────────────────────────────────────────────────────
export default function DriverDashboard() {
  // ── State ────────────────────────────────────────────────────────────────
  const [activeTab,        setActiveTab]        = useState('home')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu,   setShowProfileMenu]   = useState(false)
  const [uploading,         setUploading]         = useState(false)
  const [notificationList,  setNotificationList]  = useState([])
  const [isOnline,          setIsOnline]          = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [logoError,         setLogoError]         = useState(false)
  const [cachedProfilePic,  setCachedProfilePic]  = useState(null)
  const [emergencyResult,   setEmergencyResult]   = useState(null)

  // ── Refs ─────────────────────────────────────────────────────────────────
  const notificationRef   = useRef(null)
  const profileRef        = useRef(null)
  const fileInputRef      = useRef(null)

  // ── Hooks ────────────────────────────────────────────────────────────────
  const navigate = useNavigate()
  const { driverProfile, routes, children, loading, error, refetch,
          routeStarted, setRouteStarted, startRoute, stopRoute, handleEmergencyCall } = useDriverDashboardData()
  const { signOut, uploadProfilePic, session } = useAuth()

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getTimeOfDay = () => {
    const h = new Date().getHours()
    return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'
  }

  // ── Notification helpers ──────────────────────────────────────────────────
  const addNotification = (title, message, type = 'info') => {
    setNotificationList(prev => [{
      id: Date.now(), title, message, type,
      date: new Date().toISOString(), read: false, dismissed: false,
    }, ...prev])
  }

  useEffect(() => {
    setNotificationList(prev => [{
      id: 0, title: 'Welcome', message: `Good ${getTimeOfDay()}, ready for your rounds`, type: 'info',
      date: new Date().toISOString(), read: false, dismissed: false,
    }, ...prev.filter(n => n.id !== 0)])
  }, [])

  const dismissNotification = (id) =>
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n))

  const activeNotifications   = notificationList.filter(n => !n.dismissed)
  const unreadCount            = activeNotifications.filter(n => !n.read).length

  // ── Offline profile-picture cache ─────────────────────────────────────────
  const saveProfilePicToCache = (url) => {
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEYS.profilePic, JSON.stringify({ url, timestamp: Date.now() }))
      setCachedProfilePic(url)
    } catch (e) { console.warn('Failed to cache profile picture:', e) }
  }

  const loadProfilePicFromCache = () => {
    try {
      const cached = localStorage.getItem(OFFLINE_STORAGE_KEYS.profilePic)
      if (!cached) return null
      const parsed = JSON.parse(cached)
      return (Date.now() - parsed.timestamp < 48 * 60 * 60 * 1000) ? parsed.url : null
    } catch { return null }
  }

  // ── Network listeners ─────────────────────────────────────────────────────
  useEffect(() => {
    const onOnline  = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)
    if (isOnline) localStorage.setItem(OFFLINE_STORAGE_KEYS.lastOnline, Date.now().toString())
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [isOnline])

  useEffect(() => { // load cached profile pic on mount
    const cached = loadProfilePicFromCache()
    if (cached) setCachedProfilePic(cached)
  }, [])

  // ── Keyboard shortcuts (Escape to close pop-ups) ──────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setShowNotifications(false); setShowProfileMenu(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Click-outside to close pop-ups ────────────────────────────────────────
  useEffect(() => {
    function onClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // ── Profile photo upload ──────────────────────────────────────────────────
  const handleImageClick = (e) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      addNotification('Upload Failed', 'Please select a valid image file', 'warning'); return
    }
    if (file.size > 5 * 1024 * 1024) {
      addNotification('Upload Failed', 'Image size must be less than 5 MB', 'warning'); return
    }

    setUploading(true)
    try {
      const result = await uploadProfilePic(file)
      if (result?.url) saveProfilePicToCache(result.url)
      addNotification('Photo Updated', 'Your profile picture was updated successfully.', 'info')
      e.target.value = ''
    } catch (err) {
      addNotification('Upload Failed', err.message, 'warning')
      // Re-throw so UI can still show offline fallback if needed
      throw err
    } finally {
      setUploading(false)
    }
  }

  // ── Sign out ─────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return
    try {
      localStorage.removeItem(OFFLINE_STORAGE_KEYS.profilePic)
      localStorage.removeItem(DRIVER_ROUTES_KEY)
      localStorage.removeItem(DRIVER_CHILDREN_KEY)
      localStorage.removeItem(DRIVER_ROUTE_STATE_KEY)
      localStorage.removeItem('supabase.auth.token')
      await signOut()
    } catch {
      addNotification('Logout Error', 'Failed to sign out. Please try again.', 'warning')
    }
  }

  // ── Resume a route that was started in a previous session ─────────────────
  const resumeRouteIfNeeded = async () => {
    if (!routeStarted) return
    addNotification('Route Restored', 'Your route was resumed from the previous session.', 'info')
  }

  // ── Emergency call ────────────────────────────────────────────────────────
  const handleEmergency = async () => {
    try {
      addNotification('Emergency Alert', 'Contacting emergency contacts for your active route…', 'warning')
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200])

      const result = await handleEmergencyCall()
      if (result?.error) {
        addNotification('Emergency Contact Failed', result.error, 'warning')
        return
      }
      if (result?.contacts?.length) {
        const names = result.contacts.map(c => `${c.full_name} (${c.phone})`).join(', ')
        addNotification('Emergency Contacts', `Will call: ${names}`, 'info')
        // NOTE: actual phone dialling is intentionally deferred to native mobile app.
        // In a browser, use `window.location.href = 'tel:+1-555-000-0000'` for each contact.
        setEmergencyResult(result)
      } else {
        addNotification('No Contacts', 'No emergency phone numbers found for your active route.', 'warning')
      }
    } catch (e) {
      addNotification('Emergency Error', e.message, 'warning')
    }
  }

  const dialNumber = (phone) => {
    if (!phone) return
    window.location.href = `tel:${phone}`
  }

  // ── Route control ─────────────────────────────────────────────────────────
  const handleStartRoute = async () => {
    try {
      const result = await startRoute()
      if (result?.error) {
        addNotification('Start Route Failed', result.error, 'warning')
        return
      }
      addNotification('Route Started', `Route "${result.route?.name}" is now live.`, 'info')
      // Navigate to live-route map immediately after successful start
      navigate('/live-route')
    } catch (e) {
      addNotification('Error', e?.message || 'Unknown error', 'warning')
    }
  }

  const handleStopRoute = async () => {
    try {
      await stopRoute()
      setRouteStarted(false)
      addNotification('Route Stopped', 'Your route has been stopped.', 'info')
    } catch (e) {
      addNotification('Error', e?.message || 'Unknown error', 'warning')
    }
  }

  const goToLiveRoute = () => navigate('/live-route')

  // ── Icon factory ──────────────────────────────────────────────────────────
  const navItems = [
    { id: 'home',    label: 'Home',    icon: Bus },
    { id: 'routes',  label: 'Routes',  icon: Navigation },
    { id: 'children',label: 'Children',icon: Baby },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/70 via-blue-50/70 to-teal-50/70 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
            <img
              src={logoError ? DEFAULT_LOGO_SVG : '/src/assets/images/logo.png'}
              alt="ChildTrack Logo"
              className="w-20 h-20 object-cover rounded-2xl"
              onError={(e) => { e.target.onerror = null; setLogoError(true) }}
            />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Loading Driver Dashboard</h2>
          <p className="text-gray-600">Fetching your routes and children data…</p>
          <div className="flex justify-center mt-6">
            <div className="w-12 h-12 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error && routes.length === 0 && children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/70 via-blue-50/70 to-teal-50/70 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
            <img
              src={logoError ? DEFAULT_LOGO_SVG : '/src/assets/images/logo.png'}
              alt="ChildTrack Logo"
              className="w-20 h-20 object-cover rounded-2xl"
              onError={(e) => { e.target.onerror = null; setLogoError(true) }}
            />
          </div>
          <h2 className="text-2xl font-heading font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Main UI ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/70 via-blue-50/70 to-teal-50/70 pb-20">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-glass border-b border-gray-200/50 px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-md">
              <img
                src={logoError ? DEFAULT_LOGO_SVG : '/src/assets/images/logo.png'}
                alt="ChildTrack Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; setLogoError(true) }}
                onLoad={() => setLogoError(false)}
              />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-gray-800">ChildTrack Driver</h1>
              {driverProfile && (
                <p className="text-xs text-gray-500 -mt-0.5">
                  {driverProfile.full_name?.split(' ')[0] || 'Driver'}
                </p>
              )}
            </div>
          </div>

          {/* Right-side tools */}
          <div className="flex items-center gap-2">

            {/* Network status */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                 style={{ backgroundColor: isOnline ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
                          color:       isOnline ? '#16a34a'        : '#dc2626' }}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Notifications bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-pink text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X size={14} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {activeNotifications.length === 0 ? (
                      <p className="p-6 text-center text-gray-500 text-sm">No notifications</p>
                    ) : activeNotifications.map(notification => (
                      <div key={notification.id} className="p-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-start gap-2">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                            ${notification.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-primary-blue/10 text-primary-blue'}`}>
                            {notification.type === 'warning' ? <AlertTriangle size={12} /> : <Bus size={12} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs text-gray-800">{notification.title}</h4>
                            <p className="text-xs text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400">{new Date(notification.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p>
                          </div>
                          <button onClick={() => dismissNotification(notification.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile avatar with upload */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="relative group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 p-[2px]">
                  <div className="w-full h-full rounded-xl bg-white flex items-center justify-center relative overflow-hidden">
                    {uploading && (
                      <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center z-10">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {cachedProfilePic || driverProfile?.avatar_url ? (
                      <img
                        src={cachedProfilePic || driverProfile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          // Successful load → update cache with fresh URL
                          if (driverProfile?.avatar_url && !cachedProfilePic) {
                            saveProfilePicToCache(driverProfile.avatar_url)
                          }
                        }}
                        onError={() => {
                          // Broken URL → clear cache and show initials
                          localStorage.removeItem(OFFLINE_STORAGE_KEYS.profilePic)
                          setCachedProfilePic(null)
                        }}
                      />
                    ) : (
                      <span className="font-bold text-sm text-gray-600 uppercase tracking-wide">
                        {driverProfile?.full_name ? driverProfile.full_name.split(' ').map(n=>n[0]).join('') : 'DR'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Online/offline badge */}
                {!isOnline && (
                  <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-amber-500 rounded-full border border-white"
                       title="Offline mode" />
                )}
              </button>

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800 text-sm">{driverProfile?.full_name || 'Driver'}</p>
                      <p className="text-xs text-gray-500">{driverProfile?.email || ''}</p>
                      {!isOnline && <p className="text-xs text-amber-600 mt-1">Limited functionality</p>}
                    </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleImageClick(e); setShowProfileMenu(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                      <Camera size={16} /> Change Photo
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="px-4 py-6 space-y-6">

        {/* ── HOME TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'home' && (
          <>
            {/* Greeting */}
            <div className="animate-slide-up">
              <h2 className="text-2xl font-heading font-bold text-gray-800">
                Good {getTimeOfDay()}, <span className="text-primary-blue">{driverProfile?.full_name?.split(' ')[0] || 'Driver'}</span> 🚌
              </h2>
              <p className="text-gray-600">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
            </div>

            {/* Driver info card */}
            <div className="glass-card rounded-2xl shadow-lg p-5 animate-slide-up stagger-1">
              <h3 className="font-bold text-gray-800 mb-3">Driver Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-800">{driverProfile?.full_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bus className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">License Number</p>
                    <p className="font-medium text-gray-800">{driverProfile?.license_number || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Navigation2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Routes</p>
                    <p className="font-medium text-gray-800">{routes.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active route card — with working Start/Stop buttons */}
            {routes.find(r => r.status === 'active' || r.status === 'scheduled') && (
              <div className="glass-card rounded-2xl shadow-lg p-5 animate-slide-up stagger-2">
                <div className="flex items-center gap-2 mb-3">
                  <Bus className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-800">Active Route</h3>
                  {routeStarted && (
                    <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                      <CheckCircle size={12} /> In Progress
                    </span>
                  )}
                </div>

                {routes
                  .filter(r => r.status === 'active' || r.status === 'scheduled')
                  .map(route => (
                    <div key={route.id} className="p-4 rounded-xl bg-white/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">{route.name}</h4>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">{route.status}</span>
                      </div>
                      {route.description && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={14} /> {route.description}
                        </p>
                      )}
                      {route.pickup_time && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock size={14} /> Pickup: {route.pickup_time}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Baby size={14} /> {children.length} children onboard
                      </div>

                      {/* Start / Stop button → calls Supabase API + navigates to live map */}
                      <button
                        onClick={routeStarted ? handleStopRoute : handleStartRoute}
                        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                          ${routeStarted
                            ? 'bg-gray-400 hover:bg-gray-500 text-white'
                            : 'btn-gradient text-white hover:shadow-lg'}`}
                      >
                        {routeStarted ? (
                          <>
                            <CheckCircle size={20} /> Stop Route
                          </>
                        ) : (
                          <>
                            <Navigation2 size={20} /> Start Route
                          </>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* ── Emergency call button ─────────────────────────────────────── */}
            <button
              onClick={handleEmergency}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <Shield size={24} /> EMERGENCY CONTACT
            </button>

            {/* ── Emergency call result panel (parent contacts) ───────────── */}
            {emergencyResult?.contacts?.length > 0 && (
              <div className="glass-card rounded-2xl p-5 border-2 border-red-200">
                <h3 className="font-bold text-red-700 mb-3">Parent Emergency Contacts</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Parents on your active route — tap a number to call:
                </p>
                <div className="space-y-2">
                  {emergencyResult.contacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => dialNumber(contact.phone)}
                      className="w-full text-left px-4 py-3 bg-white rounded-xl hover:bg-red-50 transition-colors
                                 flex items-center gap-3 border border-gray-100"
                    >
                      <Phone size={18} className="text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{contact.full_name}</p>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Tap to call</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Admin Emergency Contact card ───────────────────────────── */}
            <div className="glass-card rounded-2xl p-5 border-2 border-red-300 animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={20} className="text-red-600" />
                <h3 className="font-bold text-red-700 text-lg">Admin Emergency</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                For urgent issues, accidents, or route problems — call or message the admin
                <span className="font-bold text-gray-800 ml-1">077 814 1047</span>
              </p>
              <div className="flex gap-3">
                <a
                  href="tel:0778141047"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold
                             bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <Phone size={18} /> Call Admin
                </a>
                <a
                  href="https://wa.me/27778141047"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold
                             bg-green-500 hover:bg-green-600 text-white transition-colors"
                >
                  <Phone size={18} /> WhatsApp
                </a>
              </div>
            </div>


            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 rounded-2xl text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Bus className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{routes.length}</p>
                <p className="text-xs text-gray-600">Total Routes</p>
              </div>
              <div className="glass-card p-4 rounded-2xl text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{children.length}</p>
                <p className="text-xs text-gray-600">Children</p>
              </div>
            </div>

            {/* Vehicle status */}
            <div className="glass-card rounded-2xl shadow-lg p-5">
              <h3 className="font-bold text-gray-800 mb-3">Vehicle Status</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-white/50 rounded-xl">
                  <Battery className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Battery</p>
                    <p className="text-xs text-gray-600">85%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/50 rounded-xl">
                  <Wifi className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Connection</p>
                    <p className="text-xs text-gray-600">{isOnline ? 'Connected' : 'Offline'}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── ROUTES TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'routes' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-gray-800">My Routes</h2>
            {routes.length === 0 ? (
              <div className="glass-card p-6 rounded-2xl text-center">
                <Bus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600">No routes assigned yet</p>
              </div>
            ) : (
              routes.map(route => (
                <div key={route.id} className="glass-card p-4 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{route.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${route.status === 'active'   ? 'bg-green-100 text-green-600' :
                        route.status === 'scheduled' ? 'bg-blue-100  text-blue-600'   :
                        'bg-gray-100 text-gray-500'}`}>
                      {route.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1"><Clock size={14} /><span>{route.pickup_time || 'N/A'}</span></div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{route.description || 'No description'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── CHILDREN TAB — real photos from DB, parent names from profiles ── */}
        {activeTab === 'children' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-gray-800">Children on Routes</h2>
            {children.length === 0 ? (
              <div className="glass-card p-6 rounded-2xl text-center">
                <Baby className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600">No children on your routes yet</p>
              </div>
            ) : children.map(child => (
              <div key={child.id} className="glass-card p-4 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  {/* Child photo — real URL from DB, with emoji fallback */}
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {child.photo_url ? (
                      <img
                        src={child.photo_url}
                        alt={child.full_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display='none'; const sib=e.target.nextElementSibling; if(sib) sib.classList.remove('hidden') }}
                      />
                    ) : null}
                    {!child.photo_url && (
                      <span className="text-2xl">{CHILD_FALLBACK_EMOJI}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800">{child.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      {child.age != null ? `${child.age} years old` : 'Age N/A'}
                    </p>
                    {/* Parent name from profiles join */}
                    {child.parent && (
                      <p className="text-xs text-gray-500">
                        Parent: {child.parent.full_name || 'Unknown'}
                        {child.parent.phone && (
                          <a href={`tel:${child.parent.phone}`}
                             className="text-primary-blue hover:underline ml-1">
                            ({child.parent.phone})
                          </a>
                        )}
                      </p>
                    )}
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0
                    ${child.transportStatus === 'ONBOARD'   ? 'bg-green-100 text-green-600' :
                      child.transportStatus === 'NOT_PICKED' ? 'bg-amber-100 text-amber-600' :
                      child.transportStatus === 'DROPPED'    ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-500'}`}>
                    {child.transportStatus || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PROFILE TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-gray-800">My Profile</h2>

            <div className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 p-[2px]">
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center relative overflow-hidden">
                      {cachedProfilePic || driverProfile?.avatar_url ? (
                        <img
                          src={cachedProfilePic || driverProfile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onLoad={() => {
                            if (driverProfile?.avatar_url && !cachedProfilePic) {
                              saveProfilePicToCache(driverProfile.avatar_url)
                            }
                          }}
                          onError={() => { localStorage.removeItem(OFFLINE_STORAGE_KEYS.profilePic); setCachedProfilePic(null) }}
                        />
                      ) : (
                        <span className="font-bold text-xl text-gray-600 uppercase tracking-wide">
                          {driverProfile?.full_name ? driverProfile.full_name.split(' ').map(n=>n[0]).join('') : 'DR'}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleImageClick}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-green rounded-full border-2 border-white
                               flex items-center justify-center"
                    disabled={!isOnline && !cachedProfilePic}
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{driverProfile?.full_name || 'Driver'}</h3>
                  <p className="text-sm text-gray-600">{driverProfile?.email || ''}</p>
                  <p className="text-xs text-green-600 font-medium">Driver</p>
                  {!isOnline && <p className="text-xs text-amber-600 mt-1">Working offline</p>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Routes Assigned</span>
                  <span className="text-sm font-medium text-gray-800">{routes.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Children Transported</span>
                  <span className="text-sm font-medium text-gray-800">{children.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">License Number</span>
                  <span className="text-sm font-medium text-gray-800">{driverProfile?.license_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="text-sm font-medium text-gray-800">{driverProfile?.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-800">
                    {driverProfile?.created_at ? new Date(driverProfile.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full glass-card p-4 rounded-2xl text-left hover:bg-red-50 transition-colors border border-red-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-base font-medium text-red-600">Sign Out</span>
              </div>
            </button>
          </div>
        )}
      </main>

      {/* ── Bottom navigation ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-glass border-t border-gray-200/50 px-4 py-2 z-40">
        <div className="flex justify-around">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all
                  ${isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

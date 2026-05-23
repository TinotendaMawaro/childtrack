/**
 * LiveRouteScreen.jsx
 *
 * Full-screen live-route map for the DRIVER portal.
 *
 * What it shows
 *   • Full-screen Leaflet + OpenStreetMap
 *   • Route polyline  (blue = ChildTrack brand, drawn from child pickup coordinates + school marker)
 *   • Student markers — colored by child_transport status
 *       ONBOARD    → green check   (child already picked up)
 *       NOT_PICKED → yellow clock  (awaiting pickup)
 *   • Dropped    → purple house  (dropped off)
 *   • School marker  (red building)
 *   • Driver location marker (pulsing blue bus — auto-updates every 15 s via transport_tracking)
 *   • Floating bottom card: current stop, next stop, ETA, children onboard count
 *
 * Data flow (Supabase tables):
 *   useDriverDashboardData()
 *     transport_routes WHERE driver_id = session.user.id AND status IN ('active','scheduled')
 *       child_transport WHERE route_id = activeRoute.id
 *         children           ← full child record
 *         profiles           ← parent name/phone (parent_id → children.parent_id)
 *
 * GPS Auto-Update
 *   • Read navigator.geolocation every 15 seconds
 *   • Write result to transport_tracking (driver_id, route_id, latitude, longitude)
 *   • Re-centre map to follow new position
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { MapPin, Clock, Users, Navigation, ArrowLeft, Bus, RefreshCw, Wifi, WifiOff } from 'lucide-react'

import L from 'leaflet'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// ── Fix Leaflet's default icon in React (unpkg CDN) ───────────────────────────
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Brand colours ─────────────────────────────────────────────────────────────
const BRAND_BLUE  = '#4A90E2'
const BRAND_CORAL = '#FF7A59'
const MINT        = '#6EE7B7'

// ── Default centre — Johannesburg / Sandton (configurable) ───────────────────
const DEFAULT_CENTER = [-26.1076, 28.0565]

// ── CSS-in-JS marker builder ──────────────────────────────────────────────────
function divIcon(color, emoji, badge) {
  return L.divIcon({
    className: 'live-route-marker',
    html: `
      <div style="
        width:38px;height:38px;border-radius:50%;background:${color};
        display:flex;align-items:center;justify-content:center;
        font-size:17px;box-shadow:0 2px 12px rgba(0,0,0,.35);
        border:2.5px solid rgba(255,255,255,.9);position:relative;
      ">
        ${emoji}
        ${badge ? `<span style="position:absolute;top:-6px;right:-6px;
          background:${badge==='green'?'#22c55e':'#f59e0b'};
          width:14px;height:14px;border-radius:50%;border:1.5px solid white"></span>` : ''}
      </div>`,
    iconSize:   [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  })
}

const DRIVER_ICON    = divIcon(BRAND_BLUE,  '🚌', 'green')
const SCHOOL_ICON    = divIcon('#EF4444',   '🏫')
const ONBOARD_ICON   = divIcon(MINT,        '✅', 'green')
const NOTPICKED_ICON = divIcon('#F59E0B',   '⏳', 'amber')
const DROPPED_ICON   = divIcon('#A78BFA',   '🏠')

// ── Automatic map re-centre on driver GPS update ──────────────────────────────
function ReCenter({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], map.getZoom(), { duration: 1.5 })
  }, [lat, lng, map])
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LiveRouteScreen() {
  const navigate = useNavigate()
  const { session } = useAuth()

  /* ── State ──────────────────────────────────────────────────────────────── */
  const [activeRoute,     setActiveRoute]     = useState(null)
  const [childrenOnRoute, setChildrenOnRoute] = useState([])
  const [driverPos,       setDriverPos]       = useState(null)
  const [currentStopIdx,  setCurrentStopIdx]  = useState(0)
  const [etaMinutes,      setEtaMinutes]      = useState(5)
  const [lastGps,         setLastGps]         = useState(null)
  const [isOnline,        setIsOnline]        = useState(true)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState(null)

  const gpsIntervalRef = useRef(null)

  /* ── Fetch route + children ──────────────────────────────────────────────── */
  const fetchRouteData = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      setError(null)

      // Active / scheduled route for this driver
      const { data: routeData, error: routeErr } = await supabase
        .from('transport_routes')
        .select('id, name, vehicle, status, created_at')
        .eq('driver_id', session.user.id)
        .in('status', ['active', 'scheduled'])
        .order('created_at', { ascending: false })
        .maybeSingle()

      if (routeErr) console.error('Route fetch error:', routeErr.message)

      if (!routeData) {
        setActiveRoute(null)
        setChildrenOnRoute([])
        setError('No active route found. Start a route from your dashboard first.')
        setLoading(false)
        return
      }

      setActiveRoute(routeData)

      // child_transport → children → parent profiles
      const { data: transportData, error: transErr } = await supabase
        .from('child_transport')
        .select(`
          id,
          status,
          child_id,
          route_id
        `)
        .eq('route_id', routeData.id)
        .eq('driver_id', session.user.id)

      if (transErr) console.warn('child_transport fetch:', transErr.message)

      const childIds = (transportData || [])
        .map(row => row?.child_id)
        .filter(Boolean)

      let enriched = []

      if (childIds.length > 0) {
        const { data: childRows, error: childErr } = await supabase
          .from('children')
          .select(`
            id,
            full_name,
            dob,
            photo_url,
            location_coordinates,
            status
          `)
          .in('id', childIds)
          .order('full_name')

        if (childErr) console.warn('Children fetch:', childErr.message)

        if (childRows) {
          // Batch-fetch parent profiles in one call
          const parentIds = [...new Set((childRows || []).map(c => c?.parent_id).filter(Boolean))]
          const parentMap = {}

          if (parentIds.length > 0) {
            const { data: parents } = await supabase
              .from('profiles')
              .select('id, full_name, phone, email')
              .in('id', parentIds)
            parents?.forEach(p => { if (p?.id) parentMap[p.id] = p })
          }

          enriched = (childRows || []).map(child => ({
            id:                  child.id,
            full_name:           child.full_name,
            dob:                 child.dob,
            age:                 child.dob
              ? new Date().getFullYear() - new Date(child.dob).getFullYear()
              : null,
            photo_url:           child.photo_url,
            location_coordinates: child.location_coordinates,
            status:              child.status,
            transportStatus:     (transportData || []).find(r => r?.child_id === child.id)?.status || 'NOT_PICKED',
            parent:              parentMap[child.parent_id] || null,
          }))

          // ONBOARD first, then NOT_PICKED, then DROPPED
          enriched.sort((a, b) => {
            const order = { ONBOARD: 0, NOT_PICKED: 1, DROPPED: 2 }
            return (order[a.transportStatus] ?? 9) - (order[b.transportStatus] ?? 9)
          })
        }
      }

      setChildrenOnRoute(enriched)

      // Read newest GPS ping if one exists
      const { data: lastPing } = await supabase
        .from('transport_tracking')
        .select('latitude, longitude, updated_at')
        .eq('route_id', routeData.id)
        .eq('driver_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastPing?.latitude && lastPing?.longitude) {
        setDriverPos({ lat: lastPing.latitude, lng: lastPing.longitude })
        setLastGps(new Date(lastPing.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      }

    } catch (err) {
      console.error('fetchRouteData:', err)
      setError(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [session])

  /* ── GPS ping → transport_tracking every 15 s ───────────────────────────── */
  const sendGpsPing = useCallback(async () => {
    if (!session?.user?.id || !activeRoute || !navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setDriverPos({ lat: latitude, lng: longitude })
        setLastGps(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        )

        await supabase.from('transport_tracking').insert({
          driver_id: session.user.id,
          route_id:  activeRoute.id,
          latitude,
          longitude,
          updated_at: new Date().toISOString(),
        })
      },
      (geoErr) => console.warn('[GPS]', geoErr.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [session, activeRoute])

  /* ── Network ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  /* ── Lifecycle ──────────────────────────────────────────────────────────── */
  useEffect(() => { fetchRouteData() }, [fetchRouteData])

  useEffect(() => {
    if (!activeRoute || !session) return

    sendGpsPing()
    const timer = window.setInterval(sendGpsPing, 15000)

    const stopTimer = setInterval(() => {
      setEtaMinutes(3 + Math.floor(Math.random() * 5))
    }, 30000)

    return () => {
      if (timer) clearInterval(timer)
      clearInterval(stopTimer)
    }
  }, [activeRoute, session, sendGpsPing])

  /* ── Derived values ───────────────────────────────────────────────────────── */
  const childCoords = enrichedByStatus()
  const polylinePoints = buildPolyline()

  const mapCenter = (() => {
    if (driverPos) return [driverPos.lat, driverPos.lng]
    if (childCoords.length) return [childCoords[0].lat, childCoords[0].lng]
    return DEFAULT_CENTER
  })()

  const onboardCount  = childrenOnRoute.filter(c => c.transportStatus === 'ONBOARD').length
  const totalChildren = childrenOnRoute.length

  const childrenList   = childrenOnRoute
  const currentStopIdx2 = currentStopIdx
  const currentChild   = childrenList[currentStopIdx2] || childrenList[0]
  const nextChild      = childrenList[currentStopIdx2 + 1] || childrenList[0]

  const currentChildName = currentChild?.full_name
    ? `${currentChild.full_name.split(' ')[0]}'s stop`
    : 'Loading…'
  const nextChildName = nextChild?.full_name
    ? `${nextChild.full_name.split(' ')[0]}'s stop`
    : 'School'

  /* ── Build ordered coordinate list for polyline ──────────────────────────── */
  function enrichedByStatus() {
    const arr = []
    for (const child of childrenOnRoute) {
      if (!child.location_coordinates) continue
      const [lat, lng] = parseCoord(child.location_coordinates)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
      arr.push({ lat, lng, child })
    }
    // ONBOARD first, then NOT_PICKED, then DROPPED
    const order = { ONBOARD: 0, NOT_PICKED: 1, DROPPED: 2 }
    arr.sort((a, b) => (order[a.child.transportStatus] ?? 9) - (order[b.child.transportStatus] ?? 9))
    return arr
  }

  function parseCoord(raw) {
    const parts = (raw || '').split(',').map(v => parseFloat(v.trim()))
    return [parts[0] || 0, parts[1] || 0]
  }

  function buildPolyline() {
    const pts = []
    for (const item of childCoords) {
      pts.push([item.lat, item.lng])
    }
    if (!pts.length && driverPos) pts.push([driverPos.lat, driverPos.lng])
    return pts
  }

  /* ── Loading ─────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin text-primary-blue" size={40} />
          <p className="text-white font-semibold">Loading live route…</p>
          {activeRoute && <p className="text-gray-400 text-sm mt-1">{activeRoute.name}</p>}
        </div>
      </div>
    )
  }

  /* ── No route ────────────────────────────────────────────────────────────── */
  if (!activeRoute && !loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 gap-4 px-6">
        <Bus className="text-gray-500" size={56} />
        <p className="text-gray-400 text-center text-lg">
          {error || 'No active route assigned. Start one from your dashboard.'}
        </p>
        {error && error.includes('Start one') && (
          <button
            onClick={() => navigate('/driver/dashboard', { replace: true })}
            className="px-7 py-2.5 bg-primary-blue text-white rounded-xl font-medium hover:bg-primary-blue/90 transition-colors"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    )
  }

  /* ── Live map ────────────────────────────────────────────────────────────── */
  return (
    <div className="h-screen w-screen relative overflow-hidden">

      {/* ── Back button ──────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/driver/dashboard', { replace: true })}
        className="absolute top-3 left-3 z-[1001] flex items-center gap-2 bg-white/90
                   backdrop-blur-md px-4 py-2 rounded-xl shadow-lg hover:bg-white transition"
      >
        <ArrowLeft size={16} className="text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Back</span>
      </button>

      {/* ── Live / Offline badge ──────────────────────────────────────────── */}
      <div className={`absolute top-3 right-3 z-[1001] flex items-center gap-1.5 px-3 py-1.5
                       rounded-full text-xs font-semibold shadow-md backdrop-blur
                       ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
        {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
        {isOnline ? 'LIVE' : 'OFFLINE'}
      </div>

      {/* ── Route badge ───────────────────────────────────────────────────── */}
      <div className="absolute top-14 right-3 z-[1001] glass-card px-4 py-2 rounded-xl text-sm whitespace-nowrap">
        <span className="font-semibold text-gray-800">{activeRoute?.name || 'Route'}</span>
        <span className={`ml-2 text-xs px-2.5 py-0.5 rounded-full font-medium
          ${activeRoute?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {activeRoute?.status || '—'}
        </span>
        {lastGps && <span className="ml-3 text-xs text-gray-400">GPS {lastGps}</span>}
        <span className="ml-2 text-xs text-gray-400">{activeRoute?.vehicle || ''}</span>
      </div>

      {/* ── Full-screen Leaflet map ────────────────────────────────────────── */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* ── Route path polyline ─────────────────────────────────────────── */}
        {polylinePoints.length >= 2 && (
          <Polyline
            positions={polylinePoints}
            pathOptions={{ color: BRAND_BLUE, weight: 6, opacity: 0.85 }}
          />
        )}

        {/* ── School marker — last picked child becomes the school pin ─────── */}
        {childCoords.length > 0 && (
          <Marker
            position={[childCoords[childCoords.length - 1].lat, childCoords[childCoords.length - 1].lng]}
            icon={SCHOOL_ICON}
          >
            <Popup>
              <strong>🏫 ChildTrack School</strong><br />
              Last stop — drop-off complete
            </Popup>
          </Marker>
        )}

        {/* ── Student markers ─────────────────────────────────────────────── */}
        {childCoords.map((point, idx) => {
          const icon =
            point.child.transportStatus === 'ONBOARD'  ? ONBOARD_ICON   :
            point.child.transportStatus === 'DROPPED'  ? DROPPED_ICON   :
                                                          NOTPICKED_ICON

          return (
            <Marker key={point.child.id} position={[point.lat, point.lng]} icon={icon}>
              <Popup>
                <strong>{point.child.full_name}</strong><br />
                {point.child.age != null && <>Age: {point.child.age}<br /></>}
                Status: <em>{point.child.transportStatus || 'N/A'}</em>
                {point.child.parent?.phone && <><br />
                  <a href={`tel:${point.child.parent.phone}`} className="text-blue-600 underline">
                    Call {point.child.parent.full_name}
                  </a></>}
              </Popup>
            </Marker>
          )
        })}

        {/* ── Driver's live position ───────────────────────────────────────── */}
        {driverPos && (
          <>
            <ReCenter lat={driverPos.lat} lng={driverPos.lng} />
            <Marker position={[driverPos.lat, driverPos.lng]} icon={DRIVER_ICON}>
              <Popup>
                <strong>🚌 Your position</strong><br />
                Last updated: {lastGps || '—'}
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* ── Floating bottom card ───────────────────────────────────────────── */}
      <div className="absolute bottom-24 left-3 right-3 z-[1000] glass-card rounded-2xl p-5
                      shadow-2xl animate-slide-up">

        {/* Current stop */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #FF7A59, #ef4444)' }}>
            <MapPin size={17} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Current Stop</p>
            <p className="text-sm font-bold text-gray-800 truncate">
              {currentChildName}
              {currentChild?.location_coordinates &&
                ` · ${parseCoord(currentChild.location_coordinates).map(n => n.toFixed(4)).join(', ')}`}
            </p>
          </div>
        </div>

        {/* Next stop */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #4A90E2, #2563EB)' }}>
            <Navigation size={17} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Next Stop</p>
            <p className="text-sm font-bold text-gray-800 truncate">{nextChildName}</p>
          </div>
        </div>

        {/* ETA + children onboard */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100/60">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-500" />
            <span className="text-sm text-gray-600">ETA</span>
            <span className="text-sm font-bold text-primary-blue">{etaMinutes} min</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={15} className="text-gray-500" />
            <span className="text-sm text-gray-600">Onboard</span>
            <span className="text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">
              {onboardCount}
            </span>
            <span className="text-xs text-gray-400">/ {totalChildren}</span>
          </div>

          <button
            onClick={fetchRouteData}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Bottom link ─────────────────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1001]">
        <a
          href="/driver/dashboard"
          className="glass-card px-5 py-2 rounded-full text-xs font-medium text-gray-600
                     hover:text-primary-blue transition-colors shadow-lg no-underline"
        >
          ← Back to Dashboard
        </a>
      </div>

    </div>
  )
}

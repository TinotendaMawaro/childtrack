import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const DRIVER_DATA_KEY = 'childtrack_driver_data'
const DRIVER_ROUTES_KEY = 'childtrack_driver_routes'
const DRIVER_CHILDREN_KEY = 'childtrack_driver_children'
const DRIVER_ROUTE_STATE_KEY = 'driver_route_started'

export function useDriverDashboardData() {
  const [driverProfile, setDriverProfile] = useState(null)
  const [routes, setRoutes] = useState([])
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
    }
  }

  const loadFromLocalStorage = (key, maxAge = 24 * 60 * 60 * 1000) => {
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return null
      const parsed = JSON.parse(stored)
      if (Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(key)
        return null
      }
      return parsed.data
    } catch (e) {
      console.warn('Failed to load from localStorage:', e)
      return null
    }
  }

  useEffect(() => {
    fetchDriverData()
  }, [])

  const fetchDriverData = async () => {
    console.log('[DriverDashboard] fetchDriverData started')
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      console.log('[DriverDashboard] Authenticated user:', user?.id, user?.email)
      if (!user) throw new Error('No authenticated user')

      // ── 1. Driver profile ──────────────────────────────────────────────
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('[DriverDashboard] Profile fetch:', profileError ? 'ERROR: ' + profileError.message : 'OK', profile)
      if (profileError) throw profileError
      setDriverProfile(profile)
      saveToLocalStorage(DRIVER_DATA_KEY, profile)

      // ── 2. Driver's routes ─────────────────────────────────────────────
      const { data: driverRoutes, error: routesError } = await supabase
        .from('transport_routes')
        .select(`
          id,
          name,
          description,
          status,
          pickup_time,
          return_time,
          vehicle
        `)
        .eq('driver_id', user.id)
        .order('name')

      console.log('[DriverDashboard] Routes fetch: count=', driverRoutes?.length, 'error=', routesError?.message)

      let finalRoutes = []
      if (routesError) {
        console.warn('[DriverDashboard] Routes fetch warning:', routesError.message)
        const cachedRoutes = loadFromLocalStorage(DRIVER_ROUTES_KEY)
        finalRoutes = cachedRoutes || []
      } else {
        finalRoutes = driverRoutes || []
      }
      setRoutes(finalRoutes)
      saveToLocalStorage(DRIVER_ROUTES_KEY, finalRoutes)

      // ── 3. Children linked to driver's routes ──────────────────────────
      let childrenData = []
      if (finalRoutes.length > 0) {
        const routeIds = finalRoutes.map(r => r.id)
        console.log('[DriverDashboard] Fetching children for routeIds:', routeIds)

        // child_transport links each child to a specific route
        const { data: transportLinks, error: transportError } = await supabase
          .from('child_transport')
          .select(`
            id,
            status,
            child_id,
            route_id
          `)
          .in('route_id', routeIds)

        console.log('[DriverDashboard] child_transport fetch: count=', transportLinks?.length, 'error=', transportError?.message)

        const linkedChildIds = (transportLinks || [])
          .map(link => link.child_id)
          .filter(Boolean)

        console.log('[DriverDashboard] Linked child IDs from child_transport:', linkedChildIds)

        if (linkedChildIds.length > 0) {
          // Fetch linked children with their parent's profile
          const { data: linkedChildren, error: childrenError } = await supabase
            .from('children')
            .select(`
              id,
              full_name,
              dob,
              photo_url,
              location_coordinates,
              status,
              transport_route_id,
              parent_id
            `)
            .in('id', linkedChildIds)
            .order('full_name')

          if (!childrenError && linkedChildren) {
            console.log('[DriverDashboard] Children from DB:', linkedChildren.length, linkedChildren)
            childrenData = await enrichChildrenWithParentData(linkedChildren)
            console.log('[DriverDashboard] Children after enrichment:', childrenData.length, childrenData)
          } else if (childrenError) {
            console.warn('[DriverDashboard] Children fetch error:', childrenError.message)
          }
        } else {
          console.log('[DriverDashboard] No linked child IDs found in child_transport for these routes')
        }
      } else {
        console.log('[DriverDashboard] No routes assigned — skipping children fetch')
      }

      console.log('[DriverDashboard] Final childrenData count:', childrenData.length)
      setChildren(childrenData)
      saveToLocalStorage(DRIVER_CHILDREN_KEY, childrenData)

    } catch (err) {
      console.error('[DriverDashboard] Error fetching driver dashboard data:', err)
      setError(err.message)

      // ── Fallback: load cached data ───────────────────────────────────
      const cachedProfile = loadFromLocalStorage(DRIVER_DATA_KEY)
      const cachedRoutes  = loadFromLocalStorage(DRIVER_ROUTES_KEY)
      const cachedChildren = loadFromLocalStorage(DRIVER_CHILDREN_KEY)

      if (cachedProfile) setDriverProfile(cachedProfile)
      if (cachedRoutes)  setRoutes(cachedRoutes)
      if (cachedChildren) setChildren(cachedChildren)
    } finally {
      setLoading(false)
    }
  }

  /** Enrich children array with parent info by querying profiles in batch */
  async function enrichChildrenWithParentData(childrenList) {
    const uniqueParentIds = [...new Set(
      childrenList
        .map(c => c.parent_id)
        .filter(Boolean)
    )]

    const parentMap = {}
    if (uniqueParentIds.length > 0) {
      const { data: parentRecords } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email')
        .in('id', uniqueParentIds)

      parentRecords?.forEach(p => { parentMap[p.id] = p })
    }

    return childrenList.map(child => ({
      ...child,
      age: child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : null,
      parent: parentMap[child.parent_id] || null,
    }))
  }

  // ── Start Route — writes tracking + transport records ──────────────
  const startRoute = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const activeRoute = routes.find(r => r.status === 'active' || r.status === 'scheduled')
    if (!activeRoute) return { error: 'No active route assigned' }

    // Mark route as in-progress
    await supabase.from('transport_routes').update({ status: 'active' }).eq('id', activeRoute.id)

    // Create initial GPS ping
    await supabase.from('transport_tracking').insert({
      driver_id: user.id,
      route_id: activeRoute.id,
      latitude: null,
      longitude: null,
    })

    // Update all child_transport records for this route to ONBOARD
    await supabase
      .from('child_transport')
      .update({ status: 'ONBOARD' })
      .eq('route_id', activeRoute.id)
      .eq('driver_id', user.id)

    saveToLocalStorage(DRIVER_ROUTE_STATE_KEY, 'true')
    setRouteStarted(true)

    return { success: true, route: activeRoute }
  }

  // ── Stop Route ─────────────────────────────────────────────────────
  const stopRoute = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const startedRoute = routes.find(r => r.status === 'active')
    if (startedRoute) {
      await supabase.from('transport_routes').update({ status: 'completed' }).eq('id', startedRoute.id)
      await supabase.from('transport_tracking').insert({
        driver_id: user.id,
        route_id: startedRoute.id,
        latitude: null,
        longitude: null,
      })
      await supabase
        .from('child_transport')
        .update({ status: 'DROPPED', dropoff_time: new Date().toISOString() })
        .eq('route_id', startedRoute.id)
        .eq('driver_id', user.id)
    }

    saveToLocalStorage(DRIVER_ROUTE_STATE_KEY, 'false')
    setRouteStarted(false)

    return { success: true }
  }

  // Expose route-started state so the component can read it on mount
  const [routeStarted, setRouteStartedState] = useState(
    () => localStorage.getItem(DRIVER_ROUTE_STATE_KEY) === 'true'
  )
  const setRouteStarted = (val) => setRouteStartedState(val)

  // ── Emergency Call — dial all emergency contacts for the active route ──
  const handleEmergencyCall = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Find children on the active route
    const activeRoute = routes.find(r => r.status === 'active')
    if (!activeRoute) return { error: 'No active route found' }

    // Get transport links → children IDs
    const { data: links } = await supabase
      .from('child_transport')
      .select('child_id')
      .eq('route_id', activeRoute.id)

    const childIds = (links || []).map(l => l.child_id).filter(Boolean)
    if (childIds.length === 0) return { error: 'No children on this route' }

    // Get children with parent info
    const { data: routeChildren } = await supabase
      .from('children')
      .select('id, parent_id')
      .in('id', childIds)

    const parentIds = [...new Set(
      (routeChildren || []).map(c => c.parent_id).filter(Boolean)
    )]

    // Get parent profiles (phone numbers)
    const { data: parents } = await supabase
      .from('profiles')
      .select('id, full_name, phone, email')
      .in('id', parentIds)

    const contacts = (parents || []).filter(p => p.phone)
    return contacts.length > 0
      ? { contacts, emergencyNumbers: contacts.map(c => c.phone) }
      : { error: 'No emergency contacts found for this route' }
  }

  const refetch = () => {
    fetchDriverData()
  }

  return {
    driverProfile,
    routes,
    children,
    loading,
    error,
    refetch,
    routeStarted,
    setRouteStarted,
    startRoute,
    stopRoute,
    handleEmergencyCall,
  }
}
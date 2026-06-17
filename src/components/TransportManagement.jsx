import { useState, useEffect, useMemo } from 'react'
import {
  Bus, MapPin, Clock, Users, UserPlus, X, Plus, Edit, Trash2,
  Navigation, Phone, AlertTriangle, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Search, Filter, Wifi, WifiOff, Gauge
} from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'
import { supabase } from '../lib/supabaseClient'
import { SearchBar } from './ui/shared/SearchBar'
import { FilterDropdown } from './ui/shared/FilterDropdown'

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-accent-green/10 text-accent-green', glow: 'shadow-[0_0_20px_rgba(110,231,183,0.5)]' },
  scheduled: { label: 'Scheduled', color: 'bg-primary-blue/10 text-primary-blue', glow: 'shadow-[0_0_20px_rgba(74,144,226,0.4)]' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600', glow: '' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600', glow: '' }
}

const TRANSPORT_STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' }
]

export default function TransportManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [routes, setRoutes] = useState([])
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [logs, setLogs] = useState([])
  const [logsPage, setLogsPage] = useState(1)
  const logsPerPage = 8

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pickup_time: '',
    return_time: '',
    vehicle: '',
    driver_id: ''
  })

  const [drivers, setDrivers] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [routesRes, driversRes, logsRes] = await Promise.all([
        supabase
          .from('transport_routes')
          .select(`
            *,
            driver:profiles!driver_id(id, full_name, phone, email, avatar_url)
          `)
          .order('name'),
        supabase
          .from('profiles')
          .select('id, full_name, email, phone')
          .eq('role', 'DRIVER')
          .order('full_name'),
        supabase
          .from('transport_tracking')
          .select(`
            *,
            route:transport_routes(id, name),
            driver:profiles!driver_id(id, full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(50)
      ])

      if (routesRes.error) throw routesRes.error
      setRoutes(routesRes.data || [])
      setDrivers(driversRes.data || [])
      setLogs(logsRes.data || [])
    } catch (err) {
      console.error('Transport fetch error:', err)
      setError(err.message || 'Failed to load transport data')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || null

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const routeStudents = useMemo(() => {
    if (!selectedRouteId) return []
    // This would be fetched from child_transport in a real implementation
    // For now, we'll return empty and rely on the route details
    return []
  }, [selectedRouteId])

  const handleAddRoute = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('transport_routes')
        .insert({
          name: formData.name,
          description: formData.description,
          pickup_time: formData.pickup_time,
          return_time: formData.return_time,
          vehicle: formData.vehicle,
          driver_id: formData.driver_id || null,
          status: 'scheduled'
        })

      if (error) throw error

      setShowAddModal(false)
      setFormData({ name: '', description: '', pickup_time: '', return_time: '', vehicle: '', driver_id: '' })
      await fetchAllData()
      alert('Route added successfully!')
    } catch (err) {
      console.error('Add route error:', err)
      alert('Error adding route: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRoute = async (routeId) => {
    if (!confirm('Are you sure you want to delete this route?')) return
    try {
      const { error } = await supabase
        .from('transport_routes')
        .delete()
        .eq('id', routeId)

      if (error) throw error

      if (selectedRouteId === routeId) {
        setSelectedRouteId(null)
      }
      await fetchAllData()
      alert('Route deleted successfully!')
    } catch (err) {
      console.error('Delete route error:', err)
      alert('Error deleting route: ' + err.message)
    }
  }

  const handleStatusToggle = async (routeId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'scheduled' : 'active'
    try {
      const { error } = await supabase
        .from('transport_routes')
        .update({ status: newStatus })
        .eq('id', routeId)

      if (error) throw error
      await fetchAllData()
    } catch (err) {
      console.error('Status update error:', err)
      alert('Error updating status: ' + err.message)
    }
  }

  const totalLogsPages = Math.ceil(logs.length / logsPerPage)
  const paginatedLogs = logs.slice((logsPage - 1) * logsPerPage, logsPage * logsPerPage)

  const activeRoutesCount = routes.filter(r => r.status === 'active').length
  const scheduledRoutesCount = routes.filter(r => r.status === 'scheduled').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transport data...</p>
        </div>
      </div>
    )
  }

  if (error && routes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-12 text-center max-w-2xl mx-auto animate-fade-in">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h3 className="font-heading text-2xl font-bold text-gray-800 mb-4">Unable to Load Transport Data</h3>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={fetchAllData}
            className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top: Add Route button + Live Status badge */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${activeRoutesCount > 0 ? 'bg-accent-green animate-pulse' : 'bg-gray-300'}`} />
            {activeRoutesCount > 0 && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-accent-green animate-ping opacity-75" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {activeRoutesCount > 0
              ? `${activeRoutesCount} route${activeRoutesCount > 1 ? 's' : ''} live`
              : 'No active routes'}
          </span>
          {scheduledRoutesCount > 0 && (
            <span className="text-xs px-2 py-1 bg-primary-blue/10 text-primary-blue rounded-full">
              {scheduledRoutesCount} scheduled
            </span>
          )}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gradient-coral px-5 py-2.5 rounded-xl text-white font-medium shadow-lg text-sm flex items-center gap-2 hover:shadow-xl transition-all"
        >
          <UserPlus size={18} />
          Add Route
        </button>
      </div>

      {/* Main: 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Route list (glass vertical panel) */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-card p-4 h-[calc(100vh-320px)] min-h-[400px] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-800">Routes</h3>
              <span className="text-xs text-gray-500">{routes.length} total</span>
            </div>

            <div className="mb-3">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search routes..."
                className="text-sm"
              />
            </div>

            <div className="mb-3">
              <FilterDropdown
                label="Status"
                value={statusFilter}
                options={TRANSPORT_STATUS_FILTERS}
                onChange={setStatusFilter}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
              {filteredRoutes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No routes found
                </div>
              ) : (
                filteredRoutes.map(route => {
                  const statusConf = STATUS_CONFIG[route.status] || STATUS_CONFIG.scheduled
                  const isSelected = selectedRouteId === route.id

                  return (
                    <div
                      key={route.id}
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-primary-blue/60 bg-primary-blue/5 shadow-md'
                          : 'border-transparent hover:bg-white/50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-gray-800 truncate">{route.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusConf.color}`}>
                          {statusConf.label}
                        </span>
                      </div>
                      {route.description && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{route.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {route.pickup_time && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {route.pickup_time}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Bus size={12} /> {route.vehicle || 'No vehicle'}
                        </span>
                      </div>
                      {route.driver && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          Driver: {route.driver.full_name}
                        </p>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Center: Live map view */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-card p-4 h-[calc(100vh-320px)] min-h-[400px] flex flex-col animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-800">Live Map</h3>
              <div className="flex items-center gap-2">
                <Wifi size={14} className="text-accent-green" />
                <span className="text-xs text-gray-500">Live</span>
              </div>
            </div>

            <div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 border border-gray-200">
              {/* Simulated map background */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(74, 144, 226, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(74, 144, 226, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }} />

              {/* Road network SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                {/* Main horizontal road */}
                <path d="M 0 150 Q 100 140 200 150 T 400 150" stroke="#CBD5E1" strokeWidth="12" fill="none" />
                {/* Main vertical road */}
                <path d="M 200 0 Q 210 100 200 150 T 190 300" stroke="#CBD5E1" strokeWidth="10" fill="none" />
                {/* Secondary roads */}
                <path d="M 50 50 Q 100 100 150 150" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                <path d="M 350 50 Q 300 100 250 150" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                <path d="M 50 250 Q 100 200 150 150" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                <path d="M 350 250 Q 300 200 250 150" stroke="#E2E8F0" strokeWidth="6" fill="none" />

                {/* School marker */}
                <circle cx="200" cy="150" r="12" fill="#FF7A59" />
                <text x="200" y="154" textAnchor="middle" className="text-xs fill-white font-bold">S</text>

                {/* Route stops */}
                {selectedRoute && (
                  <>
                    <circle cx="80" cy="100" r="6" fill="#4A90E2" />
                    <circle cx="120" cy="200" r="6" fill="#4A90E2" />
                    <circle cx="280" cy="100" r="6" fill="#4A90E2" />
                    <circle cx="320" cy="200" r="6" fill="#4A90E2" />

                    {/* Route path */}
                    <path
                      d="M 80 100 Q 140 140 200 150 Q 260 160 320 200"
                      stroke="#4A90E2"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="6,4"
                      opacity="0.7"
                    />

                    {/* Vehicle marker */}
                    <g transform="translate(200, 150)">
                      <circle r="10" fill="#FF7A59" className="animate-pulse" />
                      <text y="4" textAnchor="middle" className="text-xs fill-white">🚌</text>
                    </g>

                    {/* Stop labels */}
                    <text x="80" y="85" textAnchor="middle" className="text-[10px] fill-gray-600">Stop 1</text>
                    <text x="120" y="215" textAnchor="middle" className="text-[10px] fill-gray-600">Stop 2</text>
                    <text x="280" y="85" textAnchor="middle" className="text-[10px] fill-gray-600">Stop 3</text>
                    <text x="320" y="215" textAnchor="middle" className="text-[10px] fill-gray-600">Stop 4</text>
                  </>
                )}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 glass-card rounded-lg p-2 text-[10px] space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-accent-green" />
                  <span>Active Vehicle</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary-blue" />
                  <span>Pickup Point</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary-coral" />
                  <span>School</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Route details card */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-card p-6 h-[calc(100vh-320px)] min-h-[400px] overflow-y-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            {selectedRoute ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-gray-800">{selectedRoute.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedRoute.description || 'No description'}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${STATUS_CONFIG[selectedRoute.status]?.color || STATUS_CONFIG.scheduled.color}`}>
                    {STATUS_CONFIG[selectedRoute.status]?.label || selectedRoute.status}
                  </span>
                </div>

                {/* Driver assigned */}
                <div className="glass-card-inner rounded-xl p-4">
                  <h4 className="font-heading font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <UserPlus size={16} className="text-primary-blue" />
                    Driver Assigned
                  </h4>
                  {selectedRoute.driver ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {selectedRoute.driver.full_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{selectedRoute.driver.full_name}</p>
                        <p className="text-xs text-gray-500">{selectedRoute.driver.phone || 'No phone'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No driver assigned</p>
                  )}
                </div>

                {/* Students assigned */}
                <div className="glass-card-inner rounded-xl p-4">
                  <h4 className="font-heading font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-accent-green" />
                    Students Assigned
                  </h4>
                  <div className="text-center py-4">
                    <Users size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Student list available in route details</p>
                    <p className="text-xs text-gray-400 mt-1">Check child_transport table for assignments</p>
                  </div>
                </div>

                {/* Vehicle details */}
                <div className="glass-card-inner rounded-xl p-4">
                  <h4 className="font-heading font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Bus size={16} className="text-accent-purple" />
                    Vehicle Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Vehicle</span>
                      <span className="text-sm font-medium text-gray-800">{selectedRoute.vehicle || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Pickup Time</span>
                      <span className="text-sm font-medium text-gray-800">{selectedRoute.pickup_time || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Return Time</span>
                      <span className="text-sm font-medium text-gray-800">{selectedRoute.return_time || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* ETA tracking */}
                <div className="glass-card-inner rounded-xl p-4">
                  <h4 className="font-heading font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-primary-coral" />
                    ETA Tracking
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Estimated arrival</p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedRoute.pickup_time || '--:--'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`text-sm px-3 py-1 rounded-full ${STATUS_CONFIG[selectedRoute.status]?.color || STATUS_CONFIG.scheduled.color}`}>
                        {STATUS_CONFIG[selectedRoute.status]?.label || selectedRoute.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency contact button */}
                <button
                  onClick={() => {
                    if (selectedRoute.driver?.phone) {
                      window.location.href = `tel:${selectedRoute.driver.phone}`
                    } else {
                      alert('No driver phone number available')
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={18} />
                  Emergency Contact
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="font-heading font-bold text-lg text-gray-800 mb-2">No Route Selected</h4>
                <p className="text-sm text-gray-500">Select a route from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Transport logs table */}
      <div className="glass-card rounded-card p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-xl text-gray-800">Transport Logs</h3>
          <span className="text-sm text-gray-500">{logs.length} records</span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No transport logs available yet.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Driver</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">
                          {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-800">{log.route?.name || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{log.driver?.full_name || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${log.status ? STATUS_CONFIG[log.status]?.color || 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'}`}>
                          {log.status || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500">
                          {log.latitude && log.longitude ? `${log.latitude.toFixed(4)}, ${log.longitude.toFixed(4)}` : 'No GPS data'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalLogsPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {(logsPage - 1) * logsPerPage + 1} to {Math.min(logsPage * logsPerPage, logs.length)} of {logs.length} logs
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLogsPage(prev => Math.max(1, prev - 1))}
                    disabled={logsPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalLogsPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalLogsPages - 4, logsPage - 2)) + i
                      if (pageNum > totalLogsPages) return null
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setLogsPage(pageNum)}
                          className={`px-3 py-1 rounded text-sm ${logsPage === pageNum ? 'bg-primary-blue text-white' : 'hover:bg-gray-100'}`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setLogsPage(prev => Math.min(totalLogsPages, prev + 1))}
                    disabled={logsPage === totalLogsPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Add New Route</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-gray-800">Route Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Route Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="e.g., Route A - Morning"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                    <input
                      type="text"
                      value={formData.vehicle}
                      onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="e.g., Bus #1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-none"
                    placeholder="Route description or notes..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                    <input
                      type="time"
                      value={formData.pickup_time}
                      onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Time</label>
                    <input
                      type="time"
                      value={formData.return_time}
                      onChange={(e) => setFormData({ ...formData, return_time: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Driver</label>
                  <select
                    value={formData.driver_id}
                    onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                  >
                    <option value="">Select driver (optional)</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>{driver.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Route'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

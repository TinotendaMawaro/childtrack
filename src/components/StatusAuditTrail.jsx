import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  Search, Filter, Calendar, User, FileText, Clock,
  ChevronDown, Eye, Download, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'

export default function StatusAuditTrail() {
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [childFilter, setChildFilter] = useState('')
  const [adminFilter, setAdminFilter] = useState('')
  const [dateRange, setDateRange] = useState('30') // days
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Available filter options
  const [children, setChildren] = useState([])
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    fetchAuditLogs()
    fetchFilterOptions()
  }, [childFilter, adminFilter, dateRange, statusFilter])

  const fetchFilterOptions = async () => {
    try {
      // Get all children for filter
      const { data: childrenData } = await supabase
        .from('children')
        .select('id, full_name')
        .order('full_name')

      setChildren(childrenData || [])

      // Get all admins for filter
      const { data: adminData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'ADMIN')
        .order('full_name')

      setAdmins(adminData || [])
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const fetchAuditLogs = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('child_status_history')
        .select(`
          *,
          children!child_id(id, full_name),
          profiles!changed_by(id, full_name)
        `)
        .order('changed_at', { ascending: false })

      // Apply filters
      if (childFilter) {
        query = query.eq('child_id', childFilter)
      }

      if (adminFilter) {
        query = query.eq('changed_by', adminFilter)
      }

      if (dateRange !== 'all') {
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange))
        query = query.gte('changed_at', daysAgo.toISOString())
      }

      if (statusFilter !== 'ALL') {
        if (statusFilter === 'CHANGES') {
          // Only show actual status changes (exclude no-op entries)
          query = query.neq('old_status', 'new_status')
        } else {
          query = query.eq('new_status', statusFilter)
        }
      }

      const { data, error } = await query
      if (error) throw error

      setAuditLogs(data || [])
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      setAuditLogs([])
    } finally {
      setLoading(false)
    }
  }

  // Filter logs based on search query
  const filteredLogs = auditLogs.filter(log => {
    if (!searchQuery) return true
    const childName = log.children?.full_name || ''
    const adminName = log.profiles?.full_name || ''
    const reason = log.reason || ''
    const notes = log.notes || ''

    const searchLower = searchQuery.toLowerCase()
    return childName.toLowerCase().includes(searchLower) ||
           adminName.toLowerCase().includes(searchLower) ||
           reason.toLowerCase().includes(searchLower) ||
           notes.toLowerCase().includes(searchLower)
  })

  // Pagination logic
  const totalItems = filteredLogs.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, childFilter, adminFilter, dateRange, statusFilter])

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Time',
      'Child Name',
      'Old Status',
      'New Status',
      'Changed By',
      'Reason',
      'Notes'
    ]

    const rows = filteredLogs.map(log => [
      new Date(log.changed_at).toLocaleDateString(),
      new Date(log.changed_at).toLocaleTimeString(),
      log.children?.full_name || 'Unknown',
      log.old_status || 'None',
      log.new_status,
      log.profiles?.full_name || 'System',
      log.reason || '',
      log.notes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `status-audit-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-amber-100 text-amber-700',
      ARCHIVED: 'bg-gray-100 text-gray-600'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading audit trail...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Status Change Audit Trail</h2>
          <p className="text-gray-600 mt-1">Complete history of all child status modifications</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Audit Log</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-gray-800"
            />
          </div>

          {/* Child Filter */}
          <select
            value={childFilter}
            onChange={(e) => setChildFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none cursor-pointer"
          >
            <option value="">All Children</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.full_name}</option>
            ))}
          </select>

          {/* Admin Filter */}
          <select
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none cursor-pointer"
          >
            <option value="">All Admins</option>
            {admins.map(admin => (
              <option key={admin.id} value={admin.id}>{admin.full_name}</option>
            ))}
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none cursor-pointer"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none cursor-pointer"
          >
            <option value="ALL">All Changes</option>
            <option value="ACTIVE">To Active</option>
            <option value="INACTIVE">To Inactive</option>
            <option value="ARCHIVED">To Archived</option>
            <option value="CHANGES">Status Changes Only</option>
          </select>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary-blue">{filteredLogs.length}</div>
          <div className="text-sm text-gray-600">Total Changes</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredLogs.filter(log => log.new_status === 'ACTIVE').length}
          </div>
          <div className="text-sm text-gray-600">Activations</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {filteredLogs.filter(log => log.new_status === 'INACTIVE').length}
          </div>
          <div className="text-sm text-gray-600">Deactivations</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">
            {filteredLogs.filter(log => log.new_status === 'ARCHIVED').length}
          </div>
          <div className="text-sm text-gray-600">Archivals</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Child</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status Change</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Changed By</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Reason</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.map((log) => {
                const { date, time } = formatDateTime(log.changed_at)
                const isStatusChange = log.old_status !== log.new_status

                return (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {log.children?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {log.children?.full_name || 'Unknown Child'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {isStatusChange ? (
                          <>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.old_status)}`}>
                              {log.old_status || 'None'}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.new_status)}`}>
                              {log.new_status}
                            </span>
                          </>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            No Change
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">
                        {log.profiles?.full_name || 'System'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 max-w-xs truncate" title={log.reason}>
                        {log.reason || 'No reason provided'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {log.notes && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Notes available</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {auditLogs.length === 0
                ? 'No status changes have been recorded yet.'
                : 'No audit logs match your current filters.'
              }
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} audit entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  if (pageNum > totalPages) return null
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === pageNum
                          ? 'bg-primary-blue text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {filteredLogs.length > 0 && totalPages <= 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600 text-center">
            Showing {filteredLogs.length} of {auditLogs.length} audit entries
            {dateRange !== 'all' && ` (last ${dateRange} days)`}
          </div>
        )}
      </div>
    </div>
  )
}
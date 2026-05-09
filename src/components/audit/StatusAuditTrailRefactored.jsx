import { useState } from 'react'
import { SearchBar } from '../ui/shared/SearchBar'
import { FilterDropdown } from '../ui/shared/FilterDropdown'
import { DataTable, Pagination } from '../ui/shared/DataTable'
import { useAuditLogs } from '../../hooks/useAuditLogs'
import { Calendar, User, FileText, Eye } from 'lucide-react'

export default function StatusAuditTrail() {
  const [searchQuery, setSearchQuery] = useState('')
  const [childFilter, setChildFilter] = useState('')
  const [adminFilter, setAdminFilter] = useState('')
  const [dateRange, setDateRange] = useState('30')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const { auditLogs, loading, error, refetch } = useAuditLogs({
    searchQuery,
    childFilter,
    adminFilter,
    dateRange,
    statusFilter
  })

  const itemsPerPage = 25
  const totalPages = Math.ceil(auditLogs.length / itemsPerPage)
  const paginatedLogs = auditLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns = [
    {
      header: 'Date & Time',
      key: 'changed_at',
      render: (log) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm">{formatDate(log.changed_at)}</span>
        </div>
      )
    },
    {
      header: 'Child',
      key: 'children',
      render: (log) => (
        <div>
          <div className="font-medium text-gray-800">{log.children?.full_name || 'Unknown'}</div>
          <div className="text-xs text-gray-500">{log.children?.classes?.name || 'No class'}</div>
        </div>
      )
    },
    {
      header: 'Action',
      key: 'new_status',
      render: (log) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            log.new_status === 'ACTIVE' ? 'bg-green-500' :
            log.new_status === 'INACTIVE' ? 'bg-amber-500' : 'bg-gray-500'
          }`} />
          <span className="text-sm font-medium">
            {log.old_status} → {log.new_status}
          </span>
        </div>
      )
    },
    {
      header: 'Changed By',
      key: 'profiles',
      render: (log) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span className="text-sm">{log.profiles?.full_name || 'System'}</span>
        </div>
      )
    },
    {
      header: 'Details',
      key: 'reason',
      render: (log) => (
        <div className="max-w-xs">
          {log.reason && (
            <div className="text-sm text-gray-600 mb-1">{log.reason}</div>
          )}
          {log.notes && (
            <div className="text-xs text-gray-500 truncate">{log.notes}</div>
          )}
        </div>
      )
    }
  ]

  const dateRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: 'all', label: 'All time' }
  ]

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Activated' },
    { value: 'INACTIVE', label: 'Deactivated' },
    { value: 'ARCHIVED', label: 'Archived' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">Status Audit Trail</h2>
          <p className="text-gray-600 mt-1">Track and export all status change history with comprehensive filtering</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search audit logs..."
          />
        </div>
        <FilterDropdown
          label="Date Range"
          value={dateRange}
          options={dateRangeOptions}
          onChange={setDateRange}
        />
        <FilterDropdown
          label="Status Change"
          value={statusFilter}
          options={statusOptions}
          onChange={setStatusFilter}
        />
        <div className="text-sm text-gray-500 self-center">
          {auditLogs.length} total records
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-xl p-6">
        <DataTable
          data={paginatedLogs}
          columns={columns}
          loading={loading}
          emptyMessage="No audit logs found matching your criteria"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
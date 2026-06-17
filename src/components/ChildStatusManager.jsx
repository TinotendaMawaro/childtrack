import { useState, useEffect } from 'react'
import {
  Search, ChevronDown, UserPlus, X, Edit, Save, AlertTriangle,
  Clock, UserCheck, Shield, FileText, CheckCircle, Loader2
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import PermissionGuard from './PermissionGuard'

// Status options with descriptions and colors
const STATUS_OPTIONS = {
  ACTIVE: {
    label: 'Active',
    description: 'Student is currently enrolled and active',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: UserCheck
  },
  INACTIVE: {
    label: 'Inactive',
    description: 'Student is temporarily withdrawn',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock
  },
  ARCHIVED: {
    label: 'Archived',
    description: 'Student record is permanently archived',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: FileText
  }
}

// Status transition rules
const VALID_TRANSITIONS = {
  ACTIVE: ['INACTIVE'], // Can only go to INACTIVE
  INACTIVE: ['ACTIVE', 'ARCHIVED'], // Can reactivate or archive
  ARCHIVED: [] // Cannot change from archived
}

export default function ChildStatusManager() {
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusForm, setStatusForm] = useState({
    newStatus: '',
    reason: '',
    notes: ''
  })

  // Load children data
  useEffect(() => {
    fetchChildren()
  }, [statusFilter])

  const fetchChildren = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('children')
        .select(`
          *,
          profiles!parent_id(id, full_name, email),
          classes!class_id(id, name)
        `)
        .order('full_name')

      // Apply status filter if not ALL
      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query
      if (error) throw error

      setChildren(data || [])
    } catch (error) {
      console.error('Error fetching children:', error)
      setChildren([])
    } finally {
      setLoading(false)
    }
  }

  // Filter children based on search
  const filteredChildren = children.filter(child => {
    const matchesSearch = child.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         child.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Open status change modal
  const openStatusModal = (child) => {
    setSelectedChild(child)
    setStatusForm({
      newStatus: child.status || 'ACTIVE',
      reason: '',
      notes: ''
    })
    setShowStatusModal(true)
  }

  // Validate status change
  const validateStatusChange = async (child, newStatus, reason) => {
    const errors = []

    // Check if status transition is valid
    const currentStatus = child.status || 'ACTIVE'
    if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      errors.push(`Invalid status transition: ${currentStatus} → ${newStatus}`)
    }

    // Check if reason is provided
    if (!reason.trim()) {
      errors.push('Reason for status change is required')
    }

    // Business rule validations
    if (newStatus === 'ARCHIVED' && currentStatus !== 'INACTIVE') {
      errors.push('Children can only be archived from INACTIVE status')
    }

    // Check for outstanding financial obligations (if archiving)
    if (newStatus === 'ARCHIVED') {
      try {
        const { data: transactions } = await supabase
          .from('financial_transactions')
          .select('id, amount, status')
          .eq('child_id', child.id)
          .in('status', ['PENDING', 'OVERDUE'])

        if (transactions && transactions.length > 0) {
          const totalOwed = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
          errors.push(`Cannot archive: Child has outstanding payments totaling $${totalOwed.toFixed(2)}`)
        }
      } catch (error) {
        console.warn('Could not verify financial obligations:', error)
        // Allow proceeding but log the issue
      }
    }

    return errors
  }

  // Handle status change
  const handleStatusChange = async (e) => {
    e.preventDefault()

    if (!selectedChild || !statusForm.newStatus) return

    // Run validation
    const validationErrors = await validateStatusChange(
      selectedChild,
      statusForm.newStatus,
      statusForm.reason
    )

    if (validationErrors.length > 0) {
      alert('Validation failed:\n' + validationErrors.join('\n'))
      return
    }

    setUpdating(true)

    try {
      const currentStatus = selectedChild.status || 'ACTIVE'

      // Update child status
      const { error: updateError } = await supabase
        .from('children')
        .update({
          status: statusForm.newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedChild.id)

      if (updateError) throw updateError

      // Log the change in audit table
      const { error: auditError } = await supabase
        .from('child_status_history')
        .insert({
          child_id: selectedChild.id,
          old_status: currentStatus,
          new_status: statusForm.newStatus,
          reason: statusForm.reason,
          notes: statusForm.notes || null
        })

      if (auditError) {
        console.error('Audit logging failed:', auditError)
        // Don't fail the whole operation for audit errors
      }

      // Refresh data
      await fetchChildren()

      // Close modal and show success
      setShowStatusModal(false)
      setSelectedChild(null)
      alert(`Child status updated successfully: ${currentStatus} → ${statusForm.newStatus}`)

    } catch (error) {
      console.error('Error updating child status:', error)
      alert('Error updating child status: ' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  // Get available status options for current child
  const getAvailableStatuses = (child) => {
    const currentStatus = child.status || 'ACTIVE'
    const available = VALID_TRANSITIONS[currentStatus] || []

    // Always include current status as an option
    return [currentStatus, ...available]
  }

  const handleFormChange = (field, value) => {
    setStatusForm(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading child status manager...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Child Status Manager</h2>
          <p className="text-gray-600 mt-1">Manage student enrollment status and track changes</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Admin Only</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by child or parent name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-gray-800"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="px-3 py-2 bg-green-50 text-green-700 rounded-lg">
            <span className="font-medium">{children.filter(c => c.status === 'ACTIVE').length}</span> Active
          </div>
          <div className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg">
            <span className="font-medium">{children.filter(c => c.status === 'INACTIVE').length}</span> Inactive
          </div>
          <div className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg">
            <span className="font-medium">{children.filter(c => c.status === 'ARCHIVED').length}</span> Archived
          </div>
        </div>
      </div>

      {/* Children Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Child</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Parent</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Class</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Current Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Last Updated</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredChildren.map((child) => {
                const statusInfo = STATUS_OPTIONS[child.status || 'ACTIVE']
                const StatusIcon = statusInfo.icon

                return (
                  <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center overflow-hidden">
                          {child.photo_url && child.photo_url.startsWith('http') ? (
                            <img
                              src={child.photo_url}
                              alt={child.full_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                const fallback = e.target.nextElementSibling
                                if (fallback) fallback.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <span className={`text-lg ${child.photo_url?.startsWith('http') ? 'hidden' : ''}`}>
                            {child.photo_url || '👶'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{child.full_name}</p>
                          <p className="text-sm text-gray-500">
                            {child.dob ? `${new Date().getFullYear() - new Date(child.dob).getFullYear()} years old` : 'Age unknown'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{child.profiles?.full_name || 'No parent assigned'}</p>
                        <p className="text-sm text-gray-500">{child.profiles?.email || ''}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {child.classes?.name || 'No class assigned'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-500">
                        {child.updated_at ? new Date(child.updated_at).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <PermissionGuard resource="children" action="update" scope="organization">
                        <button
                          onClick={() => openStatusModal(child)}
                          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors text-sm font-medium"
                        >
                          Change Status
                        </button>
                      </PermissionGuard>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredChildren.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No children found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowStatusModal(false)} />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 font-heading">Change Child Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleStatusChange} className="p-6 space-y-6">
              {/* Child Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Child Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{selectedChild.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_OPTIONS[selectedChild.status || 'ACTIVE'].color
                    }`}>
                      {STATUS_OPTIONS[selectedChild.status || 'ACTIVE'].label}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Parent:</span>
                    <span className="ml-2">{selectedChild.profiles?.full_name || 'Not assigned'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Class:</span>
                    <span className="ml-2">{selectedChild.classes?.name || 'Not assigned'}</span>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  New Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {getAvailableStatuses(selectedChild).map((statusKey) => {
                    const statusInfo = STATUS_OPTIONS[statusKey]
                    const StatusIcon = statusInfo.icon
                    const isCurrent = statusKey === (selectedChild.status || 'ACTIVE')

                    return (
                      <label
                        key={statusKey}
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          statusForm.newStatus === statusKey
                            ? 'border-primary-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={statusKey}
                          checked={statusForm.newStatus === statusKey}
                          onChange={(e) => handleFormChange('newStatus', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg ${statusInfo.color} flex items-center justify-center`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{statusInfo.label}</span>
                              {isCurrent && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
                          </div>
                          {statusForm.newStatus === statusKey && (
                            <CheckCircle className="w-5 h-5 text-primary-blue" />
                          )}
                        </div>
                      </label>
                    )
                  })}
                </div>

                {/* Transition Warnings */}
                {selectedChild.status && statusForm.newStatus !== selectedChild.status && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Status Change Warning</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {statusForm.newStatus === 'ARCHIVED'
                            ? 'Archiving a child is permanent and cannot be undone. The child record will be hidden from regular views.'
                            : statusForm.newStatus === 'INACTIVE'
                            ? 'Inactive children can be reactivated later. All associated data will be preserved.'
                            : 'Reactivating will restore the child to active status with full functionality.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reason Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Change <span className="text-red-500">*</span>
                </label>
                <select
                  value={statusForm.reason}
                  onChange={(e) => handleFormChange('reason', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none"
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="Graduated">Student Graduated</option>
                  <option value="Withdrawn">Parent Withdrew Student</option>
                  <option value="Transferred">Transferred to Another School</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Administrative">Administrative Decision</option>
                  <option value="Reactivation">Reactivating Student</option>
                  <option value="Data Cleanup">Data Cleanup/Archival</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={statusForm.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue resize-vertical"
                  placeholder="Any additional context or notes about this status change..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating || !statusForm.reason.trim()}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary-blue text-white font-medium shadow-lg hover:bg-primary-blue/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Status
                    </>
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
import { useState, useEffect } from 'react'
import {
  Search, ChevronDown, UserPlus, X, Heart, AlertTriangle,
  Users, Phone, Mail, Car, GraduationCap, Edit, Trash2, RotateCcw, Archive,
  DollarSign, Calendar, History, ToggleLeft, ToggleRight, TrendingUp, TrendingDown,
  Shield, FileText, ChevronLeft, ChevronRight, Save, UserCheck, Clock, CheckCircle
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import ConfirmationModal from './ConfirmationModal'
import LoadingSpinner from './ui/LoadingSpinner'

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

// Hook to fetch financial summary for a child
function useChildFinancialSummary(childId) {
  const [financialData, setFinancialData] = useState({
    totalOwed: 0,
    totalPaid: 0,
    pendingPayments: 0,
    overdueAmount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId) return

    const fetchFinancialData = async () => {
      try {
        // Get all financial transactions for this child
        const { data: transactions, error } = await supabase
          .from('financial_transactions')
          .select('amount, status, direction')
          .eq('child_id', childId)

        if (error) throw error

        let totalOwed = 0
        let totalPaid = 0
        let pendingPayments = 0
        let overdueAmount = 0

        transactions?.forEach(tx => {
          if (tx.direction === 'INCOME') {
            if (tx.status === 'PAID') {
              totalPaid += Number(tx.amount)
            } else if (tx.status === 'PENDING') {
              totalOwed += Number(tx.amount)
              pendingPayments += Number(tx.amount)
            } else if (tx.status === 'OVERDUE') {
              totalOwed += Number(tx.amount)
              overdueAmount += Number(tx.amount)
            }
          }
        })

        setFinancialData({
          totalOwed,
          totalPaid,
          pendingPayments,
          overdueAmount
        })
      } catch (error) {
        console.error('Error fetching financial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFinancialData()
  }, [childId])

  return { financialData, loading }
}

// Hook to fetch status history for a child
function useChildStatusHistory(childId) {
  const [statusHistory, setStatusHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId) return

    const fetchStatusHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('child_status_history')
          .select(`
            *,
            changed_by_profile:profiles!changed_by(id, full_name)
          `)
          .eq('child_id', childId)
          .order('changed_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setStatusHistory(data || [])
      } catch (error) {
        console.error('Error fetching status history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatusHistory()
  }, [childId])

  return { statusHistory, loading }
}

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-green-100 text-green-700 border-green-200',
    INACTIVE: 'bg-amber-100 text-amber-700 border-amber-200',
    ARCHIVED: 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const labels = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    ARCHIVED: 'Archived'
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${styles[status] || styles.ACTIVE}`}>
      {labels[status] || 'Active'}
    </span>
  )
}

// Child Profile Card Component
function ChildCard({ child, onClick, isDeactivated = false }) {
  const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'
  const attendance = child.attendance_average || 95
  const status = 'present'
  const photo = child.photo_url ? child.photo_url : '👶'

  const statusColors = {
    present: 'bg-accent-green/10 text-accent-green',
    absent: 'bg-red-100 text-red-600',
    late: 'bg-accent-yellow/10 text-amber-600',
  }

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 group ${
        isDeactivated ? 'opacity-75 hover:opacity-100' : 'hover:shadow-xl'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral p-[3px] mb-4 group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {photo.startsWith('http') ? (
              <img src={photo} alt="Child" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">{photo}</span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-1 truncate max-w-[140px]">{child.full_name}</h3>
        <p className="text-sm text-gray-500 mb-2">{age} years</p>

        {/* Status Badge */}
        <div className="mb-3">
          <StatusBadge status={child.status || 'ACTIVE'} />
        </div>

        <div className="w-full mb-3">
          <div className={`px-3 py-1 bg-gradient-to-r from-primary-blue to-primary-coral text-white rounded-full`}>
            <span className="text-xs font-semibold">{child.classes ? `${child.classes.curriculum || 'Cambridge'} - ${child.classes.name}` : 'Unassigned'}</span>
          </div>
        </div>

        <div className="w-full mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Attendance</span>
            <span className="font-bold text-accent-green">{attendance}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-accent-green to-emerald-400 h-2 rounded-full transition-all"
              style={{width: `${attendance}%`}} />
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          ● {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  )
}

// Child Detail Drawer
function ChildDrawer({ child, onClose, onEdit, onDeactivate, onReactivate, onArchive, activeTab }) {
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)

  const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'
  const health = child.health_status || 'Good'
  const allergies = child.allergies || []
  const parents = child.profiles ? [child.profiles] : []
  const transport = null

  // Use financial summary hook
  const { financialData, loading: financialLoading } = useChildFinancialSummary(child.id)

  // Use status history hook
  const { statusHistory, loading: historyLoading } = useChildStatusHistory(child.id)

  // Handle status toggle
  const handleStatusToggle = async () => {
    if (isTogglingStatus) return

    setIsTogglingStatus(true)
    try {
      if (child.status === 'ACTIVE') {
        await onDeactivate(child.id, 'Status toggled via profile drawer')
      } else if (child.status === 'INACTIVE') {
        await onReactivate(child.id)
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    } finally {
      setIsTogglingStatus(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:backdrop-blur-none"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-11/12 max-w-sm sm:max-w-md glass-card shadow-2xl z-50 transform transition-transform animate-slide-in-right overflow-hidden">
        <style jsx>{`
          .drawer-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }
          .drawer-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .drawer-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .drawer-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }
          .drawer-scroll::-webkit-scrollbar-thumb:hover {
            background-color: rgba(156, 163, 175, 0.7);
          }
        `}</style>
         <div className="sticky top-0 p-6 border-b bg-white/80 backdrop-blur-xl z-10 flex items-center justify-between">
           <h2 className="font-bold text-2xl text-gray-800">Child Profile</h2>
            <div className="flex items-center gap-2">
              {child.status === 'ACTIVE' && (
                <>
                  <button
                    onClick={onEdit}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-primary-blue"
                    title="Edit Child"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={onDeactivate}
                    className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                    title="Deactivate Child"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
              {child.status === 'INACTIVE' && (
                <>
                  <button
                    onClick={onReactivate}
                    className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600"
                    title="Reactivate Child"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={onArchive}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    title="Archive Permanently"
                  >
                    <Archive size={20} />
                  </button>
                </>
              )}
              {child.status === 'ARCHIVED' && (
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">Archived - Read Only</span>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
         </div>

        <div className="overflow-y-auto max-h-[calc(100vh-80px)] drawer-scroll">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8 pb-6 border-b px-6 pt-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-coral to-orange-400 p-[4px] mb-4">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                {child.photo_url?.startsWith('http') ? (
                  <img src={child.photo_url} alt={child.full_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-5xl">{child.photo_url || '👶'}</span>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{child.full_name}</h3>
            <p className="text-gray-600 mb-4">{age} years • {child.classes ? `${child.classes.curriculum || 'Cambridge'} - ${child.classes.name}` : 'No class'}</p>

            {/* Status Toggle */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-500">Status:</span>
              <button
                onClick={handleStatusToggle}
                disabled={isTogglingStatus || child.status === 'ARCHIVED'}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  child.status === 'ACTIVE'
                    ? 'bg-accent-green/10 text-accent-green border-2 border-accent-green/20'
                    : 'bg-amber-100 text-amber-700 border-2 border-amber-200'
                } ${isTogglingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
              >
                {isTogglingStatus ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : child.status === 'ACTIVE' ? (
                  <ToggleRight size={20} />
                ) : (
                  <ToggleLeft size={20} />
                )}
                <span className="font-medium">
                  {child.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </span>
              </button>
            </div>
          </div>

          {/* Financial Summary Cards */}
          <div className="px-6 mb-6">
            <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary-blue" />
              Financial Summary
            </h4>
            {financialLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card-inner p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <TrendingUp className="w-4 h-4 text-accent-green" />
                    <span className="text-sm text-gray-500">Total Paid</span>
                  </div>
                  <p className="text-xl font-bold text-accent-green">{formatCurrency(financialData.totalPaid)}</p>
                </div>
                <div className="glass-card-inner p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-500">Total Owed</span>
                  </div>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(financialData.totalOwed)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Enrollment/Withdrawal Dates */}
          <div className="glass-card-inner mx-6 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary-blue" />
              <h4 className="font-semibold text-lg">Enrollment History</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Enrolled</span>
                <p className="font-medium text-gray-800">{formatDate(child.enrollment_date || child.created_at)}</p>
              </div>
              <div>
                <span className="text-gray-500">Withdrawn</span>
                <p className="font-medium text-gray-800">{formatDate(child.withdrawal_date)}</p>
              </div>
            </div>
          </div>

          {/* Activity/Status History */}
          <div className="glass-card-inner mx-6 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <History className="w-6 h-6 text-accent-purple" />
              <h4 className="font-semibold text-lg">Status History</h4>
            </div>
            {historyLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue"></div>
              </div>
            ) : statusHistory.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {statusHistory.map((entry, index) => (
                  <div key={entry.id || index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      entry.new_status === 'ACTIVE' ? 'bg-accent-green' :
                      entry.new_status === 'INACTIVE' ? 'bg-amber-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Status changed to <span className="font-semibold">{entry.new_status}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(entry.changed_at)} • {entry.changed_by_profile?.full_name || 'System'}
                      </p>
                      {entry.reason && (
                        <p className="text-xs text-gray-400 mt-1">Reason: {entry.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No status changes recorded</p>
            )}
          </div>

          {/* Health Information */}
          <div className="glass-card-inner mx-6 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-accent-pink" />
              <h4 className="font-semibold text-lg">Health Information</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Health Status</span>
                <p className="font-medium text-gray-800">{health}</p>
              </div>
              <div>
                <span className="text-gray-500">Allergies</span>
                <p className="font-medium">{allergies.length ? allergies.join(', ') : 'None'}</p>
              </div>
            </div>
          </div>

          {/* Parent Contacts */}
          <div className="glass-card-inner mx-6 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary-blue" />
              <h4 className="font-semibold text-lg">Parent Contacts</h4>
            </div>
            <div className="space-y-3">
              {parents.map((parent, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/50 border-l-4 border-primary-blue">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold">{parent.full_name}</h5>
                    <span className="text-xs bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full">Parent</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /><span>{parent.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /><span>{parent.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div className="glass-card-inner mx-6 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Car className="w-6 h-6 text-accent-purple" />
              <h4 className="font-semibold text-lg">Transport</h4>
            </div>
            {transport ? (
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-2">
                  <span>Route</span>
                  <span className="font-medium">{transport.route}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-medium text-accent-green">Active</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No transport assigned</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Status Management Tab Component
function StatusManagementTab() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedChild, setSelectedChild] = useState(null)
  const [statusForm, setStatusForm] = useState({
    newStatus: '',
    reason: '',
    notes: ''
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

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
          profiles!parent_id(id, full_name, phone, email),
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

  // Pagination logic
  const totalItems = filteredChildren.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedChildren = filteredChildren.slice(startIndex, startIndex + itemsPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

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
          old_status: selectedChild.status || 'ACTIVE',
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
      alert(`Child status updated successfully: ${selectedChild.status || 'ACTIVE'} → ${statusForm.newStatus}`)

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
        <p className="text-gray-600">Loading status management...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Status Management</h2>
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
              {paginatedChildren.map((child) => {
                const statusInfo = STATUS_OPTIONS[child.status || 'ACTIVE']
                const StatusIcon = statusInfo.icon

                return (
                  <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
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
                      <button
                        onClick={() => openStatusModal(child)}
                        className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors text-sm font-medium"
                      >
                        Change Status
                      </button>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} children
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
                      <LoadingSpinner />
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

// Audit Trails Tab Component
function AuditTrailsTab() {
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700'
      case 'INACTIVE': return 'bg-amber-100 text-amber-700'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading audit trails...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Audit Trails</h2>
          <p className="text-gray-600 mt-1">Track all child status changes and administrative actions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Audit Log</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-sm"
            />
          </div>

          {/* Child Filter */}
          <select
            value={childFilter}
            onChange={(e) => setChildFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-sm appearance-none"
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
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-sm appearance-none"
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
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-sm appearance-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue text-sm appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
            <option value="ARCHIVED">Archived Only</option>
            <option value="CHANGES">Changes Only</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchAuditLogs}
            className="px-4 py-3 rounded-xl bg-primary-blue text-white hover:bg-primary-blue/90 transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date & Time</th>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.new_status)}`}>
                            {log.new_status} (No Change)
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
                      <span className="text-sm text-gray-600 max-w-xs truncate">
                        {log.reason || 'No reason specified'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 max-w-xs truncate">
                        {log.notes || 'No additional notes'}
                      </span>
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

// Main StudentsEnrolment Component
export default function StudentsEnrolment() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [selectedChild, setSelectedChild] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [newChild, setNewChild] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    dob: '',
    class_id: '',
    parent_id: '',
    photo_url: '',
    performance: 'Good',
    attendance_average: '',
    awards: '',
    location_coordinates: '{}'
  })
  const [classes, setClasses] = useState([{id: 'all', name: 'All Classes'}])
  const [curriculum, setCurriculum] = useState('Cambridge')
  const [filteredClasses, setFilteredClasses] = useState([])
  const [parents, setParents] = useState([])
  const [parentSearch, setParentSearch] = useState('')
  const [selectedParent, setSelectedParent] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Tab management - now includes children management, audit trails, and status management
  const [activeTab, setActiveTab] = useState('children') // 'children' | 'audit-trails' | 'status-management'
  const [deactivatedChildren, setDeactivatedChildren] = useState([])
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)

  // Edit states
  const [editingChild, setEditingChild] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editChild, setEditChild] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    dob: '',
    class_id: '',
    parent_id: '',
    photo_url: '',
    performance: 'Good',
    attendance_average: '',
    awards: '',
    location_coordinates: '{}'
  })

  // Delete confirmation modal state
  const [deleteConfirmConfig, setDeleteConfirmConfig] = useState({
    isOpen: false,
    childId: null,
    isLoading: false
  })

  useEffect(() => {
    fetchChildren()
    fetchClasses()
  }, [activeTab])

  useEffect(() => {
    const subscription = supabase
      .channel('children')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'children' },
        (payload) => fetchChildren())
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  const fetchActiveChildren = async () => {
    setLoading(true)
    try {
      const [childrenRes, profilesRes, classesRes] = await Promise.allSettled([
        supabase
          .from('children')
          .select('*')
          .eq('status', 'ACTIVE')
          .order('full_name', { ascending: true }),
        supabase.from('profiles').select('id, full_name, phone, email'),
        supabase.from('classes').select('id, name, curriculum')
      ])

      const childrenData = childrenRes.status === 'fulfilled' ? childrenRes.value.data || [] : []
      const profilesData = profilesRes.status === 'fulfilled' ? profilesRes.value.data || [] : []
      const classesData = classesRes.status === 'fulfilled' ? classesRes.value.data || [] : []

      // Map profiles and classes to children
      const profilesMap = profilesData.reduce((acc, p) => {
        acc[p.id] = p
        return acc
      }, {})

      const classesMap = classesData.reduce((acc, c) => {
        acc[c.id] = c
        return acc
      }, {})

      const enrichedChildren = childrenData.map(child => ({
        ...child,
        profiles: profilesMap[child.parent_id],
        classes: classesMap[child.class_id]
      }))

      setChildren(enrichedChildren)
    } catch (error) {
      console.error('Error fetching active children:', error)
      setChildren([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDeactivatedChildren = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('deactivated_children')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setDeactivatedChildren(data || [])
    } catch (error) {
      console.error('Error fetching deactivated children:', error)
      setDeactivatedChildren([])
    } finally {
      setLoading(false)
    }
  }

  const fetchChildren = async () => {
    if (activeTab === 'children') {
      await fetchActiveChildren()
    } else {
      await fetchDeactivatedChildren()
    }
  }

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('id, name, curriculum').order('name')
    setClasses([{id: 'all', name: 'All Classes'}, ...(data || [])])
    setFilteredClasses(data || [])
  }

  useEffect(() => {
    const filtered = classes.filter(c => !c.id || c.curriculum === curriculum)
    setFilteredClasses(filtered)
  }, [curriculum, classes])

  const fetchParents = async (search = '') => {
    let query = supabase
      .from('profiles')
      .select('id, full_name, email, phone')
      .order('full_name')
      .limit(10)

    if (search.trim()) {
      query = query.ilike('full_name', `%${search}%`)
    }

    const { data, error } = await query
    if (!error) setParents(data || [])
  }

  const handleParentSearch = (e) => {
    const value = e.target.value
    setParentSearch(value)
    if (value.length > 1) {
      fetchParents(value)
    } else {
      setParents([])
    }
  }

  const selectParent = (parent) => {
    setSelectedParent(parent)
    setParentSearch(parent.full_name)
    setParents([])
    setNewChild(prev => ({...prev, parent_id: parent.id}))
  }

  const handleAddChild = async (e) => {
    e.preventDefault()

    const fullName = [
      newChild.first_name.trim(),
      newChild.middle_name.trim(),
      newChild.last_name.trim()
    ].filter(Boolean).join(' ')

    if (!fullName) {
      alert('First and last name required')
      return
    }

    const childData = {
      first_name: newChild.first_name.trim() || null,
      last_name: newChild.last_name.trim() || null,
      middle_name: newChild.middle_name.trim() || null,
      full_name: fullName,
      dob: newChild.dob || null,
      class_id: newChild.class_id || null,
      parent_id: newChild.parent_id || null,
      photo_url: newChild.photo_url || null,
      performance: newChild.performance,
      attendance_average: parseFloat(newChild.attendance_average) || 0,
      awards: newChild.awards ? newChild.awards.split(',').map(a => a.trim()).filter(Boolean) : [],
      location_coordinates: newChild.location_coordinates ? JSON.parse(newChild.location_coordinates) : {}
    }

    setAddLoading(true)
    try {
      const { error } = await supabase
        .from('children')
        .insert([childData])
        .select()

      if (error) throw error

      setNewChild({
        first_name: '',
        last_name: '',
        middle_name: '',
        dob: '',
        class_id: '',
        parent_id: '',
        photo_url: '',
        performance: 'Good',
        attendance_average: '',
        awards: '',
        location_coordinates: '{}'
      })
      setSelectedParent(null)
      setParentSearch('')
      setShowAddModal(false)
      await fetchChildren()
      alert('Child added successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Error: ' + error.message)
    } finally {
      setAddLoading(false)
    }
  }

  // Open edit modal
  const openEditModal = (child) => {
    setEditingChild(child)
    setEditChild({
      first_name: child.first_name || '',
      last_name: child.last_name || '',
      middle_name: child.middle_name || '',
      dob: child.dob || '',
      class_id: child.class_id || '',
      parent_id: child.parent_id || '',
      photo_url: child.photo_url || '',
      performance: child.performance || 'Good',
      attendance_average: child.attendance_average?.toString() || '',
      awards: Array.isArray(child.awards) ? child.awards.join(', ') : (child.awards || ''),
      location_coordinates: typeof child.location_coordinates === 'object' ? JSON.stringify(child.location_coordinates) : '{}'
    })
    setShowEditModal(true)
  }

  // Handle update child
  const handleUpdateChild = async (e) => {
    e.preventDefault()

    const fullName = [
      editChild.first_name.trim(),
      editChild.middle_name.trim(),
      editChild.last_name.trim()
    ].filter(Boolean).join(' ')

    if (!fullName) {
      alert('First and last name required')
      return
    }

    const childData = {
      first_name: editChild.first_name.trim() || null,
      last_name: editChild.last_name.trim() || null,
      middle_name: editChild.middle_name.trim() || null,
      full_name: fullName,
      dob: editChild.dob || null,
      class_id: editChild.class_id || null,
      parent_id: editChild.parent_id || null,
      photo_url: editChild.photo_url || null,
      performance: editChild.performance,
      attendance_average: parseFloat(editChild.attendance_average) || 0,
      awards: editChild.awards ? editChild.awards.split(',').map(a => a.trim()).filter(Boolean) : [],
      location_coordinates: editChild.location_coordinates ? JSON.parse(editChild.location_coordinates) : {}
    }

    setEditLoading(true)
    try {
      const { error } = await supabase
        .from('children')
        .update(childData)
        .eq('id', editingChild.id)

      if (error) throw error

      setShowEditModal(false)
      setEditingChild(null)
      await fetchChildren()
      alert('Child updated successfully!')
    } catch (error) {
      console.error('Update error:', error)
      alert('Error: ' + error.message)
    } finally {
      setEditLoading(false)
    }
  }

  // Open delete confirmation modal
  const openDeleteConfirmation = (childId) => {
    setDeleteConfirmConfig({
      isOpen: true,
      childId,
      isLoading: false
    })
  }

  // Handle confirmed delete
  const handleConfirmedDelete = async () => {
    const { childId } = deleteConfirmConfig

    setDeleteConfirmConfig(prev => ({ ...prev, isLoading: true }))

    try {
      const { error } = await supabase.from('children').delete().eq('id', childId)
      if (error) throw error

      await fetchChildren()
      alert('Child deleted successfully!')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Error deleting child: ' + (err.message || 'Unknown error'))
    } finally {
      setDeleteConfirmConfig({
        isOpen: false,
        childId: null,
        isLoading: false
      })
    }
  }

  // Close delete confirmation
  const closeDeleteConfirmation = () => {
    setDeleteConfirmConfig({
      isOpen: false,
      childId: null,
      isLoading: false
    })
  }

  // Handle deactivate child (soft delete)
  const handleDeactivateChild = async (childId, reason = '') => {
    setIsDeactivating(true)
    try {
      const { error } = await supabase
        .from('children')
        .update({
          status: 'INACTIVE',
          withdrawal_date: new Date().toISOString().split('T')[0], // Set withdrawal date
          updated_at: new Date().toISOString()
        })
        .eq('id', childId)

      if (error) throw error

      if (activeTab === 'children') {
        await fetchActiveChildren() // Refresh active list
      }
      alert('Child deactivated successfully!')
    } catch (err) {
      console.error('Deactivate error:', err)
      alert('Error deactivating child: ' + (err.message || 'Unknown error'))
    } finally {
      setIsDeactivating(false)
    }
  }

  // Handle reactivate child
  const handleReactivateChild = async (childId) => {
    setIsReactivating(true)
    try {
      const { error } = await supabase
        .from('children')
        .update({
          status: 'ACTIVE',
          withdrawal_date: null, // Clear withdrawal date
          updated_at: new Date().toISOString()
        })
        .eq('id', childId)

      if (error) throw error

      if (activeTab === 'children') {
        await fetchDeactivatedChildren() // Refresh deactivated list
      }
      alert('Child reactivated successfully!')
    } catch (err) {
      console.error('Reactivate error:', err)
      alert('Error reactivating child: ' + (err.message || 'Unknown error'))
    } finally {
      setIsReactivating(false)
    }
  }

  // Handle archive child (permanent)
  const handleArchiveChild = async (childId) => {
    try {
      const { error } = await supabase
        .from('children')
        .update({
          status: 'ARCHIVED',
          updated_at: new Date().toISOString()
        })
        .eq('id', childId)

      if (error) throw error

      if (activeTab === 'children') {
        await fetchDeactivatedChildren() // Refresh deactivated list
      }
      alert('Child archived permanently!')
    } catch (err) {
      console.error('Archive error:', err)
      alert('Error archiving child: ' + (err.message || 'Unknown error'))
    }
  }

  // Handle delete child (legacy - kept for reference)
  const handleDeleteChild = async (childId) => {
    if (!confirm('Are you sure you want to delete this child? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase.from('children').delete().eq('id', childId)
      if (error) throw error

      await fetchChildren()
      alert('Child deleted successfully!')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Error deleting child: ' + (err.message || 'Unknown error'))
    }
  }

  const filteredChildren = (activeTab === 'children' ? children : deactivatedChildren).filter(child => {
    const matchesSearch = child.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = classFilter === 'all' || child.class_id === classFilter
    return matchesSearch && matchesClass
  })

  // Pagination logic
  const totalItems = filteredChildren.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedChildren = filteredChildren.slice(startIndex, startIndex + itemsPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, classFilter, activeTab])

  if (loading && activeTab === 'children') {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p>Loading children...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs for Students/Enrolment Management */}
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('children')}
          className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'children'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Children Management ({children.length})
        </button>
        <button
          onClick={() => setActiveTab('audit-trails')}
          className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'audit-trails'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText size={16} />
          Audit Trails
        </button>
        <button
          onClick={() => setActiveTab('status-management')}
          className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'status-management'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield size={16} />
          Status Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'children' && (
        <>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 sm:w-80 glass-input backdrop-blur-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search children by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 rounded-2xl"
                />
              </div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full sm:w-52 px-4 py-3 rounded-2xl glass-input backdrop-blur-xl border-none outline-none appearance-none cursor-pointer bg-transparent"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-2xl hover:shadow-glow-coral transition-all flex items-center gap-2 whitespace-nowrap ml-auto"
            >
              <UserPlus size={20} />
              Add Child
            </button>
          </div>

          {/* Children Grid */}
          {filteredChildren.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {activeTab === 'children' ? 'No active children found' : 'No deactivated children found'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'children'
                  ? 'Try adjusting your search or filters, or add your first child'
                  : 'Children that have been deactivated will appear here'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {paginatedChildren.map((child, index) => (
                  <ChildCard
                    key={child.id}
                    child={child}
                    onClick={() => setSelectedChild(child)}
                    isDeactivated={activeTab === 'children' ? false : true}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} children
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
            </>
          )}
        </>
      )}

      {activeTab === 'audit-trails' && <AuditTrailsTab />}
      {activeTab === 'status-management' && <StatusManagementTab />}

      {/* Child Drawer */}
      {selectedChild && activeTab === 'children' && (
        <ChildDrawer
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
          onEdit={() => {
            openEditModal(selectedChild)
            setSelectedChild(null)
          }}
          onDeactivate={(childId, reason) => {
            setSelectedChild(null)
            handleDeactivateChild(childId, reason)
          }}
          onReactivate={(childId) => {
            setSelectedChild(null)
            handleReactivateChild(childId)
          }}
          onArchive={(childId) => {
            setSelectedChild(null)
            handleArchiveChild(childId)
          }}
          activeTab={activeTab}
        />
      )}

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Add New Child</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddChild} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newChild.first_name}
                    onChange={(e) => setNewChild({...newChild, first_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={newChild.middle_name}
                    onChange={(e) => setNewChild({...newChild, middle_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Middle (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newChild.last_name}
                    onChange={(e) => setNewChild({...newChild, last_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={newChild.dob}
                    onChange={(e) => setNewChild({...newChild, dob: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                  >
                    <option value="Cambridge">Cambridge</option>
                    <option value="Zimsec">Zimsec</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={newChild.class_id}
                    onChange={(e) => setNewChild({...newChild, class_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                  >
                    <option value="">Select Class ({curriculum})</option>
                    {filteredClasses.filter(c => c.curriculum === curriculum).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent (Search by name)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={parentSearch}
                    onChange={handleParentSearch}
                    className="w-full px-4 py-3 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Type parent name..."
                  />
                  {parents.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-auto border border-gray-200 rounded-xl bg-white shadow-lg z-10">
                      {parents.map((parent) => (
                        <div
                          key={parent.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
                          onClick={() => selectParent(parent)}
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-primary-coral rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {parent.full_name.split(' ').slice(0,2).map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{parent.full_name}</p>
                            <p className="text-sm text-gray-500 truncate">{parent.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedParent && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="font-semibold text-green-800">{selectedParent.full_name}</p>
                      <p className="text-sm text-green-600">{selectedParent.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
                  <select
                    value={newChild.performance}
                    onChange={(e) => setNewChild({...newChild, performance: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Average (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newChild.attendance_average}
                    onChange={(e) => setNewChild({...newChild, attendance_average: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Coordinates</label>
                  <input
                    type="text"
                    value={newChild.location_coordinates}
                    onChange={(e) => setNewChild({...newChild, location_coordinates: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder='{"lat": 0, "lng": 0}'
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Awards (comma separated)</label>
                <textarea
                  rows="3"
                  value={newChild.awards}
                  onChange={(e) => setNewChild({...newChild, awards: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-vertical"
                  placeholder="Best Student 2024, Art Award, Attendance Award"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:shadow-glow-coral disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Add Child
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Child Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Edit Child</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateChild} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editChild.first_name}
                    onChange={(e) => setEditChild({...editChild, first_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={editChild.middle_name}
                    onChange={(e) => setEditChild({...editChild, middle_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Middle (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editChild.last_name}
                    onChange={(e) => setEditChild({...editChild, last_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={editChild.dob}
                    onChange={(e) => setEditChild({...editChild, dob: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={editChild.class_id}
                    onChange={(e) => setEditChild({...editChild, class_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                  >
                    <option value="">Select Class</option>
                    {filteredClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent (Search by name)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={parentSearch}
                    onChange={(e) => {
                      setParentSearch(e.target.value)
                      if (e.target.value.length > 1) fetchParents(e.target.value)
                    }}
                    className="w-full px-4 py-3 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Type parent name..."
                  />
                  {parents.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-auto border border-gray-200 rounded-xl bg-white shadow-lg z-10">
                      {parents.map((parent) => (
                        <div
                          key={parent.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
                          onClick={() => {
                            setEditChild(prev => ({...prev, parent_id: parent.id}))
                            setParentSearch(parent.full_name)
                            setParents([])
                          }}
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-primary-coral rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {parent.full_name.split(' ').slice(0,2).map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{parent.full_name}</p>
                            <p className="text-sm text-gray-500 truncate">{parent.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
                  <select
                    value={editChild.performance}
                    onChange={(e) => setEditChild({...editChild, performance: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Average (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editChild.attendance_average}
                    onChange={(e) => setEditChild({...editChild, attendance_average: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Awards (comma separated)</label>
                <textarea
                  rows="3"
                  value={editChild.awards}
                  onChange={(e) => setEditChild({...editChild, awards: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-vertical"
                  placeholder="Best Student 2024, Art Award, Attendance Award"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:shadow-glow-coral disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit size={20} />
                      Update Child
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmConfig.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleConfirmedDelete}
        title="Deactivate Child"
        message="Are you sure you want to deactivate this child? The child will be moved to the Deactivated Students tab and can be reactivated later. All financial and attendance records will be preserved."
        confirmText="Deactivate Child"
        cancelText="Cancel"
        variant="warning"
        isLoading={deleteConfirmConfig.isLoading}
      />
    </div>
  )
}
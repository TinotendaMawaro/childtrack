import { useState, useEffect } from 'react'
import {
  Search, ChevronDown, UserPlus, X, Heart, AlertTriangle,
  Users, Phone, Mail, Car, GraduationCap, Edit, Trash2, RotateCcw, Archive,
  DollarSign, Calendar, History, ToggleLeft, ToggleRight, TrendingUp, TrendingDown,
  Shield, FileText, ChevronLeft, ChevronRight, MessageSquare, Plus
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import ConfirmationModal from './ConfirmationModal'
import StatusAuditTrail from './StatusAuditTrail'
import AttendanceManagement from './AttendanceManagement'
import { useAuth } from '../hooks/useAuth'

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
  const photo = child.photo_url ? child.photo_url : '👶'

  // Get today's attendance status - for demo, we'll show a mix
  const getAttendanceStatus = () => {
    const statuses = ['present', 'absent', 'late']
    // Use child ID to deterministically assign status for demo
    const statusIndex = child.id % 3
    return statuses[statusIndex]
  }

  const attendanceStatus = getAttendanceStatus()

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

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[attendanceStatus]}`}>
          ● {attendanceStatus === 'present' ? 'Present' : attendanceStatus === 'absent' ? 'Absent' : 'Late'}
        </span>
      </div>
    </div>
  )
}

// Child Detail Drawer (Enhanced Student Profile Screen)
function ChildDrawer({ child, onClose, onEdit, onDeactivate, onReactivate, onArchive, activeTab }) {
  const { session } = useAuth()
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [behaviorNotes, setBehaviorNotes] = useState([])
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [addingNote, setAddingNote] = useState(false)

  const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'
  const health = child.health_status || 'Good'
  const allergies = child.allergies || []
  const parents = child.profiles ? [child.profiles] : []

  // Fetch attendance history and behavior notes
  useEffect(() => {
    if (!child) return

    const fetchData = async () => {
      // Attendance history (last 30 records)
      setLoadingAttendance(true)
      try {
        const { data: attData } = await supabase
          .from('attendance')
          .select('id, date, status')
          .eq('child_id', child.id)
          .order('date', { ascending: false })
          .limit(30)
        setAttendanceHistory(attData || [])
      } catch (err) {
        console.error('Error fetching attendance:', err)
      } finally {
        setLoadingAttendance(false)
      }

      // Behavior notes (latest 10)
      setLoadingNotes(true)
      try {
        const { data: notesData } = await supabase
          .from('child_notes')
          .select(`
            id, note, created_at,
            staff:profiles!staff_id(full_name)
          `)
          .eq('child_id', child.id)
          .eq('note_type', 'behavior')
          .order('created_at', { ascending: false })
          .limit(10)
        setBehaviorNotes(notesData || [])
      } catch (err) {
        console.error('Error fetching notes:', err)
      } finally {
        setLoadingNotes(false)
      }
    }

    fetchData()
  }, [child?.id])

  // Status toggle handler
  const handleStatusToggle = async () => {
    if (isTogglingStatus) return
    setIsTogglingStatus(true)
    try {
      if (child.status === 'ACTIVE') {
        await onDeactivate(child.id, 'Status toggled via profile drawer')
      } else if (child.status === 'INACTIVE') {
        await onReactivate(child.id)
      }
    } catch (err) {
      console.error('Error toggling status:', err)
    } finally {
      setIsTogglingStatus(false)
    }
  }

  // Call parent
  const handleCallParent = () => {
    if (parents.length > 0 && parents[0].phone) {
      window.location.href = `tel:${parents[0].phone}`
    } else {
      alert('No phone number available for parent')
    }
  }

  // Send message to parent (through conversations/messages)
  const handleSendMessage = async () => {
    if (parents.length === 0) {
      alert('No parent contact available')
      return
    }
    const parent = parents[0]
    const message = prompt('Enter your message:')
    if (!message?.trim()) return

    // Find existing conversation or create new
    let { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('staff_id', session?.user?.id)
      .eq('parent_id', parent.id)
      .eq('child_id', child.id)
      .maybeSingle()

    let conversationId
    if (conv) {
      conversationId = conv.id
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          staff_id: session.user.id,
          parent_id: parent.id,
          child_id: child.id
        })
        .select('id')
        .single()
      conversationId = newConv?.id
      if (!conversationId) {
        alert('Failed to create conversation')
        return
      }
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: session.user.id,
        receiver_id: parent.id,
        message: message.trim()
      })

    if (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } else {
      alert('Message sent!')
    }
  }

  // Add behavior note
  const handleAddNote = async () => {
    const note = prompt('Add behavior note:')
    if (!note?.trim()) return
    setAddingNote(true)
    const { error } = await supabase.from('child_notes').insert({
      child_id: child.id,
      staff_id: session.user.id,
      note_type: 'behavior',
      note: note.trim(),
      is_private: false
    })
    setAddingNote(false)
    if (error) {
      console.error('Error adding note:', error)
      alert('Failed to add note')
    } else {
      // Refresh notes list
      const { data: notesData } = await supabase
        .from('child_notes')
        .select(`
          id, note, created_at,
          staff:profiles!staff_id(full_name)
        `)
        .eq('child_id', child.id)
        .eq('note_type', 'behavior')
        .order('created_at', { ascending: false })
        .limit(10)
      setBehaviorNotes(notesData || [])
    }
  }

  // Helper functions
  const getHealthColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'excellent':
      case 'good':
        return 'text-accent-green'
      case 'fair':
        return 'text-amber-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getAttendanceColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'present':
        return 'bg-accent-green/10 text-accent-green'
      case 'absent':
        return 'bg-red-100 text-red-600'
      case 'late':
        return 'bg-accent-yellow/10 text-amber-600'
      case 'excused':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatNoteDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Compute today's attendance from history
  const today = new Date().toISOString().split('T')[0]
  const todayRecord = attendanceHistory.find(a => a.date === today)
  const todayStatus = todayRecord?.status

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:backdrop-blur-none" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-11/12 max-w-sm sm:max-w-md glass-card shadow-2xl z-50 transform transition-transform animate-slide-in-right overflow-hidden">
        <style jsx>{`
          .drawer-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }
          .drawer-scroll::-webkit-scrollbar { width: 6px; }
          .drawer-scroll::-webkit-scrollbar-track { background: transparent; }
          .drawer-scroll::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 3px; }
          .drawer-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(156, 163, 175, 0.7); }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 p-4 border-b bg-white/80 backdrop-blur-xl z-10 flex items-center justify-between">
          <h2 className="font-bold text-xl text-gray-800">Student Profile</h2>
          <div className="flex items-center gap-2">
            {child.status === 'ACTIVE' && (
              <>
                <button onClick={onEdit} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-primary-blue" title="Edit Child">
                  <Edit size={20} />
                </button>
                <button onClick={onDeactivate} className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600" title="Deactivate Child">
                  <Trash2 size={20} />
                </button>
              </>
            )}
            {child.status === 'INACTIVE' && (
              <>
                <button onClick={onReactivate} className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600" title="Reactivate Child">
                  <RotateCcw size={20} />
                </button>
                <button onClick={onArchive} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600" title="Archive Permanently">
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 drawer-scroll">

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral p-[3px] mb-3">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {child.photo_url?.startsWith('http') ? (
                  <img src={child.photo_url} alt={child.full_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-5xl">{child.photo_url || '👶'}</span>
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{child.full_name}</h3>
            <p className="text-sm text-gray-600">{age} years • {child.classes ? `${child.classes.curriculum || 'Cambridge'} - ${child.classes.name}` : 'Unassigned'}</p>
            {child.status === 'ACTIVE' && todayStatus && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-500">Today:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(todayStatus)}`}>
                  {todayStatus === 'present' ? '● Present' : todayStatus === 'absent' ? '○ Absent' : todayStatus === 'late' ? '◐ Late' : todayStatus}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleCallParent} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-primary-blue/10 hover:bg-primary-blue/20 transition-colors">
              <Phone size={20} className="text-primary-blue" />
              <span className="text-xs font-medium text-primary-blue">Call</span>
            </button>
            <button onClick={handleSendMessage} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-primary-coral/10 hover:bg-primary-coral/20 transition-colors">
              <MessageSquare size={20} className="text-primary-coral" />
              <span className="text-xs font-medium text-primary-coral">Message</span>
            </button>
            <button onClick={handleAddNote} disabled={addingNote} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-accent-green/10 hover:bg-accent-green/20 transition-colors disabled:opacity-50">
              {addingNote ? (
                <div className="w-5 h-5 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={20} className="text-accent-green" />
              )}
              <span className="text-xs font-medium text-accent-green">Add Note</span>
            </button>
          </div>

          {/* Attendance History */}
          <div className="glass-card-inner p-4 rounded-2xl">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-blue" />
              Attendance History
            </h4>
            {loadingAttendance ? (
              <div className="flex justify-center py-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-blue"></div>
              </div>
            ) : attendanceHistory.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {attendanceHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-2 rounded-lg bg-white/50">
                    <span className="text-sm text-gray-700">{formatDate(record.date)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getAttendanceColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">No attendance records</p>
            )}
          </div>

          {/* Health Notes */}
          <div className="glass-card-inner p-4 rounded-2xl">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent-pink" />
              Health Notes
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Health Status</span>
                <span className={`text-sm font-semibold ${getHealthColor(health)}`}>{health}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-500">Allergies</span>
                <div className="text-right">
                  {allergies.length > 0 ? (
                    allergies.map((allergy, i) => (
                      <div key={i} className="flex items-center gap-1 text-sm font-medium text-red-500 mb-1">
                        <AlertTriangle size={12} />
                        {allergy}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-accent-green">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Parent Contacts */}
          <div className="glass-card-inner p-4 rounded-2xl">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-blue" />
              Parent Contacts
            </h4>
            <div className="space-y-3">
              {parents.map((parent, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/50 border-l-4 border-primary-blue">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-gray-800">{parent.full_name}</h5>
                    <span className="text-xs bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full">Parent</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <a href={`tel:${parent.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-blue">
                      <Phone size={14} />
                      <span>{parent.phone || 'No phone'}</span>
                    </a>
                    <a href={`mailto:${parent.email}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-blue">
                      <Mail size={14} />
                      <span>{parent.email || 'No email'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behavior Notes */}
          <div className="glass-card-inner p-4 rounded-2xl">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-purple" />
              Behavior Notes
            </h4>
            {loadingNotes ? (
              <div className="flex justify-center py-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-blue"></div>
              </div>
            ) : behaviorNotes.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {behaviorNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-white/50 border-l-4 border-accent-purple">
                    <p className="text-sm text-gray-800 mb-2">{note.note}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{note.staff?.full_name || 'Staff'}</span>
                      <span>{formatNoteDate(note.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">No behavior notes recorded</p>
            )}
          </div>

          {/* Progress Summary */}
          <div className="glass-card-inner p-4 rounded-2xl">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              Progress Summary
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/50">
                <p className="text-xs text-gray-500 mb-1">Performance</p>
                <p className={`text-lg font-bold ${
                  child.performance === 'Excellent' ? 'text-accent-green' :
                  child.performance === 'Good' ? 'text-primary-blue' :
                  child.performance === 'Poor' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {child.performance || 'N/A'}
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/50">
                <p className="text-xs text-gray-500 mb-1">Attendance</p>
                <p className="text-lg font-bold text-gray-800">{child.attendance_average || 0}%</p>
              </div>
            </div>
            {child.awards && Array.isArray(child.awards) && child.awards.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Awards</p>
                <div className="flex flex-wrap gap-1">
                  {child.awards.map((award, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-accent-yellow/10 text-amber-600">
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

// Main ChildrenManagement Component
export default function ChildrenManagement() {
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

  // Tab management - includes audit trail
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'deactivated' | 'attendance' | 'audit-trail'
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
      let query = supabase
        .from('children')
        .select(`
          *,
          profiles!parent_id(id, full_name, phone, email),
          classes!class_id(id, name)
        `)
        .eq('status', 'ACTIVE')
        .order('full_name', { ascending: true })

      const { data, error } = await query
      if (error) throw error
      setChildren(data || [])
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
    if (activeTab === 'active') {
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

      if (activeTab === 'active') {
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

      if (activeTab === 'deactivated') {
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

      if (activeTab === 'deactivated') {
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

  const filteredChildren = (activeTab === 'active' ? children : deactivatedChildren).filter(child => {
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

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p>Loading children...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      {/* Sub-tabs for Children Management */}
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'active'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Students ({children.length})
        </button>
        <button
          onClick={() => setActiveTab('deactivated')}
          className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'deactivated'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Deactivated ({deactivatedChildren.length})
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Attendance
        </button>

        <button
          onClick={() => setActiveTab('audit-trail')}
          className={`pb-3 px-1 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'audit-trail'
              ? 'border-b-2 border-primary-blue text-primary-blue'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText size={16} />
          Audit Trail
        </button>
      </div>

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

      {/* Content based on active tab */}
      {activeTab === 'attendance' ? (
        <AttendanceManagement />
      ) : activeTab === 'audit-trail' ? (
        <StatusAuditTrail />
      ) : (
        <>
          {/* Children Grid */}
          {filteredChildren.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {activeTab === 'active' ? 'No active children found' : 'No deactivated children found'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'active'
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
                    isDeactivated={activeTab === 'deactivated'}
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

      {/* Child Drawer */}
      {selectedChild && (
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
import { useState, useEffect } from 'react'
import { Search, ChevronDown, UserPlus, X, Phone, Mail, FileText, TrendingUp, DollarSign, Loader2, AlertCircle, User } from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'
import SkeletonCard from './ui/SkeletonCard'
import FullScreenLoader from './ui/FullScreenLoader'
import { supabase } from '../lib/supabaseClient'

// Staff Data (mock - kept for fallback)
const staffData = [
  { id: 1, name: 'Maria Garcia', role: 'Teacher', assignedClass: 'Sunbeam', status: 'active', photo: '👩‍🏫', email: 'maria.garcia@childtrack.com', phone: '(555) 234-5678', hireDate: '2022-01-15', salary: '$4,500/month', payrollStatus: 'Current', performance: 'Excellent', notes: 'Lead teacher for Sunbeam class. Excellent with children.', documents: ['Contract', 'Background Check', 'Certification'] },
  { id: 2, name: 'John Smith', role: 'Teacher', assignedClass: 'Rainbow', status: 'active', photo: '👨‍🏫', email: 'john.smith@childtrack.com', phone: '(555) 345-6789', hireDate: '2021-08-20', salary: '$4,200/month', payrollStatus: 'Current', performance: 'Good', notes: 'Experienced teacher, great curriculum planning.', documents: ['Contract', 'Background Check'] },
  { id: 3, name: 'Sarah Johnson', role: 'Assistant', assignedClass: 'Starlight', status: 'active', photo: '👩‍🦰', email: 'sarah.johnson@childtrack.com', phone: '(555) 456-7890', hireDate: '2023-03-10', salary: '$3,200/month', payrollStatus: 'Current', performance: 'Excellent', notes: 'Very patient with young children.', documents: ['Contract', 'Background Check', 'First Aid'] },
  { id: 4, name: 'Michael Brown', role: 'Admin', assignedClass: 'Office', status: 'active', photo: '👨‍💼', email: 'michael.brown@childtrack.com', phone: '(555) 567-8901', hireDate: '2020-05-01', salary: '$5,500/month', payrollStatus: 'Current', performance: 'Excellent', notes: 'Handles all administrative tasks efficiently.', documents: ['Contract', 'Background Check'] },
  { id: 5, name: 'Emily Davis', role: 'Assistant', assignedClass: 'Butterfly', status: 'on_leave', photo: '👩‍🦱', email: 'emily.davis@childtrack.com', phone: '(555) 678-9012', hireDate: '2023-06-15', salary: '$3,100/month', payrollStatus: 'Current', performance: 'Good', notes: 'Currently on maternity leave.', documents: ['Contract', 'Background Check'] },
  { id: 6, name: 'Robert Wilson', role: 'Teacher', assignedClass: 'Rainbow', status: 'active', photo: '👨‍🦲', email: 'robert.wilson@childtrack.com', phone: '(555) 789-0123', hireDate: '2022-09-01', salary: '$4,300/month', payrollStatus: 'Pending', performance: 'Good', notes: 'New teacher, adapting well to the environment.', documents: ['Contract', 'Background Check'] },
  { id: 7, name: 'Lisa Martinez', role: 'Assistant', assignedClass: 'Sunbeam', status: 'active', photo: '👩', email: 'lisa.martinez@childtrack.com', phone: '(555) 890-1234', hireDate: '2023-01-20', salary: '$3,000/month', payrollStatus: 'Current', performance: 'Excellent', notes: 'Creative activities coordinator.', documents: ['Contract', 'Background Check', 'Art Certification'] },
  { id: 8, name: 'David Lee', role: 'Admin', assignedClass: 'Office', status: 'active', photo: '👨', email: 'david.lee@childtrack.com', phone: '(555) 901-2345', hireDate: '2021-11-10', salary: '$5,000/month', payrollStatus: 'Current', performance: 'Excellent', notes: 'Manages payroll and finances.', documents: ['Contract', 'Background Check'] },
]

// Staff Card Component
function StaffCard({ staff, onClick, isActive }) {
  const roleColors = {
    Teacher: 'bg-primary-blue/10 text-primary-blue',
    Assistant: 'bg-accent-purple/10 text-accent-purple',
    Admin: 'bg-accent-yellow/10 text-amber-600',
  }

  const statusColors = {
    active: 'bg-accent-green/10 text-accent-green',
    on_leave: 'bg-accent-yellow/10 text-amber-600',
  }

  return (
    <div 
      onClick={onClick}
      className={`glass-card rounded-card p-5 card-hover cursor-pointer animate-slide-up ${isActive ? 'border-2 border-accent-green/50 glow-active' : ''}`}
    >
      <div className="flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${staff.status === 'active' ? 'from-primary-blue to-primary-coral' : 'from-gray-300 to-gray-400'} p-[3px] mb-4 ${staff.status === 'active' ? 'shadow-lg shadow-primary-blue/30' : ''}`}>
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className="text-4xl">{staff.photo}</span>
          </div>
        </div>
        
        <h3 className="font-heading font-bold text-lg text-gray-800">{staff.name}</h3>
        
        <div className="mt-2 px-3 py-1 rounded-full">
          <span className={`text-sm font-medium ${roleColors[staff.role]}`}>{staff.role}</span>
        </div>
        
        <div className="mt-2 px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-sm font-medium text-gray-600">{staff.assignedClass}</span>
        </div>
        
        <span className={`mt-3 text-xs px-3 py-1 rounded-full ${statusColors[staff.status]}`}>
          {staff.status === 'active' ? '● Active' : '○ On Leave'}
        </span>
      </div>
    </div>
  )
}

// Staff Detail Drawer Component
function StaffDrawer({ staff, onClose }) {
  if (!staff) return null

  const roleColors = {
    Teacher: 'bg-primary-blue/10 text-primary-blue',
    Assistant: 'bg-accent-purple/10 text-accent-purple',
    Admin: 'bg-accent-yellow/10 text-amber-600',
  }

  const statusColors = {
    active: 'bg-accent-green/10 text-accent-green',
    on_leave: 'bg-accent-yellow/10 text-amber-600',
  }

  const payrollColors = {
    Current: 'bg-accent-green/10 text-accent-green',
    Pending: 'bg-accent-yellow/10 text-amber-600',
    Overdue: 'bg-red-100 text-red-600',
  }

  const performanceColors = {
    Excellent: 'bg-accent-green/10 text-accent-green',
    Good: 'bg-primary-blue/10 text-primary-blue',
    Fair: 'bg-accent-yellow/10 text-amber-600',
    Poor: 'bg-red-100 text-red-600',
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[420px] glass-card rounded-l-large z-50 overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-white/70 backdrop-blur-glass p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-gray-800">Staff Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral p-[3px] mb-4 shadow-lg">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-5xl">{staff.photo}</span>
              </div>
            </div>
            <h3 className="font-heading font-bold text-2xl text-gray-800">{staff.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-sm px-3 py-1 rounded-full ${roleColors[staff.role]}`}>{staff.role}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${statusColors[staff.status]}`}>
                {staff.status === 'active' ? '● Active' : '○ On Leave'}
              </span>
            </div>
            <p className="text-gray-500 mt-2">{staff.assignedClass}</p>
          </div>

          {/* Contact Info */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={18} className="text-primary-blue" />
              <h4 className="font-heading font-semibold text-gray-800">Contact Information</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800">{staff.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{staff.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-accent-purple" />
              <h4 className="font-heading font-semibold text-gray-800">Employment Details</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-white/50">
                <span className="text-sm text-gray-500">Hire Date</span>
                <span className="text-sm font-medium text-gray-800">{new Date(staff.hireDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-white/50">
                <span className="text-sm text-gray-500">Assigned Class</span>
                <span className="text-sm font-medium text-gray-800">{staff.assignedClass}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-white/50">
                <span className="text-sm text-gray-500">Salary</span>
                <span className="text-sm font-medium text-gray-800">{staff.salary}</span>
              </div>
            </div>
          </div>

          {/* Payroll Status */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-accent-green" />
              <h4 className="font-heading font-semibold text-gray-800">Payroll Status</h4>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${payrollColors[staff.payrollStatus]}`}>
                {staff.payrollStatus}
              </span>
            </div>
          </div>

          {/* Performance Notes */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-accent-pink" />
              <h4 className="font-heading font-semibold text-gray-800">Performance</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                <span className="text-sm text-gray-500">Rating</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${performanceColors[staff.performance]}`}>
                  {staff.performance}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/50">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-800">{staff.notes}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-accent-yellow" />
              <h4 className="font-heading font-semibold text-gray-800">Documents</h4>
            </div>
            <div className="space-y-2">
              {staff.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                  <span className="text-xs text-primary-blue font-medium">View</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Staff Management Screen
export default function StaffScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [staffList, setStaffList] = useState([])
  
  // Add Staff Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [classOptions, setClassOptions] = useState([])
  
  // Form state
  const initialFormState = {
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_title: 'Teacher',
    assigned_class: '',
    phone: ''
  }
  const [newStaff, setNewStaff] = useState(initialFormState)

  // Named fetch function to be reused
  const fetchStaff = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch all data in parallel (avoiding join RLS issues)
      const [staffRes, profilesRes, classesRes] = await Promise.all([
        supabase.from('staff').select('id, role_title, assigned_class, status, created_at'),
        supabase.from('profiles').select('id, full_name, email, phone'), // Only core columns
        supabase.from('classes').select('id, name')
      ])

      // Check for errors
      if (staffRes.error) throw staffRes.error
      if (profilesRes.error) throw profilesRes.error
      if (classesRes.error) throw classesRes.error

      // Build lookup maps
      const profilesMap = (profilesRes.data || []).reduce((acc, p) => {
        acc[p.id] = p
        return acc
      }, {})

      const classesMap = (classesRes.data || []).reduce((acc, c) => {
        acc[c.id] = c.name
        return acc
      }, {})

      // Also set class options for dropdown (used in Add Modal)
      setClassOptions(classesRes.data || [])

      // Transform data by joining in memory
      const transformedData = (staffRes.data || []).map(staff => {
        const profile = profilesMap[staff.id] || {}
        const assignedClassName = staff.assigned_class ? (classesMap[staff.assigned_class] || 'Unknown Class') : 'Unassigned'
        
        return {
          id: staff.id,
          name: profile.full_name || 'Unknown',
          role: staff.role_title || 'Staff',
          assignedClass: assignedClassName,
          status: staff.status?.toLowerCase() || 'active',
          photo: profile.avatar_url ? '👤' : '👨‍🏫',
          email: profile.email || '',
          phone: profile.phone || '',
          hireDate: staff.created_at ? new Date(staff.created_at).toLocaleDateString() : '',
          salary: '$3,500/month',
          payrollStatus: 'Current',
          performance: 'Good',
          notes: profile.bio || 'No additional notes.',
          documents: ['Contract', 'Background Check'],
          fullProfile: profile,
          classDetails: null
        }
      })

      setStaffList(transformedData)
    } catch (err) {
      const errorMessage = err?.message || err?.toString() || 'Unknown error'
      setError(`Failed to load staff data: ${errorMessage}`)
      console.error('Staff fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Live Supabase query
  useEffect(() => {
    fetchStaff()
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [selectedStaff, setSelectedStaff] = useState(null)

  const roles = ['all', 'Teacher', 'Assistant', 'Admin']
  const statuses = ['all', 'active', 'on_leave']
  const classes = ['all', 'Sunbeam', 'Rainbow', 'Starlight', 'Butterfly', 'Office']

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || staff.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter
    const matchesClass = classFilter === 'all' || staff.assignedClass === classFilter
    return matchesSearch && matchesRole && matchesStatus && matchesClass
  })

  // Handle adding new staff
  const handleAddStaff = async (e) => {
    e.preventDefault()
    setAddError(null)

    // Validation
    if (!newStaff.full_name.trim()) {
      setAddError('Full name is required')
      return
    }
    if (!newStaff.email.trim() || !newStaff.email.includes('@')) {
      setAddError('Valid email is required')
      return
    }
    if (!newStaff.password) {
      setAddError('Password is required')
      return
    }
    if (newStaff.password !== newStaff.confirmPassword) {
      setAddError('Passwords do not match')
      return
    }
    if (newStaff.password.length < 6) {
      setAddError('Password must be at least 6 characters')
      return
    }

    setIsAdding(true)

    try {
      // Get admin session
      const { data: { session: adminSession } } = await supabase.auth.getSession()
      if (!adminSession) {
        throw new Error('No active admin session. Please log in as admin first.')
      }

      // Store admin tokens
      const adminAccessToken = adminSession.access_token
      const adminRefreshToken = adminSession.refresh_token

      // Create user (this switches session to new user)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newStaff.email,
        password: newStaff.password,
        options: {
          data: { full_name: newStaff.full_name },
          emailRedirectTo: window.location.origin
        }
      })

      if (signUpError) throw signUpError
      if (!signUpData.user) throw new Error('Failed to create user')

      const userId = signUpData.user.id

      // Restore admin session
      const { error: restoreError1 } = await supabase.auth.setSession({
        access_token: adminAccessToken,
        refresh_token: adminRefreshToken
      })
      if (restoreError1) {
        // Try refresh
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) {
          throw new Error('Cannot restore admin session after user creation.')
        }
      }

      // Short delay to ensure session is ready
      await new Promise(resolve => setTimeout(resolve, 200))

      // Verify we're admin
      const { data: { session: verifySession } } = await supabase.auth.getSession()
      const { data: adminVerify } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', verifySession?.user?.id)
        .single()

      if (adminVerify?.role !== 'ADMIN') {
        throw new Error('Admin privileges lost. Please log out and log back in as admin, then retry.')
      }

      // Update profile to STAFF
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: newStaff.full_name,
          role: 'STAFF',
          phone: newStaff.phone || null
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Profile update failed:', profileError)
        if (profileError.code === '42501') {
          throw new Error('Permission denied: Cannot update profile. Admin session may have expired.')
        }
        throw new Error(`Profile update error: ${profileError.message}`)
      }

      // Insert into staff
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          id: userId,
          role_title: newStaff.role_title,
          assigned_class: newStaff.assigned_class || null,
          status: 'ACTIVE'
        })

      if (staffError) {
        console.error('Staff insert failed:', staffError)
        if (staffError.code === '42501' || staffError.code === '23503') {
          throw new Error(`Permission or foreign key error: ${staffError.message}`)
        }
        throw new Error(`Staff creation error: ${staffError.message}`)
      }

      // Success
      setShowAddModal(false)
      setNewStaff(initialFormState)
      await fetchStaff()
      alert('Staff member added successfully!')
    } catch (err) {
      console.error('Add staff error:', err)
      setAddError(err.message || 'Failed to add staff member')
   } finally {
     setIsAdding(false)
   }
  }

const handleInputChange = (e) => {
  const { name, value } = e.target
  setNewStaff(prev => ({ ...prev, [name]: value }))
}

return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-72 rounded-xl bg-white/70 border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue
                         text-sm transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-4 pr-10 py-2.5 w-full sm:w-40 rounded-xl bg-white/70 border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-sm transition-all appearance-none cursor-pointer"
            >
              {roles.map(r => (
                <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-10 py-2.5 w-full sm:w-40 rounded-xl bg-white/70 border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-sm transition-all appearance-none cursor-pointer"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Status' : s === 'active' ? 'Active' : 'On Leave'}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Class Filter */}
          <div className="relative">
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="pl-4 pr-10 py-2.5 w-full sm:w-44 rounded-xl bg-white/70 border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-sm transition-all appearance-none cursor-pointer"
            >
              {classes.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Classes' : c}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Add Staff Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-gradient-coral px-5 py-2.5 rounded-xl text-white font-medium shadow-lg text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:shadow-xl transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Loading...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Add Staff
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <>
          <FullScreenLoader message="Fetching staff directory..." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 opacity-0">
            <SkeletonCard count={4} />
          </div>
        </>
      ) : error ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-2xl mx-auto animate-fade-in">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h3 className="font-heading text-2xl font-bold text-gray-800 mb-4">Unable to Load Staff</h3>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Retry Loading Staff
          </button>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <Users className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="font-heading text-2xl font-bold text-gray-800 mb-4">No Staff Members Found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your search filters or add new staff members.</p>
           <button 
             onClick={() => setShowAddModal(true)}
             className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2"
           >
             <UserPlus className="w-5 h-5" />
             Add First Staff Member
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 [&>*]:animate-fade-in">
          {filteredStaff.map((staff, index) => (
            <div key={staff.id} style={{ animationDelay: `${index * 50}ms` }}>
              <StaffCard 
                staff={staff} 
                onClick={() => setSelectedStaff(staff)}
                isActive={staff.status === 'active'}
              />
            </div>
          ))}
        </div>
      )}

       {/* Staff Detail Drawer */}
       {selectedStaff && (
         <StaffDrawer 
           staff={selectedStaff} 
           onClose={() => setSelectedStaff(null)} 
         />
       )}

       {/* Add Staff Modal */}
       {showAddModal && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
           <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
             <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
               <h3 className="text-2xl font-bold text-gray-800">Add New Staff Member</h3>
               <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                 <X size={24} className="text-gray-600" />
               </button>
             </div>

             <form onSubmit={handleAddStaff} className="p-6 space-y-6">
               {addError && (
                 <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                   {addError}
                 </div>
               )}

               {/* Basic Information */}
               <div className="space-y-4">
                 <h4 className="font-heading font-semibold text-gray-800">Basic Information</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                     <input
                       type="text"
                       name="full_name"
                       required
                       value={newStaff.full_name}
                       onChange={handleInputChange}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                       placeholder="Enter full name"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                     <input
                       type="email"
                       name="email"
                       required
                       value={newStaff.email}
                       onChange={handleInputChange}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                       placeholder="email@example.com"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                     <input
                       type="password"
                       name="password"
                       required
                       value={newStaff.password}
                       onChange={handleInputChange}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                       placeholder="At least 6 characters"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                     <input
                       type="password"
                       name="confirmPassword"
                       required
                       value={newStaff.confirmPassword}
                       onChange={handleInputChange}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                       placeholder="Confirm password"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                   <input
                     type="tel"
                     name="phone"
                     value={newStaff.phone}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                     placeholder="(555) 123-4567"
                   />
                 </div>
               </div>

               {/* Employment Details */}
               <div className="space-y-4 pt-4 border-t border-gray-200">
                 <h4 className="font-heading font-semibold text-gray-800">Employment Details</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                     <select
                       name="role_title"
                       value={newStaff.role_title}
                       onChange={handleInputChange}
                       className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                     >
                       <option value="Teacher">Teacher</option>
                       <option value="Assistant">Assistant</option>
                       <option value="Admin">Admin</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Class</label>
                      <select
                        name="assigned_class"
                        value={newStaff.assigned_class}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                      >
                        <option value="">Select Class</option>
                        {classOptions.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                   </div>
                 </div>
               </div>

               {/* Actions */}
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
                   disabled={isAdding}
                   className="flex-1 btn-gradient-coral px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   {isAdding ? (
                     <>
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Creating...
                     </>
                   ) : (
                     'Create Staff Member'
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


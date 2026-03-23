import { useState, useEffect } from 'react'
import { Search, ChevronDown, UserPlus, X, Phone, Mail, FileText, TrendingUp, DollarSign, Loader2, AlertCircle } from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'
import SkeletonCard from './ui/SkeletonCard'
import FullScreenLoader from './ui/FullScreenLoader'

// Staff Data (mock API response)
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

  // Live Supabase query
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    const fetchStaff = async () => {
      try {
        const { data, error, count } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'STAFF')
          .order('full_name')

        if (error) throw error
        
        setStaffList(data || [])
      } catch (err) {
        setError('Failed to load staff data. Please check your connection.')
        console.error('Staff fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

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
          <button className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2">
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
    </div>
  )
}


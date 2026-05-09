import { Heart, AlertTriangle, Users, Phone, Mail, Car, GraduationCap, DollarSign } from 'lucide-react'

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

export { ChildCard, StatusBadge }
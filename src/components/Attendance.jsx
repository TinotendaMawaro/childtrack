import { useState, useEffect, useRef } from 'react'
import {
  CheckCircle, XCircle, Users, ChevronDown, ArrowLeft
} from 'lucide-react'
import { useAttendance } from '../hooks/useAttendance'
import { useStaffDashboardData } from '../hooks/useStaffDashboardData'

export default function Attendance({ onClose }) {
  const [selectedClass, setSelectedClass] = useState(null)
  const [showClassSelector, setShowClassSelector] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const classSelectorRef = useRef(null)

  const { markAttendance, getAttendance, getAttendanceStats, loadAttendanceForDate, loading: attendanceLoading } = useAttendance()
  const { classes, children } = useStaffDashboardData()

  // Initialize selected class
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0])
    }
  }, [classes, selectedClass])

  // Load attendance for selected date when class or date changes
  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadAttendanceForDate(selectedDate)
    }
  }, [selectedClass, selectedDate, loadAttendanceForDate])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (classSelectorRef.current && !classSelectorRef.current.contains(event.target)) {
        setShowClassSelector(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const classChildren = selectedClass
    ? children.filter(child => child.class_id === selectedClass.id)
    : []

  const stats = selectedClass
    ? getAttendanceStats(classChildren, selectedClass.id, selectedDate)
    : { present: 0, absent: 0, total: 0, marked: 0 }

  // Mark single child
  const markForChild = async (childId, status) => {
    if (!selectedClass) return
    await markAttendance(selectedClass.id, childId, status, selectedDate)
  }

  // Bulk mark all
  const handleMarkAll = async (status) => {
    if (!selectedClass || classChildren.length === 0) return
    setIsSubmitting(true)
    try {
      await Promise.all(
        classChildren.map(child =>
          markAttendance(selectedClass.id, child.id, status, selectedDate)
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit attendance
  const handleSubmitAttendance = async () => {
    setIsSubmitting(true)
    try {
      alert('Attendance submitted successfully!')
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-heading font-bold text-gray-700">No Classes Assigned</h2>
          <p className="text-gray-500 mt-2">You don't have any classes assigned yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-glass border-b border-gray-200/50 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-heading font-bold text-gray-800">Take Attendance</h1>
          <div className="w-8"></div>
        </div>

        <div className="flex gap-2">
          {/* Class Selector */}
          <div className="relative flex-1" ref={classSelectorRef}>
            <button
              onClick={() => setShowClassSelector(!showClassSelector)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 truncate">{selectedClass.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showClassSelector && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setSelectedClass(cls)
                      setShowClassSelector(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                      selectedClass.id === cls.id ? 'bg-accent-green/10 text-accent-green' : 'text-gray-700'
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector */}
          <div className="flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-primary-blue/30 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Progress: {stats.marked}/{stats.total}</span>
            <span className="font-medium text-gray-800">{stats.total > 0 ? Math.round((stats.marked / stats.total) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-accent-green to-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${stats.total > 0 ? (stats.marked / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 pb-24">
        {/* Bulk Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleMarkAll('present')}
            disabled={attendanceLoading || classChildren.length === 0}
            className="flex-1 py-2 bg-accent-green text-white rounded-xl font-medium shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 animate-pulse-glow"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            disabled={attendanceLoading || classChildren.length === 0}
            className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <XCircle className="w-4 h-4" />
            Mark All Absent
          </button>
        </div>

        {/* Students List */}
        <div className="space-y-2">
          {classChildren.map((child, index) => {
            const status = getAttendance(selectedClass.id, child.id, selectedDate)
            const isPresent = status === 'present'
            const isAbsent = status === 'absent'
            const initials = child.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)
            const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'

            return (
              <div
                key={child.id}
                className="glass-card p-3 rounded-2xl flex items-center gap-3 animate-slide-up hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Profile Photo */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-white">
                  {child.photo_url ? (
                    <img src={child.photo_url} alt={child.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-white">{initials}</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{child.full_name}</h3>
                  <p className="text-xs text-gray-500">{age} yrs</p>
                </div>

                {/* Attendance Toggle */}
                <div className="flex flex-col items-end">
                  <div
                    className={`flex w-28 h-8 rounded-full overflow-hidden shadow-md transition-shadow duration-300 ${
                      isPresent ? 'ring-2 ring-accent-green/50 ring-offset-1' : isAbsent ? 'ring-2 ring-red-500/50 ring-offset-1' : ''
                    }`}
                  >
                    <button
                      onClick={() => markForChild(child.id, 'present')}
                      disabled={attendanceLoading}
                      className={`flex-1 text-xs font-medium transition-colors flex items-center justify-center ${
                        isPresent ? 'bg-accent-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markForChild(child.id, 'absent')}
                      disabled={attendanceLoading}
                      className={`flex-1 text-xs font-medium transition-colors flex items-center justify-center ${
                        isAbsent ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {isPresent ? '✓ Marked' : isAbsent ? '✗ Marked' : 'Pending'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {classChildren.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700">No Students</h3>
            <p className="text-gray-500">This class has no assigned students.</p>
          </div>
        )}
      </main>

      {/* Bottom Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-glass border-t border-gray-200/50">
        <button
          onClick={handleSubmitAttendance}
          disabled={isSubmitting || stats.marked === 0}
          className="w-full py-4 bg-gradient-to-r from-accent-green to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-accent-green/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-pulse-glow"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          Submit Attendance ({stats.present} Present, {stats.absent} Absent)
        </button>
      </div>
    </div>
  )
}

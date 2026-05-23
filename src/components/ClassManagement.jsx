import { useState, useRef, useEffect } from 'react'
import {
  GraduationCap, ChevronDown, CheckCircle, X, MessageSquare,
  Users, Heart, AlertTriangle, Phone, Mail, Clock, Baby
} from 'lucide-react'
import { useStaffDashboardData } from '../hooks/useStaffDashboardData'
import { useAttendance } from '../hooks/useAttendance'

// Child Profile Drawer Component
function ChildDrawer({ child, onClose, markAttendance, getTodayAttendance }) {
  const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'
  const todayStatus = getTodayAttendance(child.class_id, child.id)
  const health = child.health_status || 'No health information provided'
  const allergies = child.allergies || []
  const parent = child.profiles

  const getAttendanceColor = () => {
    if (todayStatus === 'present') return 'text-accent-green bg-accent-green/10'
    if (todayStatus === 'absent') return 'text-red-600 bg-red-100'
    if (todayStatus === 'late') return 'text-amber-600 bg-accent-yellow/10'
    return 'text-gray-500 bg-gray-100'
  }

  const getAttendanceLabel = () => {
    if (todayStatus === 'present') return 'Present'
    if (todayStatus === 'absent') return 'Absent'
    if (todayStatus === 'late') return 'Late'
    return 'Not marked'
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-11/12 max-w-md glass-card shadow-2xl z-50 transform transition-transform animate-slide-in-right overflow-hidden">
        <div className="sticky top-0 p-6 border-b bg-white/80 backdrop-blur-xl z-10 flex items-center justify-between">
          <h2 className="font-bold text-2xl text-gray-800">Child Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center mb-8 pb-6 border-b px-6 pt-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral p-[4px] mb-4">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {child.photo_url?.startsWith('http') ? (
                  <img src={child.photo_url} alt={child.full_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-5xl">{child.photo_url || '👶'}</span>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{child.full_name}</h3>
            <p className="text-gray-600 mb-4">{age} years • {child.classes?.name || 'Unassigned'}</p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-500">Today:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceColor()}`}>
                ● {getAttendanceLabel()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => markAttendance(child.class_id, child.id, todayStatus === 'present' ? 'absent' : 'present')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  todayStatus === 'present'
                    ? 'bg-accent-green/10 text-accent-green border-2 border-accent-green/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-accent-green/10 hover:text-accent-green'
                }`}
              >
                {todayStatus === 'present' ? '✓ Present' : 'Mark Present'}
              </button>
              <button
                onClick={() => markAttendance(child.class_id, child.id, todayStatus === 'absent' ? 'present' : 'absent')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  todayStatus === 'absent'
                    ? 'bg-red-100 text-red-600 border-2 border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                {todayStatus === 'absent' ? '✗ Absent' : 'Mark Absent'}
              </button>
            </div>
          </div>

          <div className="glass-card-inner mx-6 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-accent-pink" />
              <h4 className="font-semibold text-lg">Health Information</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Health Status</span>
                <p className="font-medium text-gray-800">{health}</p>
              </div>
              {allergies.length > 0 && (
                <div>
                  <span className="text-gray-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Allergies
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {allergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card-inner mx-6 p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary-blue" />
              <h4 className="font-semibold text-lg">Parent Contact</h4>
            </div>
            {parent ? (
              <div className="p-4 rounded-xl bg-white/50 border-l-4 border-primary-blue">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-gray-800">{parent.full_name}</h5>
                  <span className="text-xs bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full">Parent</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /><span>{parent.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /><span>{parent.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No parent information available</p>
            )}
          </div>

          <div className="mx-6 mb-6 text-xs text-gray-400 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Last updated: {new Date(child.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  )
}

// Swipeable Child Card Component
function SwipeableChildCard({ child, index, selectedClassId, markAttendance, getTodayAttendance, onCardClick }) {
  const [translateX, setTranslateX] = useState(0)
  const [glowColor, setGlowColor] = useState('')
  const startX = useRef(0)
  const isDragging = useRef(false)

  const todayStatus = getTodayAttendance(selectedClassId, child.id)
  const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'

  const handleStart = (clientX) => {
    isDragging.current = true
    startX.current = clientX
    setGlowColor('')
  }

  const handleMove = (clientX) => {
    if (!isDragging.current) return
    const deltaX = clientX - startX.current
    setTranslateX(deltaX)
  }

  const handleEnd = () => {
    isDragging.current = false
    if (translateX > 100) {
      setTranslateX(200)
      setTimeout(() => {
        markAttendance(selectedClassId, child.id, 'present')
        setTranslateX(0)
        setGlowColor('')
      }, 200)
      setGlowColor('green')
    } else if (translateX < -100) {
      setTranslateX(-200)
      setTimeout(() => {
        markAttendance(selectedClassId, child.id, 'absent')
        setTranslateX(0)
        setGlowColor('')
      }, 200)
      setGlowColor('red')
    } else {
      setTranslateX(0)
    }
  }

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX)
  }
  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX)
  }
  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    handleStart(e.clientX)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  const getBackground = () => {
    if (todayStatus === 'present') return 'from-accent-green/5 to-accent-green/10'
    if (todayStatus === 'absent') return 'from-red-100/50 to-red-100/30'
    return 'from-primary-blue/5 to-primary-coral/5'
  }

  const getStatusIndicator = () => {
    if (todayStatus === 'present') return <div className="w-2 h-2 rounded-full bg-accent-green" />
    if (todayStatus === 'absent') return <div className="w-2 h-2 rounded-full bg-red-500" />
    return <div className="w-2 h-2 rounded-full bg-gray-400" />
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up group"
      style={{
        transform: `translateX(${translateX}px)`,
        animationDelay: `${index * 100}ms`,
        boxShadow: glowColor === 'green' ? '0 0 30px rgba(110, 231, 183, 0.8)' :
                   glowColor === 'red' ? '0 0 30px rgba(239, 68, 68, 0.8)' : undefined
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onClick={() => !isDragging.current && onCardClick(child)}
    >
      <div className="absolute inset-0 flex">
        <div
          className={`flex-1 transition-opacity duration-300 ${translateX < 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        >
          <div className="h-full flex items-center justify-end pr-6">
            <X className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div
          className={`flex-1 transition-opacity duration-300 ${translateX > 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundColor: 'rgba(110, 231, 183, 0.1)' }}
        >
          <div className="h-full flex items-center justify-start pl-6">
            <CheckCircle className="w-8 h-8 text-accent-green" />
          </div>
        </div>
      </div>

      <div className={`relative bg-gradient-to-br ${getBackground()} p-5`}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral p-[3px] flex-shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {child.photo_url?.startsWith('http') ? (
                <img src={child.photo_url} alt={child.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">{child.photo_url || '👶'}</span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-800 truncate">{child.full_name}</h3>
              {getStatusIndicator()}
            </div>
            <p className="text-sm text-gray-600 mb-3">{age} years old</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Attendance</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newStatus = todayStatus === 'present' ? 'absent' : 'present'
                    markAttendance(selectedClassId, child.id, newStatus)
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    todayStatus === 'present' ? 'bg-accent-green' : 'bg-gray-300'
                  }`}
                  aria-label={`Toggle attendance: currently ${todayStatus || 'not marked'}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                      todayStatus === 'present' ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <span className={`text-xs font-medium ${todayStatus === 'present' ? 'text-accent-green' : 'text-gray-500'}`}>
                {todayStatus === 'present' ? 'Present' : todayStatus === 'absent' ? 'Absent' : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <button
            onClick={(e) => {
              e.stopPropagation()
              const note = prompt('Add a quick note about this child:')
              if (note?.trim()) {
                const today = new Date().toISOString().split('T')[0]
                const key = `note_${child.id}_${today}`
                const existing = JSON.parse(localStorage.getItem('childtrack_notes') || '{}')
                existing[key] = {
                  childId: child.id,
                  childName: child.full_name,
                  note: note.trim(),
                  date: today,
                  timestamp: new Date().toISOString()
                }
                localStorage.setItem('childtrack_notes', JSON.stringify(existing))
                alert('Note saved!')
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white/60 hover:bg-white/80 rounded-xl text-sm text-gray-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Quick Note
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ClassManagement() {
  const { classes, children, loading } = useStaffDashboardData()
  const { markAttendance, getTodayAttendance, getAttendanceStats } = useAttendance()

  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedChild, setSelectedChild] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0])
    }
  }, [classes, selectedClass])

  const selectedClassChildren = children.filter(child => child.class_id === selectedClass?.id)

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading classes...</p>
        </div>
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 glass-card rounded-2xl">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Classes Assigned</h3>
          <p className="text-gray-500">You haven't been assigned to any classes yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">My Classes</h2>
          <p className="text-gray-600">Manage attendance and view student details</p>
        </div>

        <div className="relative">
          <select
            value={selectedClass?.id || ''}
            onChange={(e) => {
              const cls = classes.find(c => c.id === e.target.value)
              setSelectedClass(cls)
            }}
            className="appearance-none pl-4 pr-10 py-3 glass-input rounded-2xl border-none outline-none bg-white/80 backdrop-blur-xl min-w-[200px] cursor-pointer hover:bg-white/90 transition-colors"
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {selectedClass && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-primary-blue/10 flex items-center justify-center">
              <Baby className="w-6 h-6 text-primary-blue" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{selectedClassChildren.length}</p>
            <p className="text-xs text-gray-600">Students</p>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-accent-green/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent-green" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {getAttendanceStats(selectedClassChildren, selectedClass.id).present}
            </p>
            <p className="text-xs text-gray-600">Present Today</p>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-red-100 flex items-center justify-center">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {getAttendanceStats(selectedClassChildren, selectedClass.id).absent}
            </p>
            <p className="text-xs text-gray-600">Absent Today</p>
          </div>
        </div>
      )}

      {selectedClassChildren.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <Baby className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Students</h3>
          <p className="text-gray-500">No children assigned to this class yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {selectedClassChildren.map((child, index) => (
            <SwipeableChildCard
              key={child.id}
              child={child}
              index={index}
              selectedClassId={selectedClass.id}
              markAttendance={markAttendance}
              getTodayAttendance={getTodayAttendance}
              onCardClick={(child) => {
                setSelectedChild(child)
                setShowDrawer(true)
              }}
            />
          ))}
        </div>
      )}

      {selectedChild && showDrawer && (
        <ChildDrawer
          child={selectedChild}
          onClose={() => {
            setShowDrawer(false)
            setSelectedChild(null)
          }}
          markAttendance={markAttendance}
          getTodayAttendance={getTodayAttendance}
        />
      )}
    </div>
  )
}

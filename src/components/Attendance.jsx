import { useState, useEffect, useRef } from 'react'
import {
  CheckCircle, XCircle, Clock, Users, ChevronDown, Check,
  ArrowLeft, ArrowRight, Calendar, TrendingUp
} from 'lucide-react'
import { useAttendance } from '../hooks/useAttendance'
import { useStaffDashboardData } from '../hooks/useStaffDashboardData'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

export default function Attendance({ onClose }) {
  const [selectedClass, setSelectedClass] = useState(null)
  const [showClassSelector, setShowClassSelector] = useState(false)
  const [swipeStates, setSwipeStates] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const classSelectorRef = useRef(null)

  const { markAttendance, getTodayAttendance, getAttendanceStats, loading: attendanceLoading } = useAttendance()
  const { classes, children } = useStaffDashboardData()
  const { profile } = useAuth()

  // Initialize selected class
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0])
    }
  }, [classes, selectedClass])

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

  // Get children for selected class
  const classChildren = selectedClass ?
    children.filter(child => child.class_id === selectedClass.id) : []

  // Handle swipe gestures
  const handleTouchStart = (childId, e) => {
    const touch = e.touches[0]
    setSwipeStates(prev => ({
      ...prev,
      [childId]: {
        startX: touch.clientX,
        startY: touch.clientY,
        swiping: false
      }
    }))
  }

  const handleTouchMove = (childId, e) => {
    const touch = e.touches[0]
    const state = swipeStates[childId]
    if (!state) return

    const deltaX = touch.clientX - state.startX
    const deltaY = Math.abs(touch.clientY - state.startY)

    // Only start swiping if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > 10 && deltaX > deltaY) {
      e.preventDefault()
      setSwipeStates(prev => ({
        ...prev,
        [childId]: {
          ...state,
          swiping: true,
          currentX: deltaX
        }
      }))
    }
  }

  const handleTouchEnd = async (childId, e) => {
    const state = swipeStates[childId]
    if (!state || !state.swiping) return

    const deltaX = state.currentX

    if (deltaX > 100) {
      // Swipe right - Mark present
      await markAttendance(selectedClass.id, childId, 'present')
    } else if (deltaX < -100) {
      // Swipe left - Mark absent
      await markAttendance(selectedClass.id, childId, 'absent')
    }

    setSwipeStates(prev => ({
      ...prev,
      [childId]: { ...state, swiping: false, currentX: 0 }
    }))
  }

  // Handle manual toggle
  const handleManualToggle = async (childId, currentStatus) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present'
    const result = await markAttendance(selectedClass.id, childId, newStatus)
    console.log('Attendance marked:', { childId, newStatus, result })
  }

  // Debug function to test attendance marking
  const testAttendanceMarking = async () => {
    console.log('=== ATTENDANCE TEST START ===')
    console.log('Selected class:', selectedClass)
    console.log('Class children:', classChildren.length, classChildren)

    if (classChildren.length > 0) {
      const testChild = classChildren[0]
      console.log('Testing attendance for child:', testChild.full_name, testChild.id)

      // Check current status before marking
      const beforeStatus = getTodayAttendance(selectedClass.id, testChild.id)
      console.log('Status before marking:', beforeStatus)

      // Test marking present
      console.log('Marking as PRESENT...')
      const presentResult = await markAttendance(selectedClass.id, testChild.id, 'present')
      console.log('Marked present result:', presentResult)

      // Check if it was saved
      const afterPresentStatus = getTodayAttendance(selectedClass.id, testChild.id)
      console.log('Status after marking present:', afterPresentStatus)

      // Test marking absent
      console.log('Marking as ABSENT...')
      const absentResult = await markAttendance(selectedClass.id, testChild.id, 'absent')
      console.log('Marked absent result:', absentResult)

      const afterAbsentStatus = getTodayAttendance(selectedClass.id, testChild.id)
      console.log('Status after marking absent:', afterAbsentStatus)

      // Final status
      const finalStatus = getTodayAttendance(selectedClass.id, testChild.id)
      console.log('Final status:', finalStatus)

      alert(`Test completed!\nChild: ${testChild.full_name}\nFinal Status: ${finalStatus}\nDatabase Save: ${presentResult.success ? 'SUCCESS' : 'FAILED'}`)

    } else {
      alert(`No children available for testing\nClass: ${selectedClass?.name || 'None'}\nChildren in class: ${classChildren.length}`)
    }
    console.log('=== ATTENDANCE TEST END ===')
  }

  // Function to create sample test data
  const createSampleData = async () => {
    if (classChildren.length === 0) {
      alert('Cannot create sample data - no children in selected class')
      return
    }

    try {
      console.log('Creating sample attendance data...')

      // Mark all children as present for testing
      for (const child of classChildren) {
        await markAttendance(selectedClass.id, child.id, 'present')
        console.log(`Marked ${child.full_name} as present`)
      }

      alert(`Sample data created! Marked ${classChildren.length} children as present.`)
    } catch (error) {
      console.error('Error creating sample data:', error)
      alert('Failed to create sample data')
    }
  }

  // Apply attendance function for "1 class • 1 children" scenario
  const applyAttendanceFunction = async () => {
    if (classes.length !== 1 || classChildren.length !== 1) {
      alert(`This function is designed for exactly 1 class with 1 child.\nCurrent: ${classes.length} classes, ${classChildren.length} children`)
      return
    }

    try {
      console.log('=== APPLYING ATTENDANCE FUNCTION ===')
      console.log(`Class: ${selectedClass.name} (${selectedClass.id})`)
      console.log(`Child: ${classChildren[0].full_name} (${classChildren[0].id})`)

      // Mark the single child as present
      const result = await markAttendance(selectedClass.id, classChildren[0].id, 'present')

      if (result.success) {
        console.log('✅ Attendance marked successfully')
        alert(`✅ Attendance Applied!\n\nClass: ${selectedClass.name}\nChild: ${classChildren[0].full_name}\nStatus: PRESENT\n\nCheck the attendance records to verify.`)
      } else {
        console.log('❌ Attendance marking failed:', result.error)
        alert(`❌ Failed to apply attendance: ${result.error}`)
      }

    } catch (error) {
      console.error('Error applying attendance function:', error)
      alert(`❌ Error: ${error.message}`)
    }
  }

  // Submit all attendance
  const handleSubmitAttendance = async () => {
    setIsSubmitting(true)
    try {
      // All attendance is already saved in real-time, just show success
      // In future, could add batch submission logic here
      alert('Attendance submitted successfully!')
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get swipe style for animation
  const getSwipeStyle = (childId) => {
    const state = swipeStates[childId]
    if (!state?.swiping) return {}

    const translateX = Math.max(-100, Math.min(100, state.currentX))
    return {
      transform: `translateX(${translateX}px)`,
      transition: 'none'
    }
  }

  // Get swipe indicator
  const getSwipeIndicator = (childId) => {
    const state = swipeStates[childId]
    if (!state?.swiping) return null

    const deltaX = state.currentX
    if (deltaX > 50) {
      return (
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
      )
    } else if (deltaX < -50) {
      return (
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-white" />
        </div>
      )
    }
    return null
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

  const stats = getAttendanceStats(classChildren, selectedClass.id)
  const progressPercentage = stats.total > 0 ? Math.round((stats.marked / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-glass border-b border-gray-200/50 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose || (() => window.history.back())}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-heading font-bold text-gray-800">Take Attendance</h1>
          </div>

          {/* Class Selector & Debug */}
          <div className="flex items-center gap-2">
            <div className="relative" ref={classSelectorRef}>
              <button
                onClick={() => setShowClassSelector(!showClassSelector)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{selectedClass.name}</span>
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
                        selectedClass.id === cls.id ? 'bg-primary-blue/10 text-primary-blue' : 'text-gray-700'
                      }`}
                    >
                      {cls.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Debug Test Buttons */}
            <div className="flex gap-1">
              <button
                onClick={applyAttendanceFunction}
                className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors font-medium"
                title="Apply attendance for 1 class • 1 children"
              >
                Apply
              </button>
              <button
                onClick={testAttendanceMarking}
                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs hover:bg-yellow-200 transition-colors"
                title="Test attendance marking function"
              >
                Test
              </button>
              <button
                onClick={createSampleData}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors"
                title="Create sample attendance data"
              >
                Sample
              </button>
            </div>
          </div>

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
                      selectedClass.id === cls.id ? 'bg-primary-blue/10 text-primary-blue' : 'text-gray-700'
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            )}
          </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress: {stats.marked}/{stats.total}</span>
            <span className="font-medium text-gray-800">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-blue to-primary-coral h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {/* Instructions */}
        <div className="mb-6 glass-card p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-primary-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">How to Mark Attendance</h3>
              <p className="text-xs text-gray-600">
                Swipe right to mark present, left to mark absent, or tap the toggle button.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Class: {selectedClass?.name} • Children: {classChildren.length}
              </p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-3">
          {classChildren.map((child) => {
            const currentStatus = getTodayAttendance(selectedClass.id, child.id)
            const isPresent = currentStatus === 'present'
            const isAbsent = currentStatus === 'absent'

            return (
              <div key={child.id} className="relative overflow-hidden">
                {/* Swipe Indicators */}
                {getSwipeIndicator(child.id)}

                {/* Student Card */}
                <div
                  className={`relative glass-card p-4 rounded-2xl transition-all duration-200 ${
                    isPresent ? 'border-l-4 border-green-400 bg-green-50/30' :
                    isAbsent ? 'border-l-4 border-red-400 bg-red-50/30' :
                    'border-l-4 border-gray-300'
                  }`}
                  style={getSwipeStyle(child.id)}
                  onTouchStart={(e) => handleTouchStart(child.id, e)}
                  onTouchMove={(e) => handleTouchMove(child.id, e)}
                  onTouchEnd={(e) => handleTouchEnd(child.id, e)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center relative overflow-hidden">
                        {child.photo_url ? (
                          <img src={child.photo_url} alt={child.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-white">
                            {child.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{child.full_name}</h3>
                        <p className="text-xs text-gray-500">
                          {child.dob ? `${new Date().getFullYear() - new Date(child.dob).getFullYear()} years old` : 'Age unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleManualToggle(child.id, currentStatus)}
                        disabled={attendanceLoading}
                        className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                          isPresent ? 'bg-green-500' :
                          isAbsent ? 'bg-red-500' :
                          'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                          isPresent || isAbsent ? 'right-0.5' : 'left-0.5'
                        }`} />
                      </button>

                      <div className="text-xs font-medium min-w-16 text-center">
                        {isPresent ? 'Present' : isAbsent ? 'Absent' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {classChildren.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700">No Students</h3>
            <p className="text-gray-500 mt-2">This class has no assigned students.</p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-left max-w-xs mx-auto">
              <p><strong>Debug Info:</strong></p>
              <p>Class ID: {selectedClass?.id}</p>
              <p>Total Children: {children.length}</p>
              <p>Children with class_id: {children.filter(c => c.class_id).length}</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-glass border-t border-gray-200/50">
        <button
          onClick={handleSubmitAttendance}
          disabled={isSubmitting || stats.marked === 0}
          className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-coral text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
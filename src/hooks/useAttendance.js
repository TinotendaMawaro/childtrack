import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// Custom hook for managing attendance data
export function useAttendance() {
  const [attendanceData, setAttendanceData] = useState({})
  const [loading, setLoading] = useState(false)

  // Load attendance data from localStorage (for offline support)
  useEffect(() => {
    const saved = localStorage.getItem('childtrack_attendance')
    if (saved) {
      setAttendanceData(JSON.parse(saved))
    }
  }, [])

  // Save attendance data to localStorage (for offline support)
  const saveAttendanceData = (data) => {
    setAttendanceData(data)
    localStorage.setItem('childtrack_attendance', JSON.stringify(data))
  }

  // Mark attendance for a child (saves to both localStorage and database)
  const markAttendance = async (classId, childId, status) => {
    const today = new Date().toISOString().split('T')[0]
    const key = `${today}_${classId}_${childId}`

    try {
      setLoading(true)

      // Get current user for recorded_by
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Save to database
      const { error: dbError } = await supabase
        .from('attendance')
        .upsert({
          child_id: childId,
          class_id: classId,
          date: today,
          status: status.toUpperCase(),
          recorded_by: user.id
        }, {
          onConflict: 'child_id,class_id,date'
        })

      if (dbError) {
        console.error('Database save failed:', dbError)
        // Continue with localStorage fallback
      }

      // Update localStorage (always keep for offline support)
      const newData = {
        ...attendanceData,
        [key]: {
          status,
          timestamp: new Date().toISOString(),
          classId,
          childId
        }
      }
      saveAttendanceData(newData)

      return { success: true }

    } catch (error) {
      console.error('Attendance save error:', error)

      // Fallback to localStorage only
      const newData = {
        ...attendanceData,
        [key]: {
          status,
          timestamp: new Date().toISOString(),
          classId,
          childId
        }
      }
      saveAttendanceData(newData)

      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Get today's attendance for a child
  const getTodayAttendance = (classId, childId) => {
    const today = new Date().toISOString().split('T')[0]
    const key = `${today}_${classId}_${childId}`
    return attendanceData[key]?.status || 'pending'
  }

  // Get attendance stats for a class
  const getAttendanceStats = (classChildren, classId) => {
    const present = classChildren.filter(child => getTodayAttendance(classId, child.id) === 'present').length
    const absent = classChildren.filter(child => getTodayAttendance(classId, child.id) === 'absent').length
    const late = classChildren.filter(child => getTodayAttendance(classId, child.id) === 'late').length
    const total = classChildren.length

    return { present, absent, late, total, marked: present + absent + late }
  }

  // Fetch attendance data from database for a specific date range
  const fetchAttendanceData = async (startDate, endDate, classId = null, childId = null) => {
    try {
      setLoading(true)

      let query = supabase
        .from('attendance')
        .select(`
          *,
          children (
            full_name,
            photo_url
          ),
          classes (
            name
          ),
          profiles!recorded_by (
            full_name
          )
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

      if (classId) query = query.eq('class_id', classId)
      if (childId) query = query.eq('child_id', childId)

      const { data, error } = await query

      if (error) throw error

      return { success: true, data: data || [] }

    } catch (error) {
      console.error('Fetch attendance error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Get attendance summary for a child (daily, monthly, term)
  const getAttendanceSummary = async (childId, termMonths = 3) => {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - termMonths)

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('child_id', childId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])

      if (error) throw error

      // Calculate statistics
      const total = data.length
      const present = data.filter(a => a.status === 'PRESENT').length
      const absent = data.filter(a => a.status === 'ABSENT').length
      const late = data.filter(a => a.status === 'LATE').length
      const excused = data.filter(a => a.status === 'EXCUSED').length

      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0

      return {
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate,
        data
      }

    } catch (error) {
      console.error('Get attendance summary error:', error)
      return { total: 0, present: 0, absent: 0, late: 0, excused: 0, attendanceRate: 0, data: [] }
    }
  }

  return {
    attendanceData,
    loading,
    markAttendance,
    getTodayAttendance,
    getAttendanceStats,
    fetchAttendanceData,
    getAttendanceSummary
  }
}
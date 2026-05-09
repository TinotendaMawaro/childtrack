import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useStaffDashboardData() {
  const [staffProfile, setStaffProfile] = useState(null)
  const [classes, setClasses] = useState([])
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStaffData()
  }, [])

   const fetchStaffData = async () => {
     try {
       setLoading(true)
       setError(null)

       // Get current user
       const { data: { user } } = await supabase.auth.getUser()
       if (!user) throw new Error('No authenticated user')

       // Get staff profile
       const { data: profile, error: profileError } = await supabase
         .from('profiles')
         .select('*')
         .eq('id', user.id)
         .single()

       if (profileError) throw profileError
       setStaffProfile(profile)

       // Get all classes (staff can view all classes per RLS)
       const { data: allClassesData, error: classesError } = await supabase
         .from('classes')
         .select('id, name, curriculum, teacher_id')
         .order('name')

       if (classesError) throw classesError

       // Determine assigned classes based on real data
       let assignedClasses = []

       if (profile.role === 'ADMIN') {
         // Admins see all classes for oversight
         assignedClasses = allClassesData || []
        } else if (profile.role === 'STAFF') {
          // Fetch staff record to get assigned_class (for assistants/assigned staff)
          const { data: staffRecord } = await supabase
            .from('staff')
            .select('assigned_class')
            .eq('id', user.id)
            .maybeSingle()

          const assignedClassId = staffRecord?.assigned_class

          // Combine both: staff may be a teacher (teacher_id) OR explicitly assigned to a class
          assignedClasses = (allClassesData || []).filter(cls =>
            cls.teacher_id === user.id || (assignedClassId && cls.id === assignedClassId)
          )
        }

       // If still no classes, keep empty array (will show "No Classes Assigned")
       setClasses(assignedClasses)

       // Get children assigned to the staff member's classes
       let childrenData = []

       if (profile.role === 'ADMIN') {
         // Admins see all children
         const { data, error } = await supabase
           .from('children')
           .select(`
             *,
             classes (
               name,
               curriculum
             ),
             profiles!parent_id (
               full_name,
               phone,
               email
             )
           `)
           .eq('status', 'ACTIVE')
           .order('full_name')
         if (error) throw error
         childrenData = data || []
       } else if (profile.role === 'STAFF') {
         // Staff only see children in their assigned classes
         if (assignedClasses.length > 0) {
           const assignedClassIds = assignedClasses.map(cls => cls.id)
           const { data, error } = await supabase
             .from('children')
             .select(`
               *,
               classes (
                 name,
                 curriculum
               ),
               profiles!parent_id (
                 full_name,
                 phone,
                 email
               )
             `)
             .eq('status', 'ACTIVE')
             .in('class_id', assignedClassIds)
             .order('full_name')
           if (error) throw error
           childrenData = data || []
         } else {
           // No assigned classes => no children visible
           childrenData = []
         }
       }

       setChildren(childrenData)

     } catch (err) {
       console.error('Error fetching staff dashboard data:', err)
       setError(err.message)
     } finally {
       setLoading(false)
     }
   }

  // Initialize state hooks at the top level (never conditionally)
  const [recentActivities, setRecentActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)

  const fetchRecentActivities = async () => {
    try {
      setActivitiesLoading(true)

      // Try to get real attendance data from localStorage
      const attendanceData = JSON.parse(localStorage.getItem('childtrack_attendance') || '{}')
      const today = new Date().toISOString().split('T')[0]

      const realActivities = []
      Object.entries(attendanceData).forEach(([key, value]) => {
        if (key.startsWith(today)) {
          const [date, classId, childId] = key.split('_')
          const className = classes.find(c => c.id.toString() === classId)?.name || 'Unknown Class'
          const childName = children.find(c => c.id.toString() === childId)?.full_name || 'Unknown Child'

          realActivities.push({
            time: new Date(value.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            action: `Marked ${childName} as ${value.status} in ${className}`,
            type: 'attendance'
          })
        }
      })

      // If no real activities, provide meaningful defaults
      if (realActivities.length === 0) {
        const fallbackActivities = []
        if (classes.length > 0) {
          fallbackActivities.push({
            time: 'Today',
            action: `Ready to take attendance for ${classes.length} class${classes.length > 1 ? 'es' : ''}`,
            type: 'info'
          })
        }
        if (children.length > 0) {
          fallbackActivities.push({
            time: 'Today',
            action: `Managing ${children.length} children across all classes`,
            type: 'info'
          })
        }
        setRecentActivities(fallbackActivities.length > 0 ? fallbackActivities : [
          { time: 'System', action: 'Dashboard initialized successfully', type: 'system' }
        ])
      } else {
        setRecentActivities(realActivities.slice(0, 5))
      }
    } catch (err) {
      console.error('Error fetching activities:', err)
      setRecentActivities([
        { time: 'System', action: 'Dashboard loaded successfully', type: 'system' }
      ])
    } finally {
      setActivitiesLoading(false)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true)

      // Generate personalized announcements based on staff assignments
      const realAnnouncements = []

      if (classes.length === 0) {
        realAnnouncements.push({
          id: 1,
          title: 'Welcome to ChildTrack',
          message: 'You will be assigned to classes soon. Check back later for your class schedule.',
          type: 'info',
          date: new Date().toISOString()
        })
      } else {
        realAnnouncements.push({
          id: 1,
          title: 'Your Classes Today',
          message: `You are assigned to ${classes.length} class${classes.length > 1 ? 'es' : ''}: ${classes.map(c => c.name).join(', ')}.`,
          type: 'info',
          date: new Date().toISOString()
        })

        if (children.length > 0) {
          realAnnouncements.push({
            id: 2,
            title: 'Students Under Your Care',
            message: `You have ${children.length} student${children.length > 1 ? 's' : ''} enrolled in your classes.`,
            type: 'info',
            date: new Date().toISOString()
          })

          // Check for unassigned children
          const unassignedChildren = children.filter(child => !child.class_id)
          if (unassignedChildren.length > 0) {
            realAnnouncements.push({
              id: 3,
              title: 'Unassigned Students',
              message: `${unassignedChildren.length} student${unassignedChildren.length > 1 ? 's are' : ' is'} not assigned to specific classes.`,
              type: 'warning',
              date: new Date().toISOString()
            })
          }
        }
      }

      setAnnouncements(realAnnouncements)
    } catch (err) {
      console.error('Error fetching announcements:', err)
      setAnnouncements([])
    } finally {
      setAnnouncementsLoading(false)
    }
  }

  useEffect(() => {
    if (classes.length > 0 && children.length > 0) {
      fetchRecentActivities()
      fetchAnnouncements()
    }
  }, [classes, children])

  const refetch = () => {
    fetchStaffData()
    fetchRecentActivities()
    fetchAnnouncements()
  }

  return {
    staffProfile,
    classes,
    children,
    recentActivities,
    announcements,
    loading: loading || activitiesLoading || announcementsLoading,
    error,
    refetch
  }
}
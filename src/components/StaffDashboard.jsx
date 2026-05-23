import {
  LayoutDashboard, Users, GraduationCap, Clock, Baby, CheckCircle,
  Check, X, AlertTriangle, Bell, Eye, Trash2, Camera, BookOpen,
  MessageSquare, Calendar, Plus, Home, MessageCircle, User, Upload,
  Heart, Star, ChevronDown, Settings
} from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useAttendance } from '../hooks/useAttendance'
import { useStaffDashboardData } from '../hooks/useStaffDashboardData'
import { useAuth } from '../hooks/useAuth'
import Attendance from './Attendance'
import ClassManagement from './ClassManagement'
import FABMenu from './FABMenu'

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)
  const [diaryEntry, setDiaryEntry] = useState('')
  const [messageText, setMessageText] = useState('')
  const [selectedParent, setSelectedParent] = useState(null)
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const notificationRef = useRef(null)
  const profileRef = useRef(null)
  const fileInputRef = useRef(null)
  const photoInputRef = useRef(null)

  const { markAttendance, getTodayAttendance, getAttendanceStats } = useAttendance()
  const { staffProfile, classes, children, recentActivities, announcements, loading, error } = useStaffDashboardData()
  const { signOut, uploadProfilePic } = useAuth()

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Morning'
    if (hour < 17) return 'Afternoon'
    return 'Evening'
  }

  const [notificationList, setNotificationList] = useState(() =>
    announcements.map((announcement, index) => ({
      id: announcement.id || index + 1,
      title: announcement.title,
      message: announcement.message,
      type: announcement.type || 'info',
      date: announcement.date,
      read: false,
      dismissed: false
    }))
  )

  useEffect(() => {
    setNotificationList(announcements.map((announcement, index) => ({
      id: announcement.id || index + 1,
      title: announcement.title,
      message: announcement.message,
      type: announcement.type || 'info',
      date: announcement.date,
      read: false,
      dismissed: false
    })))
  }, [announcements])

  useEffect(() => {
    setShowAttendanceModal(false)
    setShowPhotoUpload(false)
    setShowDiaryModal(false)
    setShowMessageModal(false)
    setShowScheduleModal(false)
    setShowAttendance(false)
  }, [activeTab])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowAttendanceModal(false)
        setShowPhotoUpload(false)
        setShowDiaryModal(false)
        setShowMessageModal(false)
        setShowScheduleModal(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = (id) => {
    setNotificationList(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    )
  }

  const dismissNotification = (id) => {
    setNotificationList(prev =>
      prev.map(notif => notif.id === id ? { ...notif, dismissed: true } : notif)
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const activeNotifications = notificationList.filter(notif => !notif.dismissed)
  const unreadCount = activeNotifications.filter(notif => !notif.read).length

  const classesData = classes.map((cls, index) => {
    let classChildren = children.filter(child => child.class_id === cls.id)

    if (classChildren.length === 0 && children.length > 0) {
      const hasAssignments = children.some(child => child.class_id)
      if (!hasAssignments) {
        const assignedClassIndex = classes.findIndex(c => c.id === cls.id)
        classChildren = children.filter((_, childIndex) => childIndex % classes.length === assignedClassIndex)
      }
    }

    const startTime = index === 0 ? '9:00 AM' : '1:00 PM'
    const endTime = index === 0 ? '11:30 AM' : '3:30 PM'

    return {
      id: cls.id.toString(),
      name: cls.name,
      time: `${startTime} - ${endTime}`,
      children: classChildren.map(child => ({
        id: child.id,
        name: child.full_name,
        age: child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A',
        photo: child.photo_url || '👶',
        status: 'pending',
        parent: child.profiles
      }))
    }
  })

  const handleImageClick = (e) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Upload Failed',
        message: 'Please select a valid image file (PNG, JPG, etc.)',
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Upload Failed',
        message: 'Image size must be less than 5MB',
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      return
    }

    setUploading(true)
    try {
      await uploadProfilePic(file)
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Profile Updated',
        message: 'Your profile picture has been updated successfully',
        type: 'info',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      e.target.value = ''
    } catch (error) {
      console.error('Upload failed:', error)
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Upload Failed',
        message: `Failed to upload image: ${error.message}`,
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handlePhotoUpload = () => {
    photoInputRef.current?.click()
  }

  const handlePhotoFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    const newPhotos = []

    for (const file of validFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `diary/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error } = await supabase.storage
        .from('diary-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}`)
        continue
      }

      const { data: { publicUrl } } = supabase.storage.from('diary-photos').getPublicUrl(fileName)

      newPhotos.push({
        id: Date.now() + Math.random(),
        name: file.name,
        url: publicUrl,
        date: new Date().toISOString(),
        classId: selectedClass?.id || classes[0]?.id || null
      })
    }

    setUploadedPhotos(prev => [...prev, ...newPhotos])
    setUploading(false)
    setShowPhotoUpload(false)
    e.target.value = ''

    if (newPhotos.length > 0) {
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Photos Uploaded',
        message: `Successfully uploaded ${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''}`,
        type: 'info',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
    }
  }

  const handleSaveDiary = async () => {
    if (!diaryEntry.trim()) {
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Diary Entry Failed',
        message: 'Please enter some diary content',
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      return
    }

    const staffId = staffProfile?.id
    if (!staffId) { alert('Not authenticated'); return }

    const classId = classes.length > 0 ? classes[0].id : null
    if (!classId) { alert('No class assigned'); return }

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('daily_diary')
      .select('id')
      .eq('class_id', classId)
      .eq('date', today)
      .maybeSingle()

    const diaryData = {
      class_id: classId,
      date: today,
      notes: diaryEntry.trim(),
      created_by: staffId,
      photos: uploadedPhotos.map(p => p.url),
    }

    if (existing) {
      await supabase.from('daily_diary').update({
        notes: diaryEntry.trim(),
        photos: diaryData.photos,
      }).eq('id', existing.id)
    } else {
      await supabase.from('daily_diary').insert(diaryData)
    }

    setDiaryEntry('')
    setUploadedPhotos([])
    setShowDiaryModal(false)

    setNotificationList(prev => [{
      id: Date.now(),
      title: 'Diary Saved',
      message: 'Your diary entry has been saved successfully',
      type: 'info',
      date: new Date().toISOString(),
      read: false,
      dismissed: false
    }, ...prev])
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedParent) {
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Message Failed',
        message: 'Please enter a message and select a parent',
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      return
    }

    const staffId = staffProfile?.id
    if (!staffId) { alert('Not authenticated'); return }

    const parentChild = children.find(child => child.profiles?.id === selectedParent.id)
    if (!parentChild) {
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Message Failed',
        message: 'No child found for selected parent in your classes',
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      return
    }

    let { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('staff_id', staffId)
      .eq('parent_id', selectedParent.id)
      .eq('child_id', parentChild.id)
      .maybeSingle()

    let conversationId
    if (conv) {
      conversationId = conv.id
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          staff_id: staffId,
          parent_id: selectedParent.id,
          child_id: parentChild.id,
        })
        .select('id')
        .single()
      conversationId = newConv?.id
      if (!conversationId) {
        setNotificationList(prev => [{
          id: Date.now(),
          title: 'Message Failed',
          message: 'Could not create conversation',
          type: 'warning',
          date: new Date().toISOString(),
          read: false,
          dismissed: false
        }, ...prev])
        return
      }
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: staffId,
        receiver_id: selectedParent.id,
        message: messageText.trim(),
      })

    if (error) {
      console.error('Message error:', error)
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Message Failed',
        message: error.message,
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
    } else {
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Message Sent',
        message: `Message sent to ${selectedParent.full_name}`,
        type: 'info',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      setMessageText('')
      setSelectedParent(null)
      setShowMessageModal(false)
    }
  }

  const handleViewSchedule = () => {
    setShowScheduleModal(true)
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'classes', label: 'Classes', icon: GraduationCap },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-blue to-primary-coral rounded-3xl flex items-center justify-center shadow-xl">
            <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-20 h-20 object-cover rounded-2xl" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Loading Staff Dashboard</h2>
          <p className="text-gray-600">Fetching your classes and attendance data...</p>
          <div className="flex justify-center mt-6">
            <div className="w-12 h-12 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-500 rounded-3xl flex items-center justify-center shadow-xl">
            <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-20 h-20 object-cover rounded-2xl" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-glass border-b border-gray-200/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
            <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-2xl" />
          </div>

          <h1 className="text-base sm:text-lg font-heading font-bold text-gray-800">ChildTrack</h1>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-pink text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse-glow shadow-lg shadow-accent-pink/50">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary-blue hover:text-primary-blue/80 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <X size={14} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {activeNotifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      activeNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                            !notification.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              notification.type === 'info' ? 'bg-primary-blue/10 text-primary-blue' :
                              notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                              'bg-accent-green/10 text-accent-green'
                            }`}>
                              {notification.type === 'info' ? <Bell size={12} /> :
                               notification.type === 'warning' ? <AlertTriangle size={12} /> :
                               <CheckCircle size={12} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs text-gray-800 mb-1">{notification.title}</h4>
                              <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(notification.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-colors"
                                  title="Mark as read"
                                >
                                  <Eye size={12} />
                                </button>
                              )}
                              <button
                                onClick={() => dismissNotification(notification.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Dismiss"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-blue to-primary-coral p-[2px]">
                  <div className="w-full h-full rounded-xl bg-white flex items-center justify-center relative overflow-hidden">
                    {staffProfile?.avatar_url ? (
                      <img
                        src={staffProfile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
                        {staffProfile?.full_name ?
                          staffProfile.full_name.split(' ').map(n => n[0]).join('') :
                          'ST'
                        }
                      </span>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-accent-green rounded-full border-2 border-white flex items-center justify-center">
                  <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800 text-sm">{staffProfile?.full_name || 'Staff Member'}</p>
                      <p className="text-xs text-gray-500">{staffProfile?.email || ''}</p>
                    </div>
                    <button
                      onClick={handleImageClick}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Camera size={16} />
                      Change Photo
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                      <User size={16} />
                      My Profile
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">

        {/* ── HOME TAB ─────────────────────────────────────────── */}
        {activeTab === 'home' && (
          <div className="space-y-6">

            {/* Greeting */}
            <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-800">
                    Good {getTimeOfDay()}, {staffProfile?.full_name?.split(' ')[0] || 'Teacher'} 👩‍🏫
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* In-hero notifications button */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 rounded-2xl bg-white/50 hover:bg-white/80 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <Bell className="w-6 h-6 text-gray-600 group-hover:text-primary-blue transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-pink text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse-glow shadow-lg shadow-accent-pink/50">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Class Card */}
            {classesData.length > 0 && (
              <div className="glass-card rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-slide-up"
                   style={{ animationDelay: '100ms' }}>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary-blue" />
                    <h3 className="font-bold text-gray-800">Today's Class</h3>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{classesData[0].name}</h4>
                      <p className="text-sm text-gray-600">
                        {classesData[0].children.length} children enrolled
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-blue/20 to-primary-coral/20 flex items-center justify-center">
                      <Baby className="w-7 h-7 text-primary-blue" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Attendance Marked</span>
                      <span className="font-semibold text-gray-800">
                        {getAttendanceStats(classesData[0].children, classesData[0].id).marked} / {classesData[0].children.length}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-green to-accent-green/70 rounded-full transition-all duration-500"
                        style={{
                          width: `${classesData[0].children.length > 0
                            ? (getAttendanceStats(classesData[0].children, classesData[0].id).marked / classesData[0].children.length) * 100
                            : 0}%`
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs pt-1">
                      <span className="flex items-center gap-1 text-accent-green">
                        <CheckCircle className="w-3 h-3" />
                        {getAttendanceStats(classesData[0].children, classesData[0].id).present} present
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <X className="w-3 h-3" />
                        {getAttendanceStats(classesData[0].children, classesData[0].id).absent} absent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={() => {
                      setSelectedClass(classesData[0])
                      setShowAttendance(true)
                    }}
                    className="w-full py-3 bg-gradient-to-r from-primary-blue to-primary-blue/90 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-blue/30 transition-all flex items-center justify-center gap-2 animate-pulse-glow"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark Attendance
                  </button>
                </div>
              </div>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <button
                onClick={() => {
                  if (classesData.length > 0) {
                    setSelectedClass(classesData[0])
                    setShowAttendance(true)
                  } else {
                    setNotificationList(prev => [{
                      id: Date.now(),
                      title: 'No Classes',
                      message: 'No classes assigned to you yet.',
                      type: 'warning',
                      date: new Date().toISOString(),
                      read: false,
                      dismissed: false
                    }, ...prev])
                  }
                }}
                className="glass-card p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-accent-green to-emerald-400 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Mark Attendance</h4>
                <p className="text-xs text-gray-500 mt-1">Take attendance</p>
              </button>

              <button
                onClick={() => setShowPhotoUpload(true)}
                className="glass-card p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-primary-blue to-blue-400 flex items-center justify-center shadow-lg">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Upload Photos</h4>
                <p className="text-xs text-gray-500 mt-1">Add to diary</p>
              </button>

              <button
                onClick={() => setShowDiaryModal(true)}
                className="glass-card p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-accent-purple to-violet-400 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Add Diary Entry</h4>
                <p className="text-xs text-gray-500 mt-1">Record activity</p>
              </button>

              <button
                onClick={() => setShowMessageModal(true)}
                className="glass-card p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-primary-coral to-orange-400 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Message Parent</h4>
                <p className="text-xs text-gray-500 mt-1">Send message</p>
              </button>
            </div>

            {/* FAB Menu */}
            <FABMenu
              onMarkAttendance={() => {
                if (classesData.length > 0) {
                  setShowAttendance(true)
                } else {
                  setNotificationList(prev => [{
                    id: Date.now(),
                    title: 'No Classes',
                    message: 'No classes assigned to you yet.',
                    type: 'warning',
                    date: new Date().toISOString(),
                    read: false,
                    dismissed: false
                  }, ...prev])
                }
              }}
              onUploadPhoto={() => setShowPhotoUpload(true)}
              onAddDiary={() => setShowDiaryModal(true)}
              onMessageParent={() => setShowMessageModal(true)}
            />

            {/* Today Summary Card */}
            <div className="glass-card rounded-2xl shadow-lg p-5 animate-slide-up"
                 style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary-blue" />
                <h3 className="font-bold text-gray-800">Today Summary</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-accent-green/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-accent-green" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {classesData.reduce((acc, cls) => acc + getAttendanceStats(cls.children, cls.id).present, 0)}
                  </p>
                  <p className="text-xs text-gray-600">Present</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {classesData.reduce((acc, cls) => acc + getAttendanceStats(cls.children, cls.id).absent, 0)}
                  </p>
                  <p className="text-xs text-gray-600">Absent</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{uploadedPhotos.length}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>Overall Completion</span>
                  <span className="font-medium">
                    {(() => {
                      const total = classesData.reduce((acc, cls) => acc + cls.children.length, 0)
                      const present = classesData.reduce((acc, cls) => acc + getAttendanceStats(cls.children, cls.id).present, 0)
                      return total > 0 ? Math.round((present / total) * 100) : 0
                    })()}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-green to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${(() => {
                        const total = classesData.reduce((acc, cls) => acc + cls.children.length, 0)
                        const present = classesData.reduce((acc, cls) => acc + getAttendanceStats(cls.children, cls.id).present, 0)
                        return total > 0 ? (present / total) * 100 : 0
                      })()}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Class Assignment Notice */}
            {(() => {
              const hasRealAssignments = children.some(child => child.class_id)
              if (classes.length === 0) {
                return (
                  <div className="glass-card p-4 rounded-2xl border-l-4 border-blue-400 bg-blue-50/50 animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-800 text-sm">No Classes Assigned</h3>
                        <p className="text-blue-700 text-xs mt-1">
                          You haven't been assigned to any classes yet. Contact an administrator.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              }
              if (!hasRealAssignments && children.length > 0) {
                return (
                  <div className="glass-card p-4 rounded-2xl border-l-4 border-amber-400 bg-amber-50/50 animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-800 text-sm">Demo Class Assignments</h3>
                        <p className="text-amber-700 text-xs mt-1">
                          Children are distributed evenly for demonstration. Real assignments can be set by admins.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })()}

          </div>
        )}
        {/* ── END HOME TAB ──────────────────────────────────────── */}

        {/* ── CLASSES TAB ───────────────────────────────────────── */}
        {activeTab === 'classes' && (
          <ClassManagement />
        )}

        {/* ── MESSAGES TAB ──────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-1">Messages</h2>
              <p className="text-gray-600">Communicate with parents and staff</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowMessageModal(true)}
                className="w-full glass-card p-4 rounded-2xl text-left hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Send New Message</h3>
                    <p className="text-sm text-gray-600">Send a message to a parent</p>
                  </div>
                </div>
              </button>

              <div className="glass-card p-4 rounded-2xl">
                <h3 className="font-semibold text-gray-800 mb-3">Recent Messages</h3>
                {(() => {
                  const sentMessages = JSON.parse(localStorage.getItem('childtrack_messages') || '[]')
                    .filter(msg => msg.senderId === staffProfile?.id)
                    .slice(0, 5)

                  if (sentMessages.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No recent messages</p>
                        <p className="text-xs mt-1">Messages you send will appear here</p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-3">
                      {sentMessages.map((message) => (
                        <div key={message.id} className="p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-4 h-4 text-pink-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm text-gray-800">To: {message.recipientName}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ───────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-1">My Profile</h2>
              <p className="text-gray-600">Manage your account and settings</p>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-4 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-coral p-[2px]">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center relative overflow-hidden">
                        {staffProfile?.avatar_url ? (
                          <img src={staffProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-lg text-gray-600 uppercase tracking-wide">
                            {staffProfile?.full_name ?
                              staffProfile.full_name.split(' ').map(n => n[0]).join('') : 'ST'}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleImageClick}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-green rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{staffProfile?.full_name || 'Staff Member'}</h3>
                    <p className="text-sm text-gray-600">{staffProfile?.email || ''}</p>
                    <p className="text-xs text-primary-blue font-medium">{staffProfile?.role || 'Staff'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Classes Assigned</span>
                    <span className="text-sm font-medium text-gray-800">{classes.length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Students Under Care</span>
                    <span className="text-sm font-medium text-gray-800">{children.length}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Account Created</span>
                    <span className="text-sm font-medium text-gray-800">
                      {staffProfile?.created_at ? new Date(staffProfile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl">
                <h3 className="font-semibold text-gray-800 mb-3">Settings</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Notifications</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Account Settings</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full glass-card p-4 rounded-2xl text-left hover:bg-red-50 transition-colors border border-red-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-red-600">Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowPhotoUpload(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-primary-blue to-primary-coral rounded-full shadow-2xl hover:shadow-primary-blue/50 transition-all flex items-center justify-center group z-40"
      >
        <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-glass border-t border-gray-200/50 px-4 py-2 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? 'bg-primary-blue/10 text-primary-blue' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary-blue' : 'text-gray-600'} />
                <span className={`text-xs ${isActive ? 'text-primary-blue font-medium' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── MODALS ────────────────────────────────────────────────── */}

      {/* Attendance Modal */}
      {showAttendanceModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAttendanceModal(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
                    <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-6 h-6 object-cover rounded-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-800">Take Attendance</h2>
                    <p className="text-sm text-gray-600">{selectedClass.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowAttendanceModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {selectedClass.children.map((child) => {
                  const currentStatus = getTodayAttendance(selectedClass.id, child.id)
                  return (
                    <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center text-lg">
                          {child.photo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">{child.name}</h3>
                          <p className="text-xs text-gray-500">{child.age} years old</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => markAttendance(selectedClass.id, child.id, 'present')}
                          className={`p-2 rounded-xl transition-all ${
                            currentStatus === 'present'
                              ? 'bg-accent-green text-white shadow-lg'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-accent-green/10 hover:border-accent-green'
                          }`}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => markAttendance(selectedClass.id, child.id, 'absent')}
                          className={`p-2 rounded-xl transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300'
                          }`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {(() => {
                    const stats = getAttendanceStats(selectedClass.children, selectedClass.id)
                    return `${stats.marked}/${stats.total} marked`
                  })()}
                </div>
                <button onClick={() => setShowAttendanceModal(false)} className="px-4 py-2 bg-primary-blue text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPhotoUpload(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-800">Upload Photos</h2>
                    <p className="text-sm text-gray-600">Share today's activities</p>
                  </div>
                </div>
                <button onClick={() => setShowPhotoUpload(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <button
                  onClick={handlePhotoUpload}
                  disabled={uploading}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors group disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3" />
                      <p className="text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <p className="text-gray-600 group-hover:text-blue-600 font-medium">Tap to select photos</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    </>
                  )}
                </button>

                {uploadedPhotos.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 text-sm">Recent Uploads</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedPhotos.slice(-6).map((photo) => (
                        <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotoFileChange} className="hidden" />
          </div>
        </div>
      )}

      {/* Diary Modal */}
      {showDiaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDiaryModal(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-800">Daily Diary</h2>
                    <p className="text-sm text-gray-600">Record today's activities</p>
                  </div>
                </div>
                <button onClick={() => setShowDiaryModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <textarea
                value={diaryEntry}
                onChange={(e) => setDiaryEntry(e.target.value)}
                placeholder="Write about today's activities, children's progress, special moments..."
                className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowDiaryModal(false)} className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveDiary}
                disabled={!diaryEntry.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-800">Send Message</h2>
                    <p className="text-sm text-gray-600">Communicate with parents</p>
                  </div>
                </div>
                <button onClick={() => setShowMessageModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[50vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Parent</label>
                  <select
                    value={selectedParent?.id || ''}
                    onChange={(e) => {
                      const parent = children.find(child => child.profiles?.id === e.target.value)?.profiles
                      setSelectedParent(parent)
                    }}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  >
                    <option value="">Choose a parent...</option>
                    {Array.from(new Set(children.map(child => child.profiles).filter(Boolean)))
                      .map(parent => (
                        <option key={parent.id} value={parent.id}>{parent.full_name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message to the parent..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowMessageModal(false)} className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || !selectedParent}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-800">Today's Schedule</h2>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {classesData.map((classData) => (
                  <div key={classData.id} className="glass-card p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{classData.name}</h3>
                      <span className="text-sm text-gray-500">{classData.time}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Children:</span>
                        <span className="font-medium">{classData.children.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Present Today:</span>
                        <span className="font-medium text-green-600">
                          {getAttendanceStats(classData.children, classData.id).present}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {classesData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No classes scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Screen */}
      {showAttendance && (
        <Attendance onClose={() => setShowAttendance(false)} />
      )}
    </div>
  )
}

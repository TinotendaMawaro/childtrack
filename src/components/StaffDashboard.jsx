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

  // Initialize notifications from announcements
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

  // Update notifications when announcements change
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

  // Close all modals when switching tabs
  useEffect(() => {
    // No action needed, just ensuring modals are controlled
    // This effect runs when activeTab changes
  }, [activeTab])

  // Close all modals and screens when switching tabs to prevent stuck overlays
  useEffect(() => {
    setShowAttendanceModal(false)
    setShowPhotoUpload(false)
    setShowDiaryModal(false)
    setShowMessageModal(false)
    setShowScheduleModal(false)
    setShowAttendance(false)
  }, [activeTab])

  // Close modals on Escape key
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

  // Close all modals and screens on unmount (cleanup)
  useEffect(() => {
    return () => {
      setShowAttendanceModal(false)
      setShowPhotoUpload(false)
      setShowDiaryModal(false)
      setShowMessageModal(false)
      setShowScheduleModal(false)
      setShowAttendance(false)
    }
  }, [])

  // Close dropdowns when clicking outside
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

  // Notification functions
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

  // Get active notifications (not dismissed)
  const activeNotifications = notificationList.filter(notif => !notif.dismissed)
  const unreadCount = activeNotifications.filter(notif => !notif.read).length

  // Transform classes data for attendance tracking
  const classesData = classes.map((cls, index) => {
    let classChildren = children.filter(child => child.class_id === cls.id)

    // Fallback: If no children are assigned to this specific class
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
        status: 'pending'
      }))
    }
  })

  const stats = [
    { label: 'Today Attendance', value: `${classesData.reduce((acc, cls) => acc + getAttendanceStats(cls.children, cls.id).present, 0)}/${classesData.reduce((acc, cls) => acc + cls.children.length, 0)}`, icon: CheckCircle, color: 'green' },
    { label: 'My Classes', value: classesData.length.toString(), icon: GraduationCap, color: 'blue' },
    { label: 'Children Assigned', value: classesData.reduce((acc, cls) => acc + cls.children.length, 0).toString(), icon: Baby, color: 'purple' }
  ]

  // Handle profile picture upload
  const handleImageClick = (e) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate image
    if (!file.type.startsWith('image/')) {
      // Show error in UI instead of alert
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

    if (file.size > 5 * 1024 * 1024) { // 5MB
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
      // Show success notification
      setNotificationList(prev => [{
        id: Date.now(),
        title: 'Profile Updated',
        message: 'Your profile picture has been updated successfully',
        type: 'info',
        date: new Date().toISOString(),
        read: false,
        dismissed: false
      }, ...prev])
      // Reset input
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

  // Photo upload handlers
  const handlePhotoUpload = () => {
    photoInputRef.current?.click()
  }

  const handlePhotoFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // In a real app, these would be uploaded to cloud storage
    // For demo, we'll just show them as uploaded
    const newPhotos = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      date: new Date().toISOString(),
      classId: selectedClass?.id || classesData[0]?.id
    }))

    setUploadedPhotos(prev => [...prev, ...newPhotos])

    // Save to localStorage
    const existingPhotos = JSON.parse(localStorage.getItem('childtrack_photos') || '[]')
    const updatedPhotos = [...newPhotos, ...existingPhotos]
    localStorage.setItem('childtrack_photos', JSON.stringify(updatedPhotos))

    setShowPhotoUpload(false)

    // Reset input
    e.target.value = ''

    // Show success notification
    setNotificationList(prev => [{
      id: Date.now(),
      title: 'Photos Uploaded',
      message: `Successfully uploaded ${validFiles.length} photo${validFiles.length > 1 ? 's' : ''}`,
      type: 'info',
      date: new Date().toISOString(),
      read: false,
      dismissed: false
    }, ...prev])
  }

  // Diary handlers
  const handleSaveDiary = () => {
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

    const diaryData = {
      id: Date.now(),
      content: diaryEntry,
      date: new Date().toISOString(),
      staffId: staffProfile?.id,
      classId: selectedClass?.id || classesData[0]?.id,
      className: selectedClass?.name || classesData[0]?.name || 'General'
    }

    // Save to localStorage
    const existingDiaries = JSON.parse(localStorage.getItem('childtrack_diaries') || '[]')
    const updatedDiaries = [diaryData, ...existingDiaries]
    localStorage.setItem('childtrack_diaries', JSON.stringify(updatedDiaries))

    setNotificationList(prev => [{
      id: Date.now(),
      title: 'Diary Saved',
      message: 'Your diary entry has been saved successfully',
      type: 'info',
      date: new Date().toISOString(),
      read: false,
      dismissed: false
    }, ...prev])

    setDiaryEntry('')
    setShowDiaryModal(false)
  }

  // Message handlers
  const handleSendMessage = () => {
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

    const messageData = {
      id: Date.now(),
      content: messageText,
      recipientId: selectedParent.id,
      recipientName: selectedParent.full_name,
      senderId: staffProfile?.id,
      senderName: staffProfile?.full_name || 'Staff',
      date: new Date().toISOString(),
      type: 'staff_to_parent',
      read: false
    }

    // Save to localStorage
    const existingMessages = JSON.parse(localStorage.getItem('childtrack_messages') || '[]')
    const updatedMessages = [messageData, ...existingMessages]
    localStorage.setItem('childtrack_messages', JSON.stringify(updatedMessages))

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

  // Schedule handler
  const handleViewSchedule = () => {
    setShowScheduleModal(true)
  }

  // Main cards data with full functionality
  const mainCards = [
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: `${classesData.length} class${classesData.length > 1 ? 'es' : ''} • ${classesData.reduce((acc, cls) => acc + cls.children.length, 0)} children`,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      action: () => {
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
      }
    },
    {
      id: 'photos',
      title: 'Upload Daily Photos',
      description: (() => {
        const today = new Date().toISOString().split('T')[0]
        const allPhotos = JSON.parse(localStorage.getItem('childtrack_photos') || '[]')
        const todayPhotos = allPhotos.filter(photo => photo.date.startsWith(today)).length
        return `${todayPhotos} photo${todayPhotos > 1 ? 's' : ''} uploaded today`
      })(),
      icon: Camera,
      color: 'from-blue-400 to-blue-500',
      action: () => setShowPhotoUpload(true)
    },
    {
      id: 'diary',
      title: 'Update Diary',
      description: (() => {
        const today = new Date().toISOString().split('T')[0]
        const allDiaries = JSON.parse(localStorage.getItem('childtrack_diaries') || '[]')
        const todayDiaries = allDiaries.filter(diary => diary.date.startsWith(today)).length
        return todayDiaries > 0 ? `${todayDiaries} entr${todayDiaries > 1 ? 'ies' : 'y'} today` : 'Record daily activities and notes'
      })(),
      icon: BookOpen,
      color: 'from-purple-400 to-purple-500',
      action: () => setShowDiaryModal(true)
    },
    {
      id: 'messages',
      title: 'Send Message to Parent',
      description: `${children.length} parent${children.length > 1 ? 's' : ''} available`,
      icon: MessageSquare,
      color: 'from-pink-400 to-pink-500',
      action: () => setShowMessageModal(true)
    },
    {
      id: 'schedule',
      title: 'Today\'s Schedule',
      description: `${classesData.length} class${classesData.length > 1 ? 'es' : ''} scheduled`,
      icon: Calendar,
      color: 'from-orange-400 to-orange-500',
      action: () => handleViewSchedule()
    }
  ]

  // Bottom navigation items
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
          {/* Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
            <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-xl" />
          </div>

          {/* Title */}
          <h1 className="text-base sm:text-lg font-heading font-bold text-gray-800">ChildTrack</h1>

          {/* Right side - Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-pink text-white text-xs rounded-full flex items-center justify-center font-medium">
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

              {/* Profile Menu */}
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

              {/* Hidden file input */}
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
        {/* Render different content based on active tab */}
        {activeTab === 'home' && (
          <>
            {/* Greeting */}
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-1">
                Good morning, {staffProfile?.full_name?.split(' ')[0] || 'Staff'}! 🌅
              </h2>
              <p className="text-gray-600">Here's what's happening today</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="glass-card p-3 sm:p-4 text-center rounded-2xl">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-500 flex items-center justify-center`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-gray-800 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-600 leading-tight">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              {mainCards.map((card) => {
                const Icon = card.icon
                return (
                  <button
                    key={card.id}
                    onClick={card.action}
                    className="glass-card p-4 sm:p-5 rounded-2xl text-left hover:shadow-xl transition-all group"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">{card.title}</h3>
                    <p className="text-xs text-gray-600 leading-tight">{card.description}</p>
                  </button>
                )
              })}
            </div>

            {/* Quick Actions Bar */}
            <div className="glass-card p-4 rounded-2xl mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Actions</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => {
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
                  className="flex flex-col items-center gap-2 p-3 bg-primary-blue/10 rounded-xl hover:bg-primary-blue/20 transition-colors flex-shrink-0"
                >
                  <CheckCircle className="w-6 h-6 text-primary-blue" />
                  <span className="text-xs text-gray-700">Attendance</span>
                </button>
                <button
                  onClick={() => setShowPhotoUpload(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-colors flex-shrink-0"
                >
                  <Camera className="w-6 h-6 text-blue-500" />
                  <span className="text-xs text-gray-700">Photos</span>
                </button>
                <button
                  onClick={() => setShowDiaryModal(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-purple-500/10 rounded-xl hover:bg-purple-500/20 transition-colors flex-shrink-0"
                >
                  <BookOpen className="w-6 h-6 text-purple-500" />
                  <span className="text-xs text-gray-700">Diary</span>
                </button>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-pink-500/10 rounded-xl hover:bg-pink-500/20 transition-colors flex-shrink-0"
                >
                  <MessageSquare className="w-6 h-6 text-pink-500" />
                  <span className="text-xs text-gray-700">Messages</span>
                </button>
              </div>
            </div>

            {/* Class Assignment Notice */}
            {(() => {
              const hasRealAssignments = children.some(child => child.class_id)
              const totalAssigned = classesData.reduce((acc, cls) => acc + cls.children.length, 0)

              if (classes.length === 0) {
                return (
                  <div className="glass-card p-4 rounded-2xl border-l-4 border-blue-400 bg-blue-50/50">
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
                  <div className="glass-card p-4 rounded-2xl border-l-4 border-amber-400 bg-amber-50/50">
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
          </>
        )}

        {activeTab === 'classes' && (
          <>
            {/* Classes Tab */}
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-1">
                My Classes
              </h2>
              <p className="text-gray-600">Manage your assigned classes and students</p>
            </div>

            {classesData.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Classes Assigned</h3>
                <p className="text-gray-500">You haven't been assigned to any classes yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {classesData.map((classData) => (
                  <div key={classData.id} className="glass-card p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{classData.name}</h3>
                      <span className="text-sm text-gray-500">{classData.time}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary-blue">{classData.children.length}</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-accent-green">
                          {getAttendanceStats(classData.children, classData.id).present}
                        </p>
                        <p className="text-xs text-gray-600">Present Today</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedClass(classData)
                          setShowAttendance(true)
                        }}
                        className="flex-1 py-2 px-3 bg-primary-blue/10 text-primary-blue rounded-lg text-sm font-medium hover:bg-primary-blue/20 transition-colors"
                      >
                        Take Attendance
                      </button>
                      <button
                        onClick={() => setSelectedClass(classData)}
                        className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'messages' && (
          <>
            {/* Messages Tab */}
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-1">
                Messages
              </h2>
              <p className="text-gray-600">Communicate with parents and staff</p>
            </div>

            <div className="space-y-4">
              {/* Quick Send Button */}
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

              {/* Recent Messages */}
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
          </>
        )}

        {activeTab === 'profile' && (
          <>
            {/* Profile Tab */}
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-1">
                My Profile
              </h2>
              <p className="text-gray-600">Manage your account and settings</p>
            </div>

            <div className="space-y-4">
              {/* Profile Info */}
              <div className="glass-card p-4 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-coral p-[2px]">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center relative overflow-hidden">
                        {staffProfile?.avatar_url ? (
                          <img
                            src={staffProfile.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-lg text-gray-600 uppercase tracking-wide">
                            {staffProfile?.full_name ?
                              staffProfile.full_name.split(' ').map(n => n[0]).join('') :
                              'ST'
                            }
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

              {/* Settings */}
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

              {/* Logout */}
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
          </>
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
                  isActive
                    ? 'bg-primary-blue/10 text-primary-blue'
                    : 'text-gray-600 hover:bg-gray-100'
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

      {/* Attendance Modal */}
      {showAttendanceModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => {
          // Close modal when clicking outside (on backdrop)
          setShowAttendanceModal(false)
        }}>
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
                    <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-6 h-6 object-cover rounded-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-800">
                      Take Attendance
                    </h2>
                    <p className="text-sm text-gray-600">{selectedClass.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
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
                          title="Present"
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
                          title="Absent"
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
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 bg-primary-blue text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
                >
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
                    <h2 className="text-lg font-heading font-bold text-gray-800">
                      Upload Photos
                    </h2>
                    <p className="text-sm text-gray-600">Share today's activities</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <button
                  onClick={handlePhotoUpload}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                >
                  <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="text-gray-600 group-hover:text-blue-600 font-medium">Tap to select photos</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                </button>

                {(() => {
                  const allPhotos = JSON.parse(localStorage.getItem('childtrack_photos') || '[]')
                  const recentPhotos = allPhotos.slice(0, 6)

                  return recentPhotos.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800 text-sm">Recent Uploads</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {recentPhotos.map((photo) => (
                          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoFileChange}
              className="hidden"
            />
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
                    <h2 className="text-lg font-heading font-bold text-gray-800">
                      Daily Diary
                    </h2>
                    <p className="text-sm text-gray-600">Record today's activities</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDiaryModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
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
              <button
                onClick={() => setShowDiaryModal(false)}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
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
                    <h2 className="text-lg font-heading font-bold text-gray-800">
                      Send Message
                    </h2>
                    <p className="text-sm text-gray-600">Communicate with parents</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
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
                      const parent = children.find(child =>
                        child.profiles?.id === e.target.value
                      )?.profiles
                      setSelectedParent(parent)
                    }}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  >
                    <option value="">Choose a parent...</option>
                    {Array.from(new Set(children.map(child => child.profiles).filter(Boolean)))
                      .map(parent => (
                        <option key={parent.id} value={parent.id}>
                          {parent.full_name}
                        </option>
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
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
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
                    <h2 className="text-lg font-heading font-bold text-gray-800">
                      Today's Schedule
                    </h2>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {classesData.map((classData, index) => (
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
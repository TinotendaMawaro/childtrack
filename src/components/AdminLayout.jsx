// Fixed AdminLayout with proper imports - replace the current AdminLayout.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import Dashboard from './Dashboard'
import StaffManagement from './StaffManagement'
import ClassesManagement from './ClassesManagement'
import FinanceManagement from './FinanceManagement'
import Recruitment from './Recruitment'
import ChildrenManagement from './ChildrenManagement'
import ChildStatusManager from './ChildStatusManager'
import StatusAuditTrail from './StatusAuditTrail'
import SettingsPage from './Settings'
import ProfilePage from './ProfilePage'
import TransportManagement from './TransportManagement'

// Placeholder Recruitment Screen
function RecruitmentScreen() {
  return (
    <div className="glass-card rounded-3xl p-12 text-center">
      <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">Recruitment</h3>
      <p className="text-gray-600">Recruitment functionality coming soon...</p>
    </div>
  )
}
import {
  LayoutDashboard,
  Baby,
  Users,
  GraduationCap,
  DollarSign,
  Bus,
  UserPlus,
  Settings,
  User,
  Shield,
  FileText,
  Search,
  Bell,
  ChevronDown,
  Menu,
  TrendingUp,
  LogOut,
  X,
  UserCheck,
  History
} from 'lucide-react'

// Page titles and descriptions
export const pageTitles = {
  dashboard: '',
  'student-children': 'Children',
  'student-status-manager': 'Status Manager',
  staff: 'Staff',
  classes: 'Classes',
  finance: 'Finance',
  transport: 'Transport',
  recruitment: 'Recruitment',
  settings: 'Settings',
  profile: 'Profile',
}

export const pageDescriptions = {
  dashboard: "",
  'student-children': 'Manage children profiles and information',
  'student-status-manager': 'Manage student status and enrollment',

  staff: 'View and manage staff members',
  classes: 'Manage class schedules and groups',
  finance: 'Track payments and finances',
  transport: 'Monitor transport routes and drivers',
  recruitment: 'Review job applications and manage hiring pipeline',
  settings: 'Configure school profile, calendar, roles, notifications, and view logs',
  profile: 'Update your personal information',
}

// Animated Counter
function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime
    let animationFrame
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])
  
  return <span>{count}</span>
}

// Sidebar Component
export function AdminSidebar({ activeItem, setActiveItem, isOpen, setIsOpen }) {
  const [expandedItems, setExpandedItems] = useState(() => {
    const expanded = new Set()
    const menuItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'student', icon: UserCheck, label: 'Student', subItems: [
        { id: 'student-children', icon: Baby, label: 'Children' },
        { id: 'student-status-manager', icon: Shield, label: 'Status Manager' }
      ] },
      { id: 'staff', icon: Users, label: 'Staff' },
      { id: 'classes', icon: GraduationCap, label: 'Classes' },
      { id: 'finance', icon: DollarSign, label: 'Finance' },
      { id: 'transport', icon: Bus, label: 'Transport' },
      { id: 'recruitment', icon: UserPlus, label: 'Recruitment' },
      { id: 'settings', icon: Settings, label: 'Settings' },
      { id: 'profile', icon: User, label: 'Profile' },
    ]
    menuItems.forEach(item => {
      if (item.subItems && activeItem.startsWith(item.id + '-')) {
        expanded.add(item.id)
      }
    })
    expanded.add('student') // Expand student by default
    return expanded
  })

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'student', icon: UserCheck, label: 'Student', subItems: [
      { id: 'student-children', icon: Baby, label: 'Children' },
      { id: 'student-status-manager', icon: Shield, label: 'Status Manager' }
    ] },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'classes', icon: GraduationCap, label: 'Classes' },
    { id: 'finance', icon: DollarSign, label: 'Finance' },
    { id: 'transport', icon: Bus, label: 'Transport' },
    { id: 'recruitment', icon: UserPlus, label: 'Recruitment' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'profile', icon: User, label: 'Profile' },
  ]

  const handleItemClick = (item) => {
    if (item.subItems) {
      setExpandedItems(prev => {
        const next = new Set(prev)
        if (next.has(item.id)) {
          next.delete(item.id)
        } else {
          next.add(item.id)
        }
        return next
      })
      // Removed auto-select: do not change activeItem when expanding/collapsing
    } else {
      setActiveItem(item.id)
    }
  }

  return (
    <div className="fixed top-0 left-0 h-full w-[260px] z-50">
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`
        h-full glass-card border-r-0 rounded-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="h-20 flex items-center px-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl btn-gradient flex items-center justify-center shadow-lg">
              <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-gray-800">ChildTrack</h1>
              <p className="text-[11px] text-gray-500">track manage protect</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.subItems ? activeItem.startsWith(item.id + '-') : activeItem === item.id
            const isExpanded = expandedItems.has(item.id)
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-primary-blue to-primary-coral text-white shadow-lg glow-mint transform scale-[1.02]'
                      : 'text-gray-600 hover:bg-gray-50 hover:scale-[1.01] glow-mint'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.subItems && <ChevronDown size={16} className={`ml-auto transition-transform duration-200 ease-out ${isExpanded ? 'rotate-180' : ''}`} />}
                </button>
                {item.subItems && (
                  <div className={`overflow-hidden transition-all duration-200 ease-out ${isExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon
                      const isSubActive = activeItem === sub.id
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveItem(sub.id)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2 ml-6 rounded-xl transition-all duration-200
                            ${isSubActive
                              ? 'bg-gradient-to-r from-primary-blue to-primary-coral text-white shadow-lg glow-mint transform scale-[1.02]'
                              : 'text-gray-600 hover:bg-gray-50 hover:scale-[1.01] glow-mint'
                            }
                          `}
                        >
                          <SubIcon size={18} />
                          <span className="font-medium">{sub.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="glass-card p-4 rounded-xl">
            <p className="text-xs text-gray-500 mb-3">Need help?</p>
            <button className="w-full py-2 px-4 bg-gradient-to-r from-primary-blue to-primary-coral text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main AdminLayout Component
export default function AdminLayout() {
   // Load activeItem from localStorage on initial load
   const [activeItem, setActiveItem] = useState(() => {
     const saved = localStorage.getItem('adminActiveTab')
     return saved || 'dashboard'
   })
   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
   const [searchQuery, setSearchQuery] = useState('')
   const { signOut, profile, uploadProfilePic, session } = useAuth()

   const [showDropdown, setShowDropdown] = useState(false)
   const [uploading, setUploading] = useState(false)
   const [fileInputRef, setFileInputRef] = useState(null)

   // Notifications state
   const [showNotifications, setShowNotifications] = useState(false)
   const [notifications, setNotifications] = useState([])
   const [unreadCount, setUnreadCount] = useState(0)

   // Fetch notifications when dropdown opens
   useEffect(() => {
     if (showNotifications && session?.user?.id) {
       fetchNotifications()
     }
   }, [showNotifications, session])

   const fetchNotifications = async () => {
     const { data } = await supabase
       .from('notifications')
       .select('*')
       .eq('recipient_id', session.user.id)
       .order('created_at', { ascending: false })
       .limit(10)

     if (data) {
       setNotifications(data)
       setUnreadCount(data.filter(n => !n.is_read).length)
     }
   }

   const markAsRead = async (notifId) => {
     await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', notifId)
     setNotifications(prev => prev.map(n => n.id === notifId ? {...n, is_read: true} : n))
     setUnreadCount(prev => Math.max(0, prev - 1))
   }

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeItem)
  }, [activeItem])
  
  const handleLogout = async () => {
    await signOut()
  }

  const handleImageClick = (e) => {
    e.stopPropagation()
    fileInputRef?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !session) return
    
    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Image size must be less than 5MB')
      return
    }
    
    setUploading(true)
    try {
      await uploadProfilePic(file)
      // Reset input
      e.target.value = ''
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />
      case 'student-children':
        return <ChildrenManagement />
      case 'student-status-manager':
        return <ChildStatusManager />
      case 'staff':
        return <StaffManagement />
      case 'classes':
        return <ClassesManagement />
      case 'finance':
        return <FinanceManagement />
      case 'transport':
        return <TransportManagement />
      case 'recruitment':
        return <RecruitmentScreen />
      case 'settings':
        return <SettingsPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <Dashboard />
    }
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70">
      <AdminSidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="lg:ml-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-40 h-20 glass-card border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-80 rounded-xl bg-gray-50 border-0 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell size={22} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-primary-coral text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-gray-800">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50/80 cursor-pointer transition-colors ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                              <Bell size={16} className="text-primary-blue" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 line-clamp-2">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                            {!notif.is_read && (
                              <div className="w-2 h-2 rounded-full bg-primary-blue mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div 
              className="flex items-center gap-3 pl-4 pr-2 py-1 border-l border-gray-200 cursor-pointer hover:bg-gray-100/50 rounded-xl transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setShowDropdown(prev => !prev)
                setShowNotifications(false)
              }}
            >
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-800">{profile?.full_name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{profile?.role || 'Administrator'}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 ml-1 hidden sm:block self-center" />
              <div className="flex items-center gap-2 pl-4 relative">
                <div 
                  className="relative group cursor-pointer p-1 rounded-2xl bg-gradient-to-br from-primary-blue to-primary-coral hover:shadow-lg transition-all"
                  onClick={handleImageClick}
                >

                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={profile?.avatar_url || '/assets/images/default-avatar.png'} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                    {!profile?.avatar_url && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="font-bold text-xl text-gray-600 uppercase tracking-wide">
                          {profile?.full_name ? 
                            profile.full_name.split(' ').map(n => n[0]).join('') : 
                            'AD'
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {uploading && (
                    <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-accent-green rounded-full border-3 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <input
                  ref={setFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button className="p-2 hover:bg-red-100 rounded-xl transition-colors" onClick={handleLogout}>
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl shadow-xl z-50 animate-fade-in">
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors flex items-center gap-3">
                        <User size={18} /> My Profile
                      </button>
                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                        <Settings size={18} /> Settings
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 rounded-b-lg">
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Title */}
        <div className="p-6 pb-0">
          <h2 className="font-heading font-bold text-2xl text-gray-800">
            {pageTitles[activeItem]}
          </h2>
          <p className="text-gray-500 mt-1">
            {pageDescriptions[activeItem]}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}


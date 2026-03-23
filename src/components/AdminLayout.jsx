// Fixed AdminLayout with proper imports - replace the current AdminLayout.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Dashboard from './Dashboard'
import StaffManagement from './StaffManagement'
import ClassesManagement from './ClassesManagement'
import FinanceManagement from './FinanceManagement'
import Recruitment from './Recruitment'
import SettingsPage from './Settings'
import ProfilePage from './ProfilePage'
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
  Search,
  Bell,
  ChevronDown,
  Menu,
  TrendingUp,
  LogOut
} from 'lucide-react'

// Page titles and descriptions
export const pageTitles = {
  dashboard: '',
  children: 'Children',
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
  children: 'Manage children profiles and information',
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
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'children', icon: Baby, label: 'Children' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'classes', icon: GraduationCap, label: 'Classes' },
    { id: 'finance', icon: DollarSign, label: 'Finance' },
    { id: 'transport', icon: Bus, label: 'Transport' },
    { id: 'recruitment', icon: UserPlus, label: 'Recruitment' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'profile', icon: User, label: 'Profile' },
  ]

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
              <span className="text-white text-xl">🌈</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-gray-800">My Nursery</h1>
              <p className="text-[11px] text-gray-500">Nursery Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
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
              </button>
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
  const [activeItem, setActiveItem] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { signOut, profile, uploadProfilePic, session } = useAuth()
  
  const [showDropdown, setShowDropdown] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileInputRef, setFileInputRef] = useState(null)
  
  const handleLogout = async () => {
    await signOut()
  }

  const handleImageClick = () => {
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
      case 'children':
        return <div className="glass-card rounded-3xl p-12 text-center">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">Children Management</h3>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      case 'staff':
        return <StaffManagement />
      case 'classes':
        return <ClassesManagement />
      case 'finance':
        return <FinanceManagement />
      case 'transport':
        return <div className="glass-card rounded-3xl p-12 text-center">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">Transport</h3>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      case 'recruitment':
        return <Recruitment />
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
        <header className="h-20 glass-card border-b border-gray-100 flex items-center justify-between px-6">
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
            <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={22} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary-coral rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
<div className="text-right hidden sm:block">
                <p className="font-medium text-gray-800">{profile?.full_name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{profile?.role || 'Administrator'}</p>
              </div>
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


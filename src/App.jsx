import { useState, useEffect } from 'react'
import { 
  LayoutDashboard,
  Baby,
  Users,
  GraduationCap,
  DollarSign,
  Bus,
  UserPlus,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Menu,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  FileText,
  X,
  Phone,
  Mail,
  Heart,
  AlertTriangle,
  Car,
  Navigation,
  Battery,
  Wifi
} from 'lucide-react'

// Import shared dashboard components
import { AnimatedCounter, StatCard } from './components/ui/DashboardComponents'

// Legacy imports moved to dashboard components
// StaffScreen, ClassesScreen, etc. are now handled in AdminDashboard via Sidebar


// Sidebar Component
function Sidebar({ activeItem, setActiveItem, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'children', icon: Baby, label: 'Children' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'classes', icon: GraduationCap, label: 'Classes' },
    { id: 'finance', icon: DollarSign, label: 'Finance' },
    { id: 'transport', icon: Bus, label: 'Transport' },
    { id: 'recruitment', icon: UserPlus, label: 'Recruitment' },
    { id: 'settings', icon: Settings, label: 'Settings' },
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
              <span className="text-white text-xl">🌸</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-gray-800">ChildTrack</h1>
              <p className="text-[11px] text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 ease
                  ${isActive 
                    ? 'btn-gradient text-white shadow-lg glow-active' 
                    : 'text-gray-600 hover:bg-gray-50 hover:shadow-md'
                  }
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// TopBar Component
function TopBar({ setIsOpen, activeItem }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    { id: 1, text: 'New child enrollment request', time: '5 min ago', unread: true, icon: Baby },
    { id: 2, text: 'Payment received - $450', time: '1 hour ago', unread: true, icon: DollarSign },
    { id: 3, text: 'Driver arrived at stop #12', time: '2 hours ago', unread: false, icon: Bus },
    { id: 4, text: 'New job application received', time: '3 hours ago', unread: false, icon: UserPlus },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const pageTitles = {
    dashboard: 'Dashboard',
    children: 'Children',
    staff: 'Staff',
    classes: 'Classes',
    finance: 'Finance',
    transport: 'Transport',
    recruitment: 'Recruitment',
    settings: 'Settings',
  }

  const pageDescriptions = {
    dashboard: "Welcome back! Here's your overview.",
    children: 'Manage children profiles and information',
    staff: 'View and manage staff members',
    classes: 'Manage class schedules and groups',
    finance: 'Track payments and finances',
    transport: 'Monitor transport routes and drivers',
    recruitment: 'Review job applications and manage hiring pipeline',
    settings: 'Configure school profile, calendar, roles, notifications, and view logs',
  }


  return (
    <header className="h-[72px] glass-card border-b border-gray-100 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
        
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-800">{pageTitles[activeItem]}</h2>
          <p className="text-sm text-gray-500">{pageDescriptions[activeItem]}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 w-56 rounded-xl bg-white/50 border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue
                       text-sm transition-all"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfile(false)
            }}
            className="relative p-2.5 rounded-xl hover:bg-white/50 transition-colors"
          >
            <Bell size={22} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-accent-pink text-white text-xs 
                             rounded-full flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-heading font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon
                  return (
                    <div 
                      key={notif.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer
                        ${notif.unread ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-primary-blue" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{notif.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                        {notif.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary-blue" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotifications(false)
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-blue to-primary-coral p-[2px]">
              <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                <span className="text-lg">👩‍💼</span>
              </div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">Admin</p>
              <p className="text-xs text-gray-500">Manager</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
              <div className="p-2">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// StatCard Component - Now imported from ./components/ui/DashboardComponents

// Attendance Bar Chart Component
function AttendanceChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const data = [42, 38, 45, 40, 44, 20]
  const maxValue = Math.max(...data)
  
  return (
    <div className="glass-card rounded-card p-6 animate-slide-up stagger-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg text-gray-800">Attendance This Week</h3>
        <button className="text-sm text-primary-blue font-medium hover:underline">View Report</button>
      </div>
      
      <div className="flex items-end justify-between gap-3 h-48">
        {days.map((day, index) => {
          const height = (data[index] / maxValue) * 100
          const gradients = [
            'from-primary-blue to-blue-300',
            'from-accent-purple to-violet-300',
            'from-primary-coral to-orange-300',
            'from-accent-green to-emerald-300',
            'from-accent-yellow to-amber-300',
            'from-accent-pink to-rose-300',
          ]
          
          return (
            <div key={day} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center justify-end h-36">
                <div 
                  className={`w-full max-w-8 rounded-t-lg bg-gradient-to-t ${gradients[index]} shadow-lg transition-all duration-500 hover:opacity-80 cursor-pointer`}
                  style={{ height: `${height}%` }}
                >
                  <div className="text-center pt-2">
                    <span className="text-xs font-medium text-white">{data[index]}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{day}</span>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-green" />
          <span className="text-sm text-gray-500">Average: 38 children/day</span>
        </div>
        <span className="text-sm font-medium text-primary-blue">+12% vs last week</span>
      </div>
    </div>
  )
}

// Recent Activity Item Component
function ActivityItem({ icon: Icon, title, description, time, color, status }) {
  const colorClasses = {
    blue: 'bg-primary-blue/10 text-primary-blue',
    coral: 'bg-primary-coral/10 text-primary-coral',
    green: 'bg-accent-green/10 text-accent-green',
    purple: 'bg-accent-purple/10 text-accent-purple',
    yellow: 'bg-accent-yellow/10 text-accent-yellow',
    pink: 'bg-accent-pink/10 text-accent-pink',
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 truncate">{description}</p>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'success' ? 'bg-accent-green/10 text-accent-green' :
          status === 'pending' ? 'bg-accent-yellow/10 text-amber-600' :
          'bg-gray-100 text-gray-500'
        }`}>
          {status === 'success' ? 'Done' : status === 'pending' ? 'Pending' : 'Info'}
        </span>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

// Recent Activity Card
function RecentActivityCard() {
  const activities = [
    { icon: Baby, title: 'New enrollment', description: 'Emma Johnson enrolled in Sunbeam class', time: '10 min', color: 'green', status: 'success' },
    { icon: DollarSign, title: 'Payment received', description: 'Monthly fee from Sarah Williams', time: '1 hour', color: 'blue', status: 'success' },
    { icon: UserCheck, title: 'Staff check-in', description: 'Teacher Maria checked in', time: '2 hours', color: 'purple', status: 'success' },
    { icon: Bus, title: 'Route completed', description: 'Bus Route A returned to depot', time: '3 hours', color: 'coral', status: 'success' },
    { icon: FileText, title: 'Report generated', description: 'Weekly attendance report ready', time: '4 hours', color: 'yellow', status: 'pending' },
  ]

  return (
    <div className="glass-card rounded-card p-6 animate-slide-up stagger-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-gray-800">Recent Activity</h3>
        <button className="text-sm text-primary-blue font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-1">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  )
}

// Children mock data removed - using real Supabase data from ChildrenManagement.jsx


// Child Detail Drawer Component
function ChildDrawer({ child, onClose }) {
  if (!child) return null

  const statusColors = {
    present: 'bg-accent-green/10 text-accent-green',
    absent: 'bg-red-100 text-red-600',
    late: 'bg-accent-yellow/10 text-amber-600',
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[420px] glass-card rounded-l-large z-50 overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-white/70 backdrop-blur-glass p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-gray-800">Child Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral p-[3px] mb-4">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-5xl">{child.photo}</span>
              </div>
            </div>
            <h3 className="font-heading font-bold text-2xl text-gray-800">{child.name}</h3>
            <p className="text-gray-500">{child.age} years old • {child.class}</p>
            <span className={`mt-2 text-sm px-4 py-1 rounded-full ${statusColors[child.status]}`}>
              {child.status === 'present' ? '● Present' : child.status === 'absent' ? '○ Absent' : '◐ Late'}
            </span>
          </div>

          {/* Health Info */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={18} className="text-accent-pink" />
              <h4 className="font-heading font-semibold text-gray-800">Health Information</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-medium text-gray-800">{child.health}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-500">Allergies</span>
                <div className="text-right">
                  {child.allergies.length > 0 ? (
                    child.allergies.map((allergy, i) => (
                      <div key={i} className="flex items-center gap-1 text-sm font-medium text-red-500">
                        <AlertTriangle size={12} />
                        {allergy}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-accent-green">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Parent Contacts */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-primary-blue" />
              <h4 className="font-heading font-semibold text-gray-800">Parent Contacts</h4>
            </div>
            <div className="space-y-3">
              {child.parents.map((parent, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{parent.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-primary-blue/10 text-primary-blue rounded-full">{parent.relation}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone size={14} />
                      <span>{parent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={14} />
                      <span>{parent.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Status */}
          <div className="glass-card-inner rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Car size={18} className="text-accent-purple" />
              <h4 className="font-heading font-semibold text-gray-800">Transport Status</h4>
            </div>
            {child.transport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{child.transport.route}</p>
                    <p className="text-xs text-gray-500">{child.transport.stop}</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-accent-green/10 text-accent-green rounded-full">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/50 text-center">
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="font-medium text-gray-800">{child.transport.pickup}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/50 text-center">
                    <p className="text-xs text-gray-500">Dropoff</p>
                    <p className="font-medium text-gray-800">{child.transport.dropoff}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-gray-100 text-center">
                <p className="text-sm text-gray-500">No transport assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Children Management Screen (REMOVED - now src/components/ChildrenManagement.jsx with real data)
// function ChildrenScreen() ... (entire prototype removed)

// Transport Monitoring Screen
function TransportScreen() {
  const [selectedRoute, setSelectedRoute] = useState(null)

  const routes = [
    { id: 'A', name: 'Route A', driver: 'John Smith', status: 'active', kids: 8, eta: '8:45 AM', progress: 75, color: 'blue', stops: ['Oak Street', 'Pine Street', 'Birch Road', 'School'] },
    { id: 'B', name: 'Route B', driver: 'Sarah Davis', status: 'active', kids: 6, eta: '8:30 AM', progress: 60, color: 'purple', stops: ['Maple Ave', 'Cedar Lane', 'Elm Street', 'School'] },
    { id: 'C', name: 'Route C', driver: 'Mike Johnson', status: 'idle', kids: 0, eta: '-', progress: 0, color: 'coral', stops: ['At Depot'] },
    { id: 'D', name: 'Route D', driver: 'Lisa Brown', status: 'active', kids: 7, eta: '9:00 AM', progress: 45, color: 'green', stops: ['Main Street', 'First Ave', 'Second Ave', 'School'] },
  ]

  const selected = selectedRoute || routes[0]

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4">
      {/* Map Area */}
      <div className="flex-1 relative rounded-card overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
        {/* Simulated Map Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(74, 144, 226, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 144, 226, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}>
          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
            {/* Main road */}
            <path d="M 0 300 Q 200 280 400 300 T 800 300" stroke="#94A3B8" strokeWidth="20" fill="none" strokeDasharray="10,5"/>
            {/* Vertical road */}
            <path d="M 400 0 Q 420 150 400 300 T 380 600" stroke="#94A3B8" strokeWidth="16" fill="none" strokeDasharray="10,5"/>
            {/* Route paths */}
            <path d="M 50 300 Q 150 280 250 320 Q 350 360 400 300 Q 450 240 550 280 Q 650 320 750 300" 
                  stroke="#4A90E2" strokeWidth="3" fill="none" strokeDasharray="8,4" opacity="0.6"/>
          </svg>
        </div>

        {/* School Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-coral to-orange-400 flex items-center justify-center shadow-lg animate-pulse">
            <GraduationCap size={28} className="text-white" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs font-medium text-gray-700 bg-white/80 px-2 py-1 rounded-full">ChildTrack School</span>
          </div>
        </div>

        {/* Bus Markers */}
        {routes.filter(r => r.status === 'active').map((route, index) => {
          const positions = [
            { x: 25, y: 35 },
            { x: 60, y: 45 },
            { x: 75, y: 30 }
          ]
          const pos = positions[index]
          return (
            <div 
              key={route.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setSelectedRoute(route)}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-${route.color} to-${route.color}-400 flex items-center justify-center shadow-lg animate-bounce`}>
                <Bus size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-medium text-white bg-gray-800 px-2 py-0.5 rounded-full">{route.driver.split(' ')[0]}</span>
              </div>
            </div>
          )
        })}

        {/* Pickup Points */}
        {['Oak St', 'Pine St', 'Maple Ave', 'Elm St'].map((stop, i) => {
          const positions = [
            { x: 15, y: 25 },
            { x: 35, y: 20 },
            { x: 55, y: 55 },
            { x: 70, y: 40 }
          ]
          const pos = positions[i]
          return (
            <div 
              key={stop}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                <MapPin size={16} className="text-accent-pink" />
              </div>
            </div>
          )
        })}

        {/* Floating Info Card */}
        <div className="absolute top-4 left-4 glass-card rounded-xl p-4 w-64 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary-${selected.color} to-${selected.color}-400 flex items-center justify-center`}>
                <Bus size={20} className="text-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-gray-800">{selected.name}</p>
                <p className="text-xs text-gray-500">{selected.driver}</p>
              </div>
            </div>
            <span className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Baby size={14} />
                <span>Children onboard</span>
              </div>
              <span className="font-bold text-gray-800">{selected.kids}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>ETA</span>
              </div>
              <span className="font-bold text-primary-blue">{selected.eta}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r from-primary-${selected.color} to-${selected.color}-400`}
                  style={{ width: `${selected.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{selected.progress}%</span>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Battery size={12} className="text-accent-green" />
                <span>85%</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Wifi size={12} className="text-primary-blue" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 glass-card rounded-xl p-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary-blue" />
              <span className="text-gray-600">Active Bus</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-accent-pink" />
              <span className="text-gray-600">Pickup Point</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary-coral" />
              <span className="text-gray-600">School</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Active Routes */}
      <div className="w-80 glass-card rounded-card p-4 flex flex-col">
        <h3 className="font-heading font-bold text-lg text-gray-800 mb-4">Active Routes</h3>
        
        <div className="flex-1 space-y-3 overflow-y-auto">
          {routes.map((route) => (
            <div 
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedRoute?.id === route.id 
                  ? 'bg-gradient-to-r from-primary-blue/10 to-primary-coral/10 border-2 border-primary-blue/30' 
                  : 'bg-white/50 hover:bg-white/80 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-primary-${route.color} to-${route.color}-400 flex items-center justify-center`}>
                    <Bus size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{route.name}</p>
                    <p className="text-xs text-gray-500">{route.driver}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  route.status === 'active' 
                    ? 'bg-accent-green/10 text-accent-green' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {route.status === 'active' ? '● Active' : '○ Idle'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <Baby size={12} />
                  <span>{route.kids} kids</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{route.eta}</span>
                </div>
              </div>

              <div className="bg-gray-100 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full bg-gradient-to-r from-primary-${route.color} to-${route.color}-400`}
                  style={{ width: `${route.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/50">
              <p className="text-2xl font-bold text-primary-blue">21</p>
              <p className="text-xs text-gray-500">Total Kids</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50">
              <p className="text-2xl font-bold text-accent-green">3/4</p>
              <p className="text-xs text-gray-500">Active Buses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-gray-800">Good Morning! ☀️</h2>
          <p className="text-gray-500">{currentDate}</p>
        </div>
        <button className="btn-gradient px-5 py-2.5 rounded-xl text-white font-medium shadow-lg text-sm">
          + Quick Action
        </button>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={Baby} 
          label="Total Children" 
          value={data?.childrenCount || 0} 
          trend={data?.childrenTrend || '0%'} 
          trendUp={data?.childrenTrendUp || false} 
          color="blue"
          delay={1}
        />
        <StatCard 
          icon={Users} 
          label="Staff Members" 
          value={data?.staffCount || 0} 
          trend={data?.staffTrend || '0%'} 
          trendUp={data?.staffTrendUp || false} 
          color="purple"
          delay={2}
        />
        <StatCard 
          icon={UserCheck} 
          label="Today Attendance" 
          value={data?.attendanceToday || 0} 
          trend={data?.attendanceTrend || '0%'} 
          trendUp={data?.attendanceTrendUp || false} 
          color="green"
          delay={3}
        />
        <StatCard 
          icon={DollarSign} 
          label="Pending Payments" 
          value={data?.pendingPayments || 0} 
          trend={data?.paymentsTrend || '$0'} 
          trendUp={data?.paymentsTrendUp || false} 
          color="coral"
          delay={4}
        />
      </div>

      {/* Middle Section - Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <RecentActivityCard />
      </div>

      {/* Bottom Section - Transport + Recruitment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TransportStatusCard />
        <RecruitmentCard />
      </div>
    </div>
  )
}

// Transport Status Card (for Dashboard)
function TransportStatusCard() {
  const drivers = [
    { id: 1, name: 'John Smith', route: 'Route A - Morning', status: 'active', location: 'Currently at Oak Street', kids: 8 },
    { id: 2, name: 'Sarah Davis', route: 'Route B - Morning', status: 'active', location: 'Returning to depot', kids: 6 },
    { id: 3, name: 'Mike Johnson', route: 'Route A - Afternoon', status: 'idle', location: 'At depot', kids: 0 },
    { id: 4, name: 'Lisa Brown', route: 'Route B - Afternoon', status: 'active', location: 'Pine Avenue stop', kids: 7 },
  ]

  return (
    <div className="glass-card rounded-card p-6 animate-slide-up stagger-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-lg text-gray-800">Transport Status</h3>
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
        </div>
        <button className="text-sm text-primary-blue font-medium hover:underline">Track All</button>
      </div>
      
      <div className="space-y-3">
        {drivers.map((driver) => (
          <div key={driver.id} className="p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center">
                  <Bus size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{driver.name}</p>
                  <p className="text-xs text-gray-500">{driver.route}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                driver.status === 'active' ? 'bg-accent-green/10 text-accent-green' : 'bg-gray-100 text-gray-500'
              }`}>
                {driver.status === 'active' ? '● Active' : '○ Idle'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{driver.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Baby size={12} />
                <span>{driver.kids} kids</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Active Drivers</span>
          <span className="font-medium text-gray-800">3/4</span>
        </div>
      </div>
    </div>
  )
}

// Recruitment Card (for Dashboard)
function RecruitmentCard() {
  const applications = [
    { id: 1, position: 'Teacher', name: 'Emily Watson', experience: '3 years', status: 'pending', applied: '2 days ago' },
    { id: 2, position: 'Nurse', name: 'Robert Chen', experience: '5 years', status: 'interview', applied: '3 days ago' },
    { id: 3, position: 'Assistant', name: 'Maria Garcia', experience: '1 year', status: 'pending', applied: '5 days ago' },
  ]

  const statusColors = {
    pending: 'bg-accent-yellow/10 text-amber-600',
    interview: 'bg-primary-blue/10 text-primary-blue',
    approved: 'bg-accent-green/10 text-accent-green',
    rejected: 'bg-red-100 text-red-600',
  }

  return (
    <div className="glass-card rounded-card p-6 animate-slide-up stagger-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-gray-800">Recruitment</h3>
        <button className="text-sm text-primary-blue font-medium hover:underline">View All</button>
      </div>
      
      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-violet-300 flex items-center justify-center">
                  <UserPlus size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{app.name}</p>
                  <p className="text-xs text-gray-500">{app.position} • {app.experience}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[app.status]}`}>
                {app.status === 'pending' ? 'Pending' : app.status === 'interview' ? 'Interview' : app.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Applied {app.applied}</span>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green hover:bg-accent-green/20 transition-colors">
                  <CheckCircle size={14} />
                </button>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                  <XCircle size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-accent-yellow" />
            <span className="text-gray-500">2 pending</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck size={14} className="text-primary-blue" />
            <span className="text-gray-500">1 interview</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component

import { BrowserRouter as Router } from 'react-router-dom'
import FullScreenLoader from './components/ui/FullScreenLoader'
import FlowManager from './components/FlowManager'

function AppContent() {
  return <FlowManager />
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App


import { useState, useEffect } from 'react'
import { Plus, X, Users, Clock, Calendar, TrendingUp, Baby, UserCheck, BookOpen, Award, Loader2, AlertCircle } from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'
import SkeletonCard from './ui/SkeletonCard'
import FullScreenLoader from './ui/FullScreenLoader'

// Classes Data (mock API response)
const classesData = [
  { id: 1, name: 'Sunbeam', ageGroup: '3-4 years', teacher: 'Maria Garcia', children: 12, capacity: 15, year: '2024-2025', color: 'blue' },
  { id: 2, name: 'Rainbow', ageGroup: '4-5 years', teacher: 'John Smith', children: 14, capacity: 15, year: '2024-2025', color: 'purple' },
  { id: 3, name: 'Starlight', ageGroup: '2-3 years', teacher: 'Sarah Johnson', children: 8, capacity: 10, year: '2024-2025', color: 'yellow' },
  { id: 4, name: 'Butterfly', ageGroup: '3-4 years', teacher: 'Emily Davis', children: 10, capacity: 12, year: '2024-2025', color: 'pink' },
]

const studentsData = {
  1: [
    { id: 1, name: 'Emma Johnson', age: 4, photo: '👧', attendance: 95, status: 'present' },
    { id: 2, name: 'Noah Wilson', age: 4, photo: '👦', attendance: 97, status: 'present' },
    { id: 3, name: 'Liam Smith', age: 4, photo: '👦', attendance: 88, status: 'absent' },
    { id: 4, name: 'Olivia Brown', age: 3, photo: '👧', attendance: 92, status: 'present' },
    { id: 5, name: 'Ava Martinez', age: 4, photo: '👧', attendance: 85, status: 'present' },
  ],
  2: [
    { id: 1, name: 'Sophia Garcia', age: 5, photo: '👧', attendance: 90, status: 'present' },
    { id: 2, name: 'Mason Taylor', age: 5, photo: '👦', attendance: 94, status: 'present' },
  ],
  3: [
    { id: 1, name: 'Lucas Anderson', age: 2, photo: '👦', attendance: 88, status: 'present' },
    { id: 2, name: 'Isabella Thomas', age: 3, photo: '👧', attendance: 91, status: 'present' },
  ],
  4: [
    { id: 1, name: 'Emma Davis', age: 3, photo: '👧', attendance: 89, status: 'present' },
    { id: 2, name: 'Oliver Martinez', age: 4, photo: '👦', attendance: 93, status: 'present' },
  ],
}

const scheduleData = [
  { time: '8:00 AM', activity: 'Arrival & Free Play', type: 'play' },
  { time: '9:00 AM', activity: 'Circle Time', type: 'learning' },
  { time: '9:30 AM', activity: 'Art & Craft', type: 'creative' },
  { time: '10:30 AM', activity: 'Outdoor Play', type: 'outdoor' },
  { time: '11:30 AM', activity: 'Snack Time', type: 'meal' },
  { time: '12:00 PM', activity: 'Naptime', type: 'rest' },
  { time: '2:00 PM', activity: 'Story Time', type: 'learning' },
  { time: '3:00 PM', activity: 'Music & Movement', type: 'creative' },
  { time: '4:00 PM', activity: 'Free Play', type: 'play' },
  { time: '5:00 PM', activity: 'Pickup', type: 'end' },
]

// Class Card Component
function ClassCard({ classData, onClick }) {
  const capacityPercent = Math.round((classData.children / classData.capacity) * 100)
  
  const colorClasses = {
    blue: 'from-primary-blue to-blue-400',
    purple: 'from-accent-purple to-violet-400',
    yellow: 'from-accent-yellow to-amber-400',
    pink: 'from-accent-pink to-rose-400',
  }

  const capacityColor = capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 70 ? 'bg-accent-yellow' : 'bg-accent-green'

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-card p-5 card-hover cursor-pointer animate-slide-up"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[classData.color]} flex items-center justify-center shadow-lg`}>
          <BookOpen size={24} className="text-white" />
        </div>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{classData.year}</span>
      </div>
      
      <h3 className="font-heading font-bold text-xl text-gray-800">{classData.name}</h3>
      <p className="text-sm text-gray-500">{classData.ageGroup}</p>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck size={16} className="text-primary-blue" />
          <span className="text-sm text-gray-600">{classData.teacher}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users size={16} className="text-accent-purple" />
          <span className="text-sm text-gray-600">{classData.children} children</span>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Capacity</span>
            <span className={`font-medium ${capacityPercent >= 90 ? 'text-red-500' : 'text-gray-700'}`}>{capacityPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${capacityColor}`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Class Detail Drawer Component
function ClassDrawer({ classData, onClose }) {
  if (!classData) return null
  const [activeTab, setActiveTab] = useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: Award },
  ]

  const students = studentsData[classData.id] || []
  const capacityPercent = Math.round((classData.children / classData.capacity) * 100)

  const activities = [
    { title: 'Art Day', date: 'Tomorrow', time: '10:00 AM' },
    { title: 'Field Trip', date: 'Friday', time: '9:00 AM' },
    { title: 'Music Class', date: 'Monday', time: '2:00 PM' },
  ]

  const colorClasses = {
    blue: 'from-primary-blue to-blue-400',
    purple: 'from-accent-purple to-violet-400',
    yellow: 'from-accent-yellow to-amber-400',
    pink: 'from-accent-pink to-rose-400',
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[480px] glass-card rounded-l-large z-50 overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-white/70 backdrop-blur-glass p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-gray-800">Class Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="p-5 bg-gradient-to-r from-primary-blue/10 to-primary-coral/10 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[classData.color]} flex items-center justify-center shadow-lg`}>
              <BookOpen size={32} className="text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-gray-800">{classData.name}</h3>
              <p className="text-gray-500">{classData.ageGroup}</p>
              <p className="text-sm text-gray-500">{classData.year}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-primary-blue border-b-2 border-primary-blue' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-5">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card-inner rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary-blue">{classData.children}</p>
                  <p className="text-sm text-gray-500">Children</p>
                </div>
                <div className="glass-card-inner rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-accent-purple">{classData.capacity}</p>
                  <p className="text-sm text-gray-500">Capacity</p>
                </div>
              </div>

              {/* Attendance Graph (Simplified) */}
              <div className="glass-card-inner rounded-xl p-4">
                <h4 className="font-heading font-semibold text-gray-800 mb-4">Weekly Attendance</h4>
                <div className="flex items-end justify-between gap-2 h-24">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
                    const heights = [85, 92, 78, 88, 95]
                    return (
                      <div key={day} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-primary-blue to-blue-300 rounded-t-md"
                          style={{ height: `${heights[i]}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-1">{day}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm text-gray-500">Average: </span>
                  <span className="text-sm font-bold text-accent-green">87.6%</span>
                </div>
              </div>

              {/* Upcoming Activities */}
              <div className="glass-card-inner rounded-xl p-4">
                <h4 className="font-heading font-semibold text-gray-800 mb-3">Upcoming Activities</h4>
                <div className="space-y-2">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-primary-blue" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.date} at {activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Staff */}
              <div className="glass-card-inner rounded-xl p-4">
                <h4 className="font-heading font-semibold text-gray-800 mb-3">Assigned Staff</h4>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center">
                    <span className="text-white">👩‍🏫</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{classData.teacher}</p>
                    <p className="text-xs text-gray-500">Lead Teacher</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-heading font-semibold text-gray-800">Enrolled Students</h4>
                <span className="text-sm text-gray-500">{students.length} total</span>
              </div>
              {students.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center">
                    <span className="text-2xl">{student.photo}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.age} years old</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      student.status === 'present' ? 'bg-accent-green/10 text-accent-green' : 'bg-red-100 text-red-600'
                    }`}>
                      {student.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{student.attendance}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-2">
              <h4 className="font-heading font-semibold text-gray-800 mb-4">Daily Schedule</h4>
              {scheduleData.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                  <div className="w-16 text-xs text-gray-500 font-medium">{item.time}</div>
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'learning' ? 'bg-primary-blue' :
                    item.type === 'play' ? 'bg-accent-purple' :
                    item.type === 'outdoor' ? 'bg-accent-green' :
                    item.type === 'meal' ? 'bg-accent-yellow' :
                    item.type === 'rest' ? 'bg-accent-pink' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-800">{item.activity}</span>
                </div>
              ))}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div className="glass-card-inner rounded-xl p-4">
                <h4 className="font-heading font-semibold text-gray-800 mb-3">Class Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average Attendance</span>
                    <span className="text-sm font-bold text-accent-green">87.6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Activity Participation</span>
                    <span className="text-sm font-bold text-primary-blue">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Parent Satisfaction</span>
                    <span className="text-sm font-bold text-accent-purple">4.8/5</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card-inner rounded-xl p-4">
                <h4 className="font-heading font-semibold text-gray-800 mb-3">Monthly Goals</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Attendance Target (90%)</span>
                      <span className="text-gray-700">87%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-accent-yellow" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Activity Completion</span>
                      <span className="text-gray-700">92%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-accent-green" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Classes Management Screen
export default function ClassesScreen() {
  const [selectedClass, setSelectedClass] = useState(null)
  const [academicYear, setAcademicYear] = useState('2024-2025')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [classesList, setClassesList] = useState([])

  // Live Supabase query - assume 'classes' table
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*, teacher:profiles(full_name), children_count:children(count)')

        if (error) throw error
        
        setClassesList(data || [])
      } catch (err) {
        setError('Failed to load classes. Please try again.')
        console.error('Classes fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const years = ['2024-2025', '2023-2024', '2022-2023']

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {/* Academic Year Selector */}
          <div className="relative">
            <select 
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="pl-4 pr-10 py-2.5 rounded-xl bg-white/70 border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-sm transition-all appearance-none cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Class Button */}
        <button 
          className="btn-gradient-coral px-5 py-2.5 rounded-xl text-white font-medium shadow-lg text-sm flex items-center justify-center gap-2 whitespace-nowrap hover:shadow-xl transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Loading...
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Class
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <>
          <FullScreenLoader message="Loading classes..." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 opacity-0">
            <SkeletonCard count={4} />
          </div>
        </>
      ) : error ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-2xl mx-auto animate-fade-in">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h3 className="font-heading text-2xl font-bold text-gray-800 mb-4">Unable to Load Classes</h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Retry
          </button>
        </div>
      ) : classesList.filter(c => c.year === academicYear).length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="font-heading text-2xl font-bold text-gray-800 mb-4">No Classes Found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">No classes for {academicYear}. Create your first class to get started!</p>
          <button className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-lg inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 [&>*]:animate-fade-in">
          {classesList.filter(c => c.year === academicYear).map((classData, index) => (
            <div key={classData.id} style={{ animationDelay: `${index * 50}ms` }}>
              <ClassCard 
                classData={classData} 
                onClick={() => setSelectedClass(classData)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Class Detail Drawer */}
      {selectedClass && (
        <ClassDrawer 
          classData={selectedClass} 
          onClose={() => setSelectedClass(null)} 
        />
      )}
    </div>
  )
}


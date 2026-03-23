import { LayoutDashboard, Users, GraduationCap, Clock, Baby, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Today Attendance', value: '42/45', icon: CheckCircle, color: 'green' },
    { label: 'My Classes', value: '2', icon: GraduationCap, color: 'blue' },
    { label: 'Children Assigned', value: '28', icon: Baby, color: 'purple' },
    { label: 'Check-ins Today', value: '38', icon: Clock, color: 'orange' }
  ]

  const recentActivities = [
    { time: '10 min ago', action: 'Marked attendance for Sunbeam class', type: 'attendance' },
    { time: '2 hours ago', action: 'Updated parent contact info', type: 'update' },
    { time: 'Yesterday', action: 'Submitted daily report', type: 'report' }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="glass-card-inner p-6 rounded-2xl text-center hover:shadow-xl transition-all">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-500 flex items-center justify-center`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="font-heading font-bold text-xl text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="glass-card-inner p-6 rounded-xl text-center hover:shadow-xl transition-all group">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary-blue group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 mb-1">Take Attendance</h3>
              <p className="text-sm text-gray-600">Mark children present</p>
            </button>
            <button className="glass-card-inner p-6 rounded-xl text-center hover:shadow-xl transition-all group">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-accent-purple group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 mb-1">My Schedule</h3>
              <p className="text-sm text-gray-600">View today's classes</p>
            </button>
            <button className="glass-card-inner p-6 rounded-xl text-center hover:shadow-xl transition-all group">
              <Baby className="w-12 h-12 mx-auto mb-4 text-accent-green group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 mb-1">Child Profiles</h3>
              <p className="text-sm text-gray-600">View assigned children</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-heading font-bold text-xl text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'attendance' ? 'bg-accent-green' :
                  activity.type === 'update' ? 'bg-primary-blue' :
                  'bg-accent-purple'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Classes Today */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-heading font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-accent-purple" />
          My Classes Today
        </h2>
        <div className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">Sunbeam (9:00 AM - 11:30 AM)</h3>
                <p className="text-sm text-gray-600">12 children • Room 101</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-accent-green/20 text-accent-green text-xs font-medium rounded-full">Present: 11</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">Absent: 1</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary-blue text-white py-2.5 px-4 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all">
                Take Attendance
              </button>
              <button className="flex-1 bg-white border border-gray-200 py-2.5 px-4 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all">
                View Children
              </button>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">Rainbow (1:00 PM - 3:30 PM)</h3>
                <p className="text-sm text-gray-600">15 children • Room 102</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-accent-green/20 text-accent-green text-xs font-medium rounded-full">Present: 14</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">Absent: 1</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary-blue text-white py-2.5 px-4 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all">
                Take Attendance
              </button>
              <button className="flex-1 bg-white border border-gray-200 py-2.5 px-4 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all">
                View Children
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


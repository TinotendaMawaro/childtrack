import { useState, useEffect } from 'react'
import { 
  LayoutDashboard,
  Baby,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Bus,
  FileText,
  GraduationCap,
  UserPlus,
  AlertCircle
} from 'lucide-react'
import { useDashboardData } from '../hooks/useDashboardData'

// Import shared dashboard components
import { AnimatedCounter, StatCard } from './ui/DashboardComponents'

// Main Dashboard Component
export default function Dashboard() {
  const { data, loading, error } = useDashboardData()
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array(4).fill().map((_, i) => (
            <div key={i} className="glass-card rounded-card p-5 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                <div className="w-16 h-4 bg-gray-200 rounded" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 text-center p-20">
        <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h2 className="font-heading text-2xl font-bold text-gray-800 mb-4">Dashboard Data Unavailable</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
        <button className="btn-gradient px-8 py-3 rounded-xl text-white font-semibold shadow-lg mx-auto inline-flex items-center gap-2">
          Retry Data Load
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-gray-800">
            {(() => {
              const hour = new Date().getHours();
              if (hour < 12) return 'Good morning';
              if (hour < 17) return 'Good afternoon';
              return 'Good evening';
            })()} {data.userName || 'Admin'}!</h2>
          <p className="text-gray-500">{currentDate}</p>
        </div>
        <button className="btn-gradient glow-mint px-5 py-2.5 rounded-xl text-white font-medium shadow-lg text-sm" style={{display: 'none'}}>
          + Add Child 🌟
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={Baby} 
          label="Total Children" 
          value={data.childrenCount || 0} 
          trend={data.childrenTrend || '0%'} 
          trendUp={data.childrenTrendUp || false} 
          color="blue"
          delay={1}
        />
        <StatCard 
          icon={Users} 
          label="Staff Members" 
          value={data.staffCount || 0} 
          trend={data.staffTrend || '0%'} 
          trendUp={data.staffTrendUp || false} 
          color="purple"
          delay={2}
        />
        <StatCard 
          icon={UserCheck} 
          label="Present Today" 
          value={data.attendanceToday || 0} 
          trend={data.attendanceTrend || '0%'} 
          trendUp={data.attendanceTrendUp || false} 
          color="green"
          delay={3}
        />
        <StatCard 
          icon={DollarSign} 
          label="Pending Payments" 
          value={data.pendingPayments || 0} 
          trend={data.paymentsTrend || '$0'} 
          trendUp={data.paymentsTrendUp || false} 
          color="coral"
          delay={4}
        />
      </div>

      {/* Middle: Attendance Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-gray-800">Attendance This Week</h3>
            <button className="text-sm text-primary-blue font-medium hover:underline" onClick={() => window.print()}>Print Report</button>
          </div>
          {/* Simple gradient bars */}
          <div className="flex items-end justify-between gap-4 h-32 bg-gray-50 rounded-xl p-4">
            {data.weeklyAttendance && data.weeklyAttendance.length > 0 ? data.weeklyAttendance.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1" title={`${day.count} / ${day.total}`}>
                <div 
                  className="w-8 bg-gradient-to-t from-primary-blue to-blue-300 rounded-lg shadow-lg relative group hover:scale-110 cursor-pointer transition-all" 
                  style={{ height: `${Math.max(day.percentage, 10)}%` }}
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {day.count} present
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{day.day}</span>
              </div>
            )) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
              <div key={day} className="flex flex-col items-center flex-1">
                <div className="w-8 h-24 bg-gradient-to-t from-primary-blue to-blue-300 rounded-lg shadow-lg opacity-40 animate-pulse" />
                <span className="text-xs text-gray-500 mt-2">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Average: {data.weeklyAvg || 'Loading...'}</span>
            <span className="font-medium text-accent-green">{data.weeklyTrend || '+5%'} this week</span>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="glass-card rounded-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-gray-800">Recent Activity</h3>
            <button className="text-sm text-primary-blue hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {data.recentActivities && data.recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              (data.recentActivities || []).slice(0, 4).map((activity, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/50 hover:bg-white transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-blue/20 flex items-center justify-center">
                      <Baby size={16} className="text-primary-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity?.title || 'Activity'}</p>
                      <p className="text-xs text-gray-500">{activity?.time || 'Now'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Transport + Recruitment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Transport Status */}
        <div className="glass-card rounded-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-heading font-bold text-lg text-gray-800">Transport Status</h3>
            <Bus className="w-5 h-5 text-primary-blue" />
          </div>
          <div className="space-y-3">
            {(data.transportRoutes || []).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active routes</p>
              </div>
            ) : (
              ['Route A - Active (8 kids)', 'Route B - Idle'].map((route, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/50">
                  <p className="text-sm font-medium text-gray-800">{route}</p>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Recruitment */}
        <div className="glass-card rounded-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-heading font-bold text-lg text-gray-800">Recruitment</h3>
            <UserPlus className="w-5 h-5 text-accent-purple" />
          </div>
          <div className="space-y-3">
            {(data.applicants || []).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No new applications</p>
              </div>
            ) : (
              ['Emily Watson - Teacher (Pending)', 'Robert Chen - Nurse (Interview)'].map((app, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/50">
                  <p className="text-sm font-medium text-gray-800">{app}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

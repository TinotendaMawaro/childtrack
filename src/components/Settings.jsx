import { useState } from 'react'
import { ChevronDown, Save, School, Calendar, Users, Bell, FileText, Edit3, Trash2, CheckCircle, AlertCircle, Clock, Mail, Phone, Globe } from 'lucide-react'

// Accordion Item Component
function AccordionItem({ title, icon: Icon, children, isOpen, onToggle }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden shadow-lg">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center shadow-md">
            <Icon size={20} className="text-white" />
          </div>
          <h3 className="font-heading font-bold text-lg text-gray-800">{title}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 space-y-4 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}

// School Profile Section
function SchoolProfileSection() {
  const [editing, setEditing] = useState(false)
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">School Information</h4>
        <button 
          onClick={() => setEditing(!editing)}
          className="text-sm text-primary-blue hover:underline flex items-center gap-1"
        >
          <Edit3 size={14} />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
          <input 
            defaultValue="ChildTrack Nursery & Preschool"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">License #</label>
          <input 
            defaultValue="NRC-2024-001"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Established</label>
          <input 
            defaultValue="2018"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
          <input 
            defaultValue="120 children"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70"
            disabled={!editing}
          />
        </div>
      </div>
      
      <div className="glass-card-inner p-4 rounded-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea 
          rows={2}
          defaultValue="123 ChildCare Lane, Happy Valley, HV 12345"
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70 resize-vertical"
          disabled={!editing}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input 
            defaultValue="(555) 123-4567"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            defaultValue="info@childtrack.com"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70"
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input 
            defaultValue="www.childtrack.com"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 bg-white/70"
            disabled={!editing}
          />
        </div>
      </div>
    </div>
  )
}

// Academic Calendar Section
function AcademicCalendarSection() {
  const holidays = [
    { date: '2024-12-25', name: 'Christmas', type: 'holiday' },
    { date: '2024-01-01', name: 'New Year', type: 'holiday' },
    { date: '2024-07-04', name: 'Summer Break', type: 'break' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h4 className="font-semibold text-gray-800">2024-2025 Academic Calendar</h4>
        <span className="text-xs px-2 py-1 bg-accent-green/10 text-accent-green rounded-full">Current</span>
      </div>
      
      <div className="glass-card-inner p-4 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="py-3 text-left text-sm font-semibold text-gray-700">Event</th>
              <th className="py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-white/50">
                <td className="py-3">{new Date(holiday.date).toLocaleDateString()}</td>
                <td className="py-3 font-medium text-gray-800">{holiday.name}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    holiday.type === 'holiday' ? 'bg-red-100 text-red-600' : 'bg-accent-yellow/10 text-amber-600'
                  }`}>
                    {holiday.type}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button className="p-1.5 text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="glow-mint px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto">
        <Calendar size={18} />
        Add Holiday/Event
      </button>
    </div>
  )
}

// User Roles Section
function UserRolesSection() {
  const roles = [
    { name: 'Admin', users: 3, permissions: ['All'], color: 'bg-primary-blue/10' },
    { name: 'Teacher', users: 12, permissions: ['Children', 'Classes', 'Attendance'], color: 'bg-accent-green/10' },
    { name: 'Assistant', users: 8, permissions: ['Children', 'Attendance'], color: 'bg-accent-purple/10' },
  ]

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800">User Roles & Permissions</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role, i) => (
          <div key={i} className={`glass-card-inner p-5 rounded-xl ${role.color}`}>
            <div className="flex items-start justify-between mb-4">
              <h5 className="font-bold text-lg text-gray-800">{role.name}</h5>
              <span className="text-2xl font-bold text-primary-blue">{role.users}</span>
            </div>
            <ul className="space-y-1">
              {role.permissions.map((perm, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-accent-green" />
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <button className="glow-mint px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all mx-auto">
        Manage Roles
      </button>
    </div>
  )
}

// Notifications Settings
function NotificationsSection() {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800">Notifications</h4>
      
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-4 rounded-xl bg-white/50 hover:bg-white/70 cursor-pointer group">
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary-blue focus:ring-primary-blue" />
          <div>
            <p className="font-medium text-gray-800">Payment Reminders</p>
            <p className="text-sm text-gray-500 group-hover:text-gray-600">Notify parents about overdue fees</p>
          </div>
        </label>
        
        <label className="flex items-center gap-3 p-4 rounded-xl bg-white/50 hover:bg-white/70 cursor-pointer group">
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary-blue focus:ring-primary-blue" />
          <div>
            <p className="font-medium text-gray-800">Attendance Alerts</p>
            <p className="text-sm text-gray-500 group-hover:text-gray-600">Low attendance notifications</p>
          </div>
        </label>
        
        <label className="flex items-center gap-3 p-4 rounded-xl bg-white/50 hover:bg-white/70 cursor-pointer group">
          <input type="checkbox" className="w-5 h-5 rounded text-primary-blue focus:ring-primary-blue" />
          <div>
            <p className="font-medium text-gray-800">New Applications</p>
            <p className="text-sm text-gray-500 group-hover:text-gray-600">Recruitment pipeline updates</p>
          </div>
        </label>
      </div>
    </div>
  )
}

// System Logs Section
function SystemLogsSection() {
  const logs = [
    { time: '2:45 PM', user: 'Admin', action: 'Updated staff profile', ip: '192.168.1.100' },
    { time: '2:30 PM', user: 'Maria G.', action: 'Marked attendance', ip: '192.168.1.101' },
    { time: '1:15 PM', user: 'System', action: 'Backup completed', ip: '-' },
    { time: '12:00 PM', user: 'John S.', action: 'Added new child', ip: '192.168.1.102' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Recent System Activity</h4>
        <button className="text-sm text-primary-blue hover:underline flex items-center gap-1">
<FileText size={14} />
          Export Logs
        </button>
      </div>
      
      <div className="glass-card-inner rounded-xl max-h-64 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {logs.map((log, i) => (
            <div key={i} className="p-4 hover:bg-white/50 transition-colors">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 w-16">{log.time}</span>
                <span className="font-medium text-gray-800">{log.user}</span>
                <span className="text-gray-600 flex-1">{log.action}</span>
                <span className="text-xs text-gray-400">{log.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Settings Screen
export default function SettingsScreen() {
  const [openSections, setOpenSections] = useState({
    school: true,
    calendar: false,
    roles: false,
    notifications: false,
    logs: false,
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="font-heading font-bold text-3xl text-gray-800">Settings</h1>
        <span className="text-sm px-3 py-1 bg-accent-green/10 text-accent-green rounded-full font-medium">Live</span>
      </div>

      <div className="space-y-6">
        <AccordionItem
          title="School Profile"
          icon={School}
          isOpen={openSections.school}
          onToggle={() => toggleSection('school')}
        >
          <SchoolProfileSection />
        </AccordionItem>

        <AccordionItem
          title="Academic Calendar"
          icon={Calendar}
          isOpen={openSections.calendar}
          onToggle={() => toggleSection('calendar')}
        >
          <AcademicCalendarSection />
        </AccordionItem>

        <AccordionItem
          title="User Roles & Permissions"
          icon={Users}
          isOpen={openSections.roles}
          onToggle={() => toggleSection('roles')}
        >
          <UserRolesSection />
        </AccordionItem>

        <AccordionItem
          title="Notifications Settings"
          icon={Bell}
          isOpen={openSections.notifications}
          onToggle={() => toggleSection('notifications')}
        >
          <NotificationsSection />
        </AccordionItem>

        <AccordionItem
          title="System Logs"
          icon={FileText}
          isOpen={openSections.logs}
          onToggle={() => toggleSection('logs')}
        >
          <SystemLogsSection />
        </AccordionItem>
      </div>

      <div className="pt-8 border-t border-gray-100 flex justify-end gap-3">
        <button className="px-8 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
          Cancel
        </button>
        <button className="glow-mint px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 bg-gradient-to-r from-accent-green to-emerald-400">
          <Save size={20} />
          Save All Changes
        </button>
      </div>
    </div>
  )
}


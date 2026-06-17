import { useState, useEffect } from 'react'
import { ChevronDown, Save, School, Calendar, Users, Bell, FileText, Edit3, Trash2, CheckCircle, AlertCircle, Clock, Mail, Phone, Globe, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

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
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 space-y-4 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}

function SchoolProfileSection({ org, onUpdate, saving }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', timezone: 'Africa/Johannesburg'
  })

  useEffect(() => {
    if (org) {
      setForm({
        name: org.name || '',
        email: org.email || '',
        phone: org.phone || '',
        address: org.address || '',
        timezone: org.timezone || 'Africa/Johannesburg'
      })
    }
  }, [org])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    await onUpdate(form)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
          >
            <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-green to-emerald-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}

function AcademicCalendarSection() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .order('event_date', { ascending: true })

        if (error) throw error
        setEvents(data || [])
      } catch (err) {
        console.error('Error fetching calendar events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendar()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h4 className="font-semibold text-gray-800">Academic Calendar</h4>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No calendar events configured yet.
        </div>
      ) : (
        <div className="glass-card-inner rounded-xl overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 text-left text-sm font-semibold text-gray-700">Event</th>
                <th className="py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <tr key={event.id || i} className="border-b border-gray-100 hover:bg-white/50">
                  <td className="py-3 text-sm text-gray-700">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-800">{event.title || event.name}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.event_type === 'holiday' ? 'bg-red-100 text-red-600' :
                      event.event_type === 'break' ? 'bg-accent-yellow/10 text-amber-600' :
                      'bg-primary-blue/10 text-primary-blue'
                    }`}>
                      {event.event_type || 'event'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function UserRolesSection() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('role_permissions')
          .select('role, permission, resource')

        if (error) throw error

        const grouped = (data || []).reduce((acc, row) => {
          if (!acc[row.role]) acc[row.role] = { name: row.role, permissions: [] }
          acc[row.role].permissions.push(row.permission)
          return acc
        }, {})

        setRoles(Object.values(grouped))
      } catch (err) {
        console.error('Error fetching roles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800">User Roles & Permissions</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role, i) => (
          <div key={i} className="glass-card-inner p-5 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <h5 className="font-bold text-lg text-gray-800">{role.name}</h5>
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
    </div>
  )
}

function NotificationsSection({ settings, onUpdate, saving }) {
  const [form, setForm] = useState({
    payment_reminders: true,
    attendance_alerts: true,
    new_applications: false,
    system_alerts: true
  })

  useEffect(() => {
    if (settings) {
      setForm({
        payment_reminders: settings.payment_reminders ?? true,
        attendance_alerts: settings.attendance_alerts ?? true,
        new_applications: settings.new_applications ?? false,
        system_alerts: settings.system_alerts ?? true
      })
    }
  }, [settings])

  const toggle = (key) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    await onUpdate({ notification_settings: form })
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      {[
        { key: 'payment_reminders', title: 'Payment Reminders', desc: 'Notify parents about overdue fees' },
        { key: 'attendance_alerts', title: 'Attendance Alerts', desc: 'Low attendance notifications' },
        { key: 'new_applications', title: 'New Applications', desc: 'Recruitment pipeline updates' },
        { key: 'system_alerts', title: 'System Alerts', desc: 'Critical system notifications' }
      ].map(item => (
        <label key={item.key} className="flex items-center gap-3 p-4 rounded-xl bg-white/50 hover:bg-white/70 cursor-pointer group">
          <input
            type="checkbox"
            checked={form[item.key]}
            onChange={() => toggle(item.key)}
            className="w-5 h-5 rounded text-primary-blue focus:ring-primary-blue"
          />
          <div>
            <p className="font-medium text-gray-800">{item.title}</p>
            <p className="text-sm text-gray-500 group-hover:text-gray-600">{item.desc}</p>
          </div>
        </label>
      ))}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-green to-emerald-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Notifications'}
        </button>
      </div>
    </form>
  )
}

function SystemLogsSection() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('auth_audit_log')
          .select(`
            *,
            user:user_profiles(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setLogs(data || [])
      } catch (err) {
        console.error('Error fetching logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Recent System Activity</h4>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No system logs available.
        </div>
      ) : (
        <div className="glass-card-inner rounded-xl max-h-96 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {logs.map((log, i) => (
              <div key={log.id || i} className="p-4 hover:bg-white/50 transition-colors">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-20">
                    {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </span>
                  <span className="font-medium text-gray-800">{log.user?.full_name || log.user_id?.slice(0, 8) || 'System'}</span>
                  <span className="text-gray-600 flex-1">{log.action}</span>
                  <span className="text-xs text-gray-400">{log.ip_address || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsScreen() {
  const [openSections, setOpenSections] = useState({
    school: true,
    calendar: false,
    roles: false,
    notifications: false,
    logs: false,
  })

  const [org, setOrg] = useState(null)
  const [notificationSettings, setNotificationSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data: orgData } = await supabase
        .from('organization')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (orgData) setOrg(orgData)

      // Notification settings can be stored in organization.settings JSONB or a separate table
      // For now, we'll use the settings JSONB column if available
      if (orgData?.settings) {
        setNotificationSettings(orgData.settings)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  const handleOrgUpdate = async (formData) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('organization')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          timezone: formData.timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', org.id)

      if (error) throw error

      setOrg(prev => ({ ...prev, ...formData }))
      setMessage({ type: 'success', text: 'School profile updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error('Error updating organization:', err)
      setMessage({ type: 'error', text: 'Failed to update: ' + err.message })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = async (formData) => {
    setSaving(true)
    try {
      const updatedSettings = {
        ...(org?.settings || {}),
        ...formData
      }

      const { error } = await supabase
        .from('organization')
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', org.id)

      if (error) throw error

      setNotificationSettings(updatedSettings)
      setMessage({ type: 'success', text: 'Notification settings saved!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error('Error updating notifications:', err)
      setMessage({ type: 'error', text: 'Failed to save: ' + err.message })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

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
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <AccordionItem
          title="School Profile"
          icon={School}
          isOpen={openSections.school}
          onToggle={() => toggleSection('school')}
        >
          {org ? (
            <SchoolProfileSection org={org} onUpdate={handleOrgUpdate} saving={saving} />
          ) : (
            <div className="text-center py-8 text-gray-500">Loading school profile...</div>
          )}
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
          <NotificationsSection
            settings={notificationSettings}
            onUpdate={handleNotificationUpdate}
            saving={saving}
          />
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
    </div>
  )
}

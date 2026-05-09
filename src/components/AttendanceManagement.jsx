import { useState, useEffect } from 'react'
import {
  Calendar, Users, TrendingUp, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, Filter, Download, Edit, Eye,
  BarChart3, PieChart, Search
} from 'lucide-react'
import { useAttendance } from '../hooks/useAttendance'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

export default function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [classes, setClasses] = useState([])
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAttendance, setEditingAttendance] = useState(null)
  const [viewMode, setViewMode] = useState('daily') // daily, weekly, monthly
  const [searchTerm, setSearchTerm] = useState('')

  const { fetchAttendanceData, markAttendance } = useAttendance()
  const { profile } = useAuth()

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Load attendance data when date/class changes
  useEffect(() => {
    if (selectedClass) {
      loadAttendanceData()
    }
  }, [selectedDate, selectedClass])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .order('name')

      if (classesError) throw classesError
      setClasses(classesData || [])

      // Load children
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select(`
          *,
          classes (
            name
          )
        `)
        .eq('status', 'ACTIVE')
        .order('full_name')

      if (childrenError) throw childrenError
      setChildren(childrenData || [])

      // Set default class
      if (classesData && classesData.length > 0) {
        setSelectedClass(classesData[0])
      }

    } catch (error) {
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAttendanceData = async () => {
    if (!selectedClass) return

    try {
      setLoading(true)

      let startDate, endDate

      if (viewMode === 'daily') {
        startDate = endDate = selectedDate
      } else if (viewMode === 'weekly') {
        const date = new Date(selectedDate)
        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Monday start
        startDate = new Date(date.setDate(diff)).toISOString().split('T')[0]
        endDate = new Date(date.setDate(diff + 6)).toISOString().split('T')[0]
      } else if (viewMode === 'monthly') {
        const date = new Date(selectedDate)
        startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
      }

      const result = await fetchAttendanceData(startDate, endDate, selectedClass.id)

      if (result.success) {
        setAttendanceData(result.data)
      }

    } catch (error) {
      console.error('Load attendance error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (attendanceId, newStatus) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .update({ status: newStatus })
        .eq('id', attendanceId)

      if (error) throw error

      // Reload data
      loadAttendanceData()

    } catch (error) {
      console.error('Update status error:', error)
      alert('Failed to update attendance status')
    }
  }

  const getAttendanceStats = () => {
    const classChildren = children.filter(child =>
      !child.class_id || child.class_id === selectedClass?.id
    )

    const stats = {
      total: classChildren.length,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0
    }

    attendanceData.forEach(record => {
      switch (record.status) {
        case 'PRESENT': stats.present++; break
        case 'ABSENT': stats.absent++; break
        case 'LATE': stats.late++; break
        case 'EXCUSED': stats.excused++; break
      }
    })

    return stats
  }

  const exportAttendance = () => {
    // Simple CSV export
    const csvData = [
      ['Date', 'Student Name', 'Class', 'Status', 'Recorded By'],
      ...attendanceData.map(record => [
        record.date,
        record.children?.full_name || 'Unknown',
        record.classes?.name || 'Unknown',
        record.status,
        record.profiles?.full_name || 'Unknown'
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredAttendance = attendanceData.filter(record =>
    record.children?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = getAttendanceStats()

  if (loading && classes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-heading font-bold text-gray-700">Loading Attendance Data</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-pink-50/70 to-yellow-50/70">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-glass border-b border-gray-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-800">Attendance Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage student attendance records</p>
          </div>
          <button
            onClick={exportAttendance}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              />
            </div>

            {/* Class Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass?.id || ''}
                onChange={(e) => {
                  const cls = classes.find(c => c.id === e.target.value)
                  setSelectedClass(cls)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="glass-card p-4 text-center rounded-2xl">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-600">Total Students</p>
          </div>

          <div className="glass-card p-4 text-center rounded-2xl">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stats.present}</p>
            <p className="text-xs text-gray-600">Present</p>
          </div>

          <div className="glass-card p-4 text-center rounded-2xl">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stats.absent}</p>
            <p className="text-xs text-gray-600">Absent</p>
          </div>

          <div className="glass-card p-4 text-center rounded-2xl">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stats.late}</p>
            <p className="text-xs text-gray-600">Late</p>
          </div>

          <div className="glass-card p-4 text-center rounded-2xl">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-gray-800">
              {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-600">Attendance Rate</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Attendance Records {viewMode === 'daily' ? `for ${new Date(selectedDate).toLocaleDateString()}` : ''}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center mr-3">
                          {record.children?.photo_url ? (
                            <img src={record.children.photo_url} alt={record.children.full_name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-xs font-bold text-white">
                              {record.children?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.children?.full_name || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.classes?.name || 'Unknown Class'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                        record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                        record.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.profiles?.full_name || 'Unknown'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingAttendance(record)
                          setShowEditModal(true)
                        }}
                        className="text-primary-blue hover:text-primary-blue/80 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-sm font-medium text-gray-900">No attendance records</h3>
              <p className="text-sm text-gray-500">No records found for the selected date and class.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingAttendance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-gray-800">Edit Attendance</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <XCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>{editingAttendance.children?.full_name}</strong> on {new Date(editingAttendance.date).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusChange(editingAttendance.id, status)
                      setShowEditModal(false)
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      editingAttendance.status === status
                        ? 'bg-primary-blue text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
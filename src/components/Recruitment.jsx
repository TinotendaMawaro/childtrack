import { useState, useEffect } from 'react'
import { Search, ChevronDown, UserPlus, X, Download, Send, CheckCircle, XCircle, FileText, Clock, UserCheck, Award, Calendar, TrendingUp, Loader2, AlertCircle, Edit, Trash2, Plus } from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'
import SkeletonTable from './ui/SkeletonTable'
import { supabase } from '../lib/supabaseClient'
// StatCard is defined inline


// Mock Applicant Data (API response)
const applicantsData = [
  { id: 1, name: 'Emily Watson', position: 'Teacher', experience: '3 years', status: 'pending', applied: '2 days ago', cv: 'Emily Watson - Teacher CV.pdf', notes: 'Strong preschool experience. References checked.', rating: '4.5/5' },
  { id: 2, name: 'Robert Chen', position: 'Nurse', experience: '5 years', status: 'interview', applied: '3 days ago', cv: 'Robert Chen - Nurse CV.pdf', notes: 'First aid certified. Interview scheduled for tomorrow.', rating: '4.8/5' },
  { id: 3, name: 'Maria Gonzalez', position: 'Assistant', experience: '1 year', status: 'pending', applied: '5 days ago', cv: 'Maria Gonzalez - Assistant CV.pdf', notes: 'Bilingual (Spanish/English). Great with young children.', rating: '4.2/5' },
  { id: 4, name: 'James Patel', position: 'Teacher', experience: '4 years', status: 'hired', applied: '1 week ago', cv: 'James Patel - Teacher CV.pdf', notes: 'Music specialist. Hired for Rainbow class.', rating: '4.9/5' },
  { id: 5, name: 'Sarah Kim', position: 'Admin', experience: '2 years', status: 'rejected', applied: '4 days ago', cv: 'Sarah Kim - Admin CV.pdf', notes: 'Not enough admin experience required.', rating: '3.8/5' },
  { id: 6, name: 'David Thompson', position: 'Assistant', experience: '2 years', status: 'interview', applied: '1 day ago', cv: 'David Thompson - Assistant CV.pdf', notes: 'Sports coach background. Very enthusiastic.', rating: '4.3/5' },
]

// Status Config
const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-accent-yellow/10 text-amber-600', icon: Clock },
  interview: { label: 'Interview Scheduled', color: 'bg-primary-blue/10 text-primary-blue', icon: Calendar },
  hired: { label: 'Hired', color: 'bg-accent-green/10 text-accent-green', icon: UserCheck },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-600', icon: XCircle },
}

// StatCard Component (reuse pattern)
function StatCard({ icon: Icon, label, value, trend, trendUp, color, delay = 0 }) {
  const colorClasses = {
    blue: 'from-primary-blue to-blue-400',
    green: 'from-accent-green to-emerald-400',
    yellow: 'from-accent-yellow to-amber-400',
    purple: 'from-accent-purple to-violet-400',
  }

  return (
    <div className={`glass-card rounded-card p-5 card-hover animate-slide-up ${delay > 0 ? `stagger-${delay}` : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" strokeWidth={2} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-accent-green' : 'text-red-500'}`}>
            <TrendingUp size={14} className={!trendUp && 'rotate-180'} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="font-heading font-bold text-2xl text-gray-800 lg:text-3xl">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}

// Applicant Table Row
function ApplicantRow({ applicant, onView, onEdit, onDelete }) {
  const status = statusConfig[applicant.status]
  const StatusIcon = status.icon

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-b-0">
      <td className="py-4 pl-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center shadow-md">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{applicant.name}</p>
            <p className="text-xs text-gray-500">{applicant.applied}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="font-medium text-sm text-gray-800 capitalize">{applicant.position}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-gray-600">{applicant.experience}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </td>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(applicant)}
            className="text-xs px-2 py-1 bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20 rounded transition-colors"
            title="View Details"
          >
            <FileText size={12} />
          </button>
          <button
            onClick={() => onEdit(applicant)}
            className="text-xs px-2 py-1 bg-amber-100 text-amber-600 hover:bg-amber-200 rounded transition-colors"
            title="Edit"
          >
            <Edit size={12} />
          </button>
          <button
            onClick={() => onDelete(applicant.id)}
            className="text-xs px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// Applicant Modal
function ApplicantModal({ applicant, isOpen, onClose, onApprove, onReject, onEdit, onDelete }) {
  if (!isOpen || !applicant) return null

  const status = statusConfig[applicant.status]
  const StatusIcon = status.icon

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-end max-w-4xl p-4">
        <div className="w-full max-w-2xl glass-card rounded-l-large shadow-2xl animate-slide-in-right max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur p-6 border-b border-gray-100 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl text-gray-800">{applicant.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-600 capitalize">{applicant.position}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${status.color} flex items-center gap-1`}>
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{applicant.experience}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors self-start -m-2">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* CV Preview */}
            <div className="glass-card-inner rounded-xl p-6">
              <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} />
                CV Preview
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-200 text-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-800">{applicant.cv}</span>
                  <button className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all flex items-center gap-1">
                    <Download size={12} />
                    Download
                  </button>
                </div>
                <div className="space-y-3">
                  <div><strong>Summary:</strong> {applicant.experience} experience in early childhood education. Certified in first aid and child development.</div>
                  <div><strong>Skills:</strong> Classroom management, curriculum planning, parent communication, creative activities.</div>
                  <div><strong>Education:</strong> Bachelor's in Early Childhood Education, University of Example.</div>
                  <div><strong>References:</strong> Available upon request.</div>
                </div>
              </div>
            </div>

            {/* Interview Notes */}
            <div className="glass-card-inner rounded-xl p-6">
              <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Award size={20} />
                Interview Notes & Rating
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    rows={4}
                    placeholder="Add interview notes, strengths, concerns..."
                    defaultValue={applicant.notes}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue resize-vertical text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Overall Rating</span>
                  <span className="text-2xl font-bold text-primary-blue">{applicant.rating}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  onApprove(applicant.id)
                  onClose()
                }}
                className="flex-1 btn-gradient px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <UserCheck size={18} />
                Approve & Hire
              </button>
              <button 
                onClick={() => {
                  onReject(applicant.id)
                  onClose()
                }}
                className="flex-1 bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Main Recruitment Screen
export default function RecruitmentScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // CRUD states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingApplicant, setEditingApplicant] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    experience: '',
    status: 'pending',
    cv: '',
    notes: '',
    rating: '3.0/5'
  })

  // Live Supabase query - assume 'applicants' table
  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .order('applied_date', { ascending: false })

      if (error) throw error

      // Transform data to match UI format
      const transformedData = (data || []).map(app => ({
        id: app.id,
        name: app.name,
        position: app.position,
        experience: app.experience,
        status: app.status,
        applied: app.applied_date ? `${Math.floor((new Date() - new Date(app.applied_date)) / (1000 * 60 * 60 * 24))} days ago` : 'N/A',
        cv: app.cv_file || 'CV.pdf',
        notes: app.notes || '',
        rating: app.rating || '3.0/5'
      }))

      setApplicants(transformedData)
      setStats({
        total: transformedData.length,
        pending: transformedData.filter(a => a.status === 'pending').length,
        interview: transformedData.filter(a => a.status === 'interview').length,
        hired: transformedData.filter(a => a.status === 'hired').length,
      })
    } catch (err) {
      setError('Failed to load applicants: ' + err.message)
      console.error('Applicants fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const statuses = ['all', 'pending', 'interview', 'hired', 'rejected']

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          applicant.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ status: 'hired' })
        .eq('id', id)

      if (error) throw error

      await fetchApplicants()
    } catch (err) {
      console.error('Error approving applicant:', err)
      alert('Failed to approve applicant')
    }
  }

  const handleReject = async (id) => {
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error

      await fetchApplicants()
    } catch (err) {
      console.error('Error rejecting applicant:', err)
      alert('Failed to reject applicant')
    }
  }

  // Add applicant
  const handleAddApplicant = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const applicantData = {
        name: formData.name,
        position: formData.position,
        experience: formData.experience,
        status: formData.status,
        cv_file: formData.cv,
        notes: formData.notes,
        rating: formData.rating,
        applied_date: new Date().toISOString().split('T')[0]
      }

      const { error } = await supabase
        .from('applicants')
        .insert([applicantData])

      if (error) throw error

      setShowAddModal(false)
      setFormData({
        name: '',
        position: '',
        experience: '',
        status: 'pending',
        cv: '',
        notes: '',
        rating: '3.0/5'
      })
      await fetchApplicants()
      alert('Applicant added successfully!')
    } catch (err) {
      console.error('Error adding applicant:', err)
      alert('Failed to add applicant: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update applicant
  const handleUpdateApplicant = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('applicants')
        .update({
          name: formData.name,
          position: formData.position,
          experience: formData.experience,
          status: formData.status,
          cv_file: formData.cv,
          notes: formData.notes,
          rating: formData.rating
        })
        .eq('id', editingApplicant.id)

      if (error) throw error

      setShowEditModal(false)
      setEditingApplicant(null)
      await fetchApplicants()
      alert('Applicant updated successfully!')
    } catch (err) {
      console.error('Error updating applicant:', err)
      alert('Failed to update applicant: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete applicant
  const handleDeleteApplicant = async (id) => {
    if (!confirm('Are you sure you want to delete this applicant?')) return

    try {
      const { error } = await supabase
        .from('applicants')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchApplicants()
      alert('Applicant deleted successfully!')
    } catch (err) {
      console.error('Error deleting applicant:', err)
      alert('Failed to delete applicant: ' + err.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openEditModal = (applicant) => {
    setEditingApplicant(applicant)
    setFormData({
      name: applicant.name,
      position: applicant.position,
      experience: applicant.experience,
      status: applicant.status,
      cv: applicant.cv,
      notes: applicant.notes,
      rating: applicant.rating
    })
    setShowEditModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full rounded-xl bg-white/70 border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue
                         text-sm transition-all"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-10 py-2.5 w-full sm:w-48 rounded-xl bg-white/70 border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-sm transition-all appearance-none cursor-pointer"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              position: '',
              experience: '',
              status: 'pending',
              cv: '',
              notes: '',
              rating: '3.0/5'
            })
            setShowAddModal(true)
          }}
          className="btn-gradient-coral px-6 py-2.5 rounded-xl text-white font-semibold shadow-lg whitespace-nowrap flex items-center gap-2 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Plus size={18} />
          )}
          Add Applicant
        </button>
      </div>

      {/* Applicants Table */}
      <div className="glass-card rounded-card overflow-hidden shadow-lg">
        <div className="sticky top-0 bg-white/80 backdrop-blur p-6 border-b border-gray-100">
          <h3 className="font-heading font-bold text-xl text-gray-800 flex items-center gap-2">
            <FileText size={24} />
            Recent Applications ({filteredApplicants.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <SkeletonTable rows={6} />
          ) : filteredApplicants.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={64} className="mx-auto text-gray-300 mb-6" />
              <h3 className="font-heading text-2xl font-bold text-gray-800 mb-3">No Matching Applicants</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <table className="w-full [&>*]:animate-fade-in">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-4 pl-4 text-left text-sm font-semibold text-gray-700">Applicant</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Position</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Experience</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-4 pr-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplicants.map((applicant, index) => (
                    <ApplicantRow key={applicant.id} applicant={applicant} onView={setSelectedApplicant} onEdit={openEditModal} onDelete={handleDeleteApplicant} />
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Add Applicant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Add New Applicant</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddApplicant} className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-gray-800">Applicant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                      required
                    >
                      <option value="">Select Position</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Admin">Admin</option>
                      <option value="Nurse">Nurse</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="e.g., 3 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="interview">Interview Scheduled</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CV File Name</label>
                  <input
                    type="text"
                    name="cv"
                    value={formData.cv}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="e.g., John_Doe_CV.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-vertical"
                    placeholder="Additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="text"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="e.g., 4.5/5"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Add Applicant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Applicant Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Edit Applicant</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateApplicant} className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-gray-800">Applicant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                      required
                    >
                      <option value="">Select Position</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Admin">Admin</option>
                      <option value="Nurse">Nurse</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                      placeholder="e.g., 3 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="interview">Interview Scheduled</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CV File Name</label>
                  <input
                    type="text"
                    name="cv"
                    value={formData.cv}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="e.g., John_Doe_CV.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-vertical"
                    placeholder="Additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="text"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="e.g., 4.5/5"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit size={20} />
                      Update Applicant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal */}
      <ApplicantModal
        applicant={selectedApplicant}
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={openEditModal}
        onDelete={handleDeleteApplicant}
      />
    </div>
  )
}

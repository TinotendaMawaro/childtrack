import { useState, useEffect } from 'react'
import { 
  Search, ChevronDown, UserPlus, X, Heart, AlertTriangle, 
  Users, Phone, Mail, Car, GraduationCap 
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

// Child Profile Card Component (unchanged)
function ChildCard({ child, onClick }) {
  const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'
  const attendance = child.attendance_average || 95
  const status = 'present' 
  const photo = child.photo_url ? child.photo_url : '👶'

  const statusColors = {
    present: 'bg-accent-green/10 text-accent-green',
    absent: 'bg-red-100 text-red-600',
    late: 'bg-accent-yellow/10 text-amber-600',
  }

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-xl p-5 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue to-primary-coral p-[3px] mb-4 group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {photo.startsWith('http') ? (
              <img src={photo} alt="Child" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">{photo}</span>
            )}
          </div>
        </div>
        
        <h3 className="font-bold text-lg text-gray-800 mb-1 truncate max-w-[140px]">{child.full_name}</h3>
        <p className="text-sm text-gray-500 mb-3">{age} years</p>
        
        <div className="w-full mb-3">
          <div className="px-3 py-1 bg-gradient-to-r from-primary-blue to-primary-coral text-white rounded-full">
<span className="text-xs font-semibold">{child.classes ? `${child.classes.curriculum || 'Cambridge'} - ${child.classes.name}` : 'Unassigned'}</span>
          </div>
        </div>
        
        <div className="w-full mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Attendance</span>
            <span className="font-bold text-accent-green">{attendance}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-accent-green to-emerald-400 h-2 rounded-full transition-all" 
                 style={{width: `${attendance}%`}} />
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          ● {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  )
}

// Child Detail Drawer (unchanged)
function ChildDrawer({ child, onClose }) {
  const age = child.dob ? new Date().getFullYear() - new Date(child.dob).getFullYear() : 'N/A'
  
  const health = child.health_status || 'Good'
  const allergies = child.allergies || []
  const parents = child.profiles ? [child.profiles] : []
  const transport = null 

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:backdrop-blur-none" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-11/12 max-w-sm sm:max-w-md glass-card shadow-2xl z-50 transform transition-transform animate-slide-in-right">
        <div className="sticky top-0 p-6 border-b bg-white/80 backdrop-blur-xl z-10 flex items-center justify-between">
          <h2 className="font-bold text-2xl text-gray-800">Child Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[90vh] pb-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex flex-col items-center mb-8 pb-6 border-b">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-coral to-orange-400 p-[4px] mb-4">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                {child.photo_url?.startsWith('http') ? (
                  <img src={child.photo_url} alt={child.full_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-5xl">{child.photo_url || '👶'}</span>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{child.full_name}</h3>
<p className="text-gray-600">{age} years • {child.classes ? `${child.classes.curriculum || 'Cambridge'} - ${child.classes.name}` : 'No class'}</p>
          </div>

          <div className="glass-card-inner p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-accent-pink" />
              <h4 className="font-semibold text-lg">Health Information</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Health Status</span>
                <p className="font-medium text-gray-800">{health}</p>
              </div>
              <div>
                <span className="text-gray-500">Allergies</span>
                <p className="font-medium">{allergies.length ? allergies.join(', ') : 'None'}</p>
              </div>
            </div>
          </div>

          <div className="glass-card-inner p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary-blue" />
              <h4 className="font-semibold text-lg">Parent Contacts</h4>
            </div>
            <div className="space-y-3">
              {parents.map((parent, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/50 border-l-4 border-primary-blue">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold">{parent.full_name}</h5>
                    <span className="text-xs bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full">Parent</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /><span>{parent.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /><span>{parent.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-inner p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Car className="w-6 h-6 text-accent-purple" />
              <h4 className="font-semibold text-lg">Transport</h4>
            </div>
            {transport ? (
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-2">
                  <span>Route</span>
                  <span className="font-medium">{transport.route}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-medium text-accent-green">Active</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No transport assigned</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Main ChildrenManagement Component
export default function ChildrenManagement() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedChild, setSelectedChild] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [newChild, setNewChild] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    dob: '',
    class_id: '',
    parent_id: '',
    photo_url: '',
    performance: 'Good',
    attendance_average: '',
    awards: '',
    location_coordinates: '{}'
  })
const [classes, setClasses] = useState([{id: 'all', name: 'All Classes'}])
  const [curriculum, setCurriculum] = useState('Cambridge')
  const [filteredClasses, setFilteredClasses] = useState([])
  const [parents, setParents] = useState([])
  const [parentSearch, setParentSearch] = useState('')
  const [selectedParent, setSelectedParent] = useState(null)

  useEffect(() => {
    fetchChildren()
    fetchClasses()
  }, [])

  useEffect(() => {
    const subscription = supabase
      .channel('children')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'children' }, 
        (payload) => fetchChildren())
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  const fetchChildren = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('children')
        .select(`
          *,
          profiles!parent_id(id, full_name, phone, email),
          classes!class_id(id, name)
        `)
        .order('full_name', { ascending: true })

      const { data, error } = await query
      if (error) throw error
      setChildren(data || [])
    } catch (error) {
      console.error('Error fetching children:', error)
      setChildren([])
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('id, name, curriculum').order('name')
    setClasses([{id: 'all', name: 'All Classes'}, ...(data || [])])
    setFilteredClasses(data || [])
  }

  useEffect(() => {
    const filtered = classes.filter(c => !c.id || c.curriculum === curriculum)
    setFilteredClasses(filtered)
  }, [curriculum, classes])

  const fetchParents = async (search = '') => {
    let query = supabase
      .from('profiles')
      .select('id, full_name, email, phone')
      .order('full_name')
      .limit(10)
    
    if (search.trim()) {
      query = query.ilike('full_name', `%${search}%`)
    }

    const { data, error } = await query
    if (!error) setParents(data || [])
  }

  const handleParentSearch = (e) => {
    const value = e.target.value
    setParentSearch(value)
    if (value.length > 1) {
      fetchParents(value)
    } else {
      setParents([])
    }
  }

  const selectParent = (parent) => {
    setSelectedParent(parent)
    setParentSearch(parent.full_name)
    setParents([])
    setNewChild(prev => ({...prev, parent_id: parent.id}))
  }

  const handleAddChild = async (e) => {
    e.preventDefault()
    
    const fullName = [
      newChild.first_name.trim(),
      newChild.middle_name.trim(),
      newChild.last_name.trim()
    ].filter(Boolean).join(' ')
    
    if (!fullName) {
      alert('First and last name required')
      return
    }

    const childData = {
      first_name: newChild.first_name.trim() || null,
      last_name: newChild.last_name.trim() || null,
      middle_name: newChild.middle_name.trim() || null,
      full_name: fullName,
      dob: newChild.dob || null,
      class_id: newChild.class_id || null,
      parent_id: newChild.parent_id || null,
      photo_url: newChild.photo_url || null,
      performance: newChild.performance,
      attendance_average: parseFloat(newChild.attendance_average) || 0,
      awards: newChild.awards ? newChild.awards.split(',').map(a => a.trim()).filter(Boolean) : [],
      location_coordinates: newChild.location_coordinates ? JSON.parse(newChild.location_coordinates) : {}
    }

    setAddLoading(true)
    try {
      const { error } = await supabase
        .from('children')
        .insert([childData])
        .select()
      
      if (error) throw error
      
      setNewChild({
        first_name: '',
        last_name: '',
        middle_name: '',
        dob: '',
        class_id: '',
        parent_id: '',
        photo_url: '',
        performance: 'Good',
        attendance_average: '',
        awards: '',
        location_coordinates: '{}'
      })
      setSelectedParent(null)
      setParentSearch('')
      setShowAddModal(false)
      await fetchChildren()
      alert('Child added successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Error: ' + error.message)
    } finally {
      setAddLoading(false)
    }
  }

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = classFilter === 'all' || child.class_id === classFilter
    return matchesSearch && matchesClass
  })

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p>Loading children...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 sm:w-80 glass-input backdrop-blur-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search children by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 rounded-2xl"
            />
          </div>
          <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full sm:w-44 px-4 py-3 rounded-2xl glass-input backdrop-blur-xl border-none outline-none appearance-none cursor-pointer bg-transparent"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-gradient-coral px-8 py-3 rounded-2xl text-white font-semibold shadow-2xl hover:shadow-glow-coral transition-all flex items-center gap-2 whitespace-nowrap ml-auto"
        >
          <UserPlus size={20} />
          Add Child
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-6 border-b bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Add New Child</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={handleAddChild} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newChild.first_name}
                    onChange={(e) => setNewChild({...newChild, first_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={newChild.middle_name}
                    onChange={(e) => setNewChild({...newChild, middle_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Middle (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newChild.last_name}
                    onChange={(e) => setNewChild({...newChild, last_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={newChild.dob}
                    onChange={(e) => setNewChild({...newChild, dob: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                  >
                    <option value="Cambridge">Cambridge</option>
                    <option value="Zimsec">Zimsec</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={newChild.class_id}
                    onChange={(e) => setNewChild({...newChild, class_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input appearance-none"
                  >
                    <option value="">Select Class ({curriculum})</option>
                    {filteredClasses.filter(c => c.curriculum === curriculum).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent (Search by name)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={parentSearch}
                    onChange={handleParentSearch}
                    className="w-full px-4 py-3 pr-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder="Type parent name..."
                  />
                  {parents.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-auto border border-gray-200 rounded-xl bg-white shadow-lg z-10">
                      {parents.map((parent) => (
                        <div
                          key={parent.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
                          onClick={() => selectParent(parent)}
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-primary-coral rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {parent.full_name.split(' ').slice(0,2).map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{parent.full_name}</p>
                            <p className="text-sm text-gray-500 truncate">{parent.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedParent && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="font-semibold text-green-800">{selectedParent.full_name}</p>
                      <p className="text-sm text-green-600">{selectedParent.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
                  <select
                    value={newChild.performance}
                    onChange={(e) => setNewChild({...newChild, performance: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Average (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newChild.attendance_average}
                    onChange={(e) => setNewChild({...newChild, attendance_average: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Coordinates</label>
                  <input
                    type="text"
                    value={newChild.location_coordinates}
                    onChange={(e) => setNewChild({...newChild, location_coordinates: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input"
                    placeholder='{"lat": 0, "lng": 0}'
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Awards (comma separated)</label>
                <textarea
                  rows="3"
                  value={newChild.awards}
                  onChange={(e) => setNewChild({...newChild, awards: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-blue/30 glass-input resize-vertical"
                  placeholder="Best Student 2024, Art Award, Attendance Award"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 btn-gradient-coral px-6 py-3 rounded-2xl text-white font-semibold shadow-lg hover:shadow-glow-coral disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Add Child
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredChildren.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No children found</h3>
          <p className="text-gray-500">Try adjusting your search or filters, or add your first child</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredChildren.map((child, index) => (
            <ChildCard 
              key={child.id} 
              child={child}
              onClick={() => setSelectedChild(child)}
            />
          ))}
        </div>
      )}

      {selectedChild && (
        <ChildDrawer child={selectedChild} onClose={() => setSelectedChild(null)} />
      )}
    </div>
  )
}


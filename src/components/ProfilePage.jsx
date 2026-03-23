import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
  User, 
  Image, 
  UserPlus, 
  Phone, 
  Mail, 
  Save, 
  X, 
  Edit3, 
  Camera,
  AlertCircle 
} from 'lucide-react'

export default function ProfilePage() {
  const { profile, uploadProfilePic, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: ''
  })
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (profile) {
    setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || ''
      })
    }
  }, [profile])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (formData.phone && !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      await uploadProfilePic(selectedFile)
      setFile(URL.createObjectURL(selectedFile))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Image upload failed: ' + error.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const updateData = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        bio: formData.bio.trim() || null
      }
      
      await updateProfile(updateData)
      alert('Profile saved successfully!')
      setEditing(false)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Save failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const AvatarUpload = () => (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
          {profile?.avatar_url ? (
            <img 
              src={file || profile.avatar_url} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-gray-600 uppercase tracking-wider">
              {formData.full_name.split(' ').map(n => n[0]).join('') || 'AD'}
            </span>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer p-3 bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Camera size={20} className="text-gray-700" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        {uploading && (
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent-green rounded-full border-4 border-white flex items-center justify-center animate-spin">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-3">Click avatar to change photo</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold text-gray-800 mb-1">My Profile</h2>
          <p className="text-gray-500">Update your personal information</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-coral text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-green to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setErrors({})
              }}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all border border-gray-200"
            >
              <X size={18} className="inline mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Main Form */}
      <div className="glass-card rounded-3xl p-8 space-y-8">
        {/* Avatar Section */}
        <div className="text-center border-b border-gray-100 pb-8">
          <AvatarUpload />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User size={18} />
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              disabled={!editing}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue/30 ${
                editing 
                  ? 'border-gray-200 bg-white/50 focus:border-primary-blue' 
                  : 'border-transparent bg-white/30 cursor-not-allowed'
              } ${errors.full_name ? 'border-red-300 focus:border-red-400 focus:ring-red/30' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.full_name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white/30 cursor-not-allowed"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={18} />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!editing}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue/30 ${
                  editing 
                    ? 'border-gray-200 bg-white/50 focus:border-primary-blue' 
                    : 'border-transparent bg-white/30 cursor-not-allowed'
                } ${errors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red/30' : ''}`}
                placeholder="e.g., +1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <UserPlus size={18} />
              Bio / About
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              disabled={!editing}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue/30 resize-vertical ${
                editing 
                  ? 'border-gray-200 bg-white/50 focus:border-primary-blue' 
                  : 'border-transparent bg-white/30 cursor-not-allowed'
              }`}
              placeholder="Tell us a bit about yourself..."
            />
          </div>
        </div>

        {/* Stats Preview */}
        {!editing && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-100">
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="text-2xl font-bold text-gray-800">{profile?.role || 'ADMIN'}</div>
              <div className="text-sm text-gray-500">Role</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="text-2xl font-bold text-primary-blue">✓ Verified</div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="text-2xl font-bold text-accent-green">Active</div>
              <div className="text-sm text-gray-500">Account</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="w-20 h-1 bg-gradient-to-r from-primary-blue to-primary-coral rounded-full mx-auto mb-2" />
              <div className="text-xs text-gray-500">Profile Complete</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

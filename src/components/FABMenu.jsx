import { useState, useRef, useEffect } from 'react'
import { Plus, X, CheckCircle, Camera, BookOpen, MessageSquare } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

// FAB Menu Component with Radial Expansion
// Accepts callback props to integrate with parent component state
export default function FABMenu({
  onMarkAttendance,
  onUploadPhoto,
  onAddDiary,
  onMessageParent
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeAction, setActiveAction] = useState(null)
  const { session } = useAuth()
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
        setActiveAction(null)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Action handlers with real Supabase integration

  const handleMarkAttendance = async () => {
    setActiveAction('attendance')
    setIsOpen(false)
    if (onMarkAttendance) {
      onMarkAttendance()
    } else {
      // Fallback: fetch staff class and navigate
      const { data: staff } = await supabase
        .from('staff')
        .select('assigned_class')
        .eq('id', session?.user?.id)
        .single()
      if (staff?.assigned_class) {
        window.dispatchEvent(new CustomEvent('navigateToAttendance', { detail: { classId: staff.assigned_class } }))
      } else {
        alert('No classes assigned to you yet.')
      }
    }
    setActiveAction(null)
  }

  const handleUploadPhoto = async () => {
    setActiveAction('photos')
    setIsOpen(false)
    if (onUploadPhoto) {
      onUploadPhoto()
    } else {
      // Direct photo upload to diary-photos bucket
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = true
      input.onchange = async (e) => {
        const files = e.target.files
        if (!files?.length) return
        const uploadedUrls = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${i}.${fileExt}`
          const { error } = await supabase.storage.from('diary-photos').upload(fileName, file)
          if (error) {
            console.error('Upload error:', error)
            continue
          }
          const { data: { publicUrl } } = supabase.storage.from('diary-photos').getPublicUrl(fileName)
          uploadedUrls.push(publicUrl)
        }
        alert(`Uploaded ${uploadedUrls.length} photo(s). Use them in your diary entry.`)
      }
      input.click()
    }
    setActiveAction(null)
  }

  const handleAddDiary = async () => {
    setActiveAction('diary')
    setIsOpen(false)
    if (onAddDiary) {
      onAddDiary()
    } else {
      window.dispatchEvent(new CustomEvent('openDiaryModal'))
    }
    setActiveAction(null)
  }

  const handleMessageParent = async () => {
    setActiveAction('message')
    setIsOpen(false)
    if (onMessageParent) {
      onMessageParent()
    } else {
      // Fetch children in staff's classes and open message parent selector
      const { data: staff } = await supabase
        .from('staff')
        .select('assigned_class')
        .eq('id', session?.user?.id)
        .single()

      if (!staff?.assigned_class) {
        alert('No classes assigned to you yet.')
        setActiveAction(null)
        return
      }

      const { data: children } = await supabase
        .from('children')
        .select('id, full_name, profiles!parent_id(id, full_name, email, phone)')
        .eq('class_id', staff.assigned_class)
        .eq('status', 'ACTIVE')
        .limit(1)

      if (children?.length > 0 && children[0].profiles) {
        const parent = children[0].profiles
        window.dispatchEvent(new CustomEvent('openConversation', {
          detail: {
            parentId: parent.id,
            parentName: parent.full_name,
            childId: children[0].id,
            childName: children[0].full_name
          }
        }))
      } else {
        alert('No children/parents found in your class.')
      }
    }
    setActiveAction(null)
  }

  const actions = [
    {
      id: 'attendance',
      label: 'Mark Attendance',
      icon: CheckCircle,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      onClick: handleMarkAttendance,
      angle: -90, // top
      distance: 100,
    },
    {
      id: 'photos',
      label: 'Upload Photo',
      icon: Camera,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      onClick: handleUploadPhoto,
      angle: -45, // top-right
      distance: 100,
    },
    {
      id: 'diary',
      label: 'Add Diary',
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      onClick: handleAddDiary,
      angle: -135, // top-left
      distance: 100,
    },
    {
      id: 'message',
      label: 'Message Parent',
      icon: MessageSquare,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-600',
      onClick: handleMessageParent,
      angle: 0, // right
      distance: 100,
    },
  ]

return (
    <div className="fixed bottom-8 right-8 z-50" ref={menuRef}>
      {/* Action Buttons - Radial Layout */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Radial Buttons */}
          {actions.map((action, index) => {
            // Convert angle (degrees) to radians. 0° = right, -90° = up, 180° = left
            const rad = (action.angle * Math.PI) / 180
            const x = Math.cos(rad) * action.distance
            const y = Math.sin(rad) * action.distance

            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="fixed flex flex-col items-center gap-1 group"
                style={{
                  bottom: '64px',
                  right: '64px',
                  transform: `translate(${x}px, ${y}px)`,
                  animation: `fab-expand 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 50}ms forwards`,
                  opacity: 0,
                }}
              >
                {/* Label */}
                <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-lg mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>

                {/* Button */}
                <div
                  className={`w-14 h-14 rounded-full ${action.bgColor} border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer ${activeAction === action.id ? 'scale-90' : ''}`}
                >
                  <action.icon className={`w-6 h-6 ${action.textColor}`} />
                </div>
              </button>
            )
          })}
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-mint to-emerald-500 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'animate-pulse-glow' : ''}`}
        aria-label={isOpen ? 'Close menu' : 'Open quick actions'}
      >
        <Plus
          size={28}
          className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        />

        {/* Ripple effect on open */}
        {isOpen && (
          <>
            <div className="absolute inset-0 rounded-full bg-mint/30 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-mint/40 animate-ping" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </button>
    </div>
  )
}

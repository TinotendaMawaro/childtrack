import { Phone, Download, Smartphone, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function MobileOnlyNotice() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleAppStore = () => {
    // Replace with actual app store links
    window.open('https://apps.apple.com/app/childtrack-parent/id123456789', '_blank')
  }

  const handlePlayStore = () => {
    // Replace with actual Play Store link
    window.open('https://play.google.com/store/apps/details?id=com.childtrack.parent', '_blank')
  }

  const handleBackToLogin = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback navigation
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50 pt-16 pb-20">
      <div className="max-w-lg xl:max-w-xl w-full glass-card rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in mx-4 sm:mx-6 lg:mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-pink to-rose-400 rounded-2xl flex items-center justify-center shadow-xl">
          <Smartphone className="w-12 h-12 text-white" />
        </div>
        
        <AlertTriangle className="w-16 h-16 text-accent-yellow mx-auto mb-4" />
        
        <h1 className="text-2xl font-heading font-bold text-gray-800 mb-3">Mobile App Required</h1>
        <p className="text-lg text-gray-600 mb-2">This web portal is for ADMIN & STAFF only.</p>
        <p className="text-gray-500 mb-8">
          DRIVER and PARENT roles must use the dedicated mobile applications.
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-primary-blue" />
              <span className="font-semibold text-gray-800">Download ChildTrack Mobile App</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAppStore}
                className="group bg-black/90 hover:bg-black text-white px-4 py-3 rounded-xl font-medium text-sm transition-all hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                App Store
              </button>
              <button
                onClick={handlePlayStore}
                className="group bg-[#34A853]/90 hover:bg-[#34A853] text-white px-4 py-3 rounded-xl font-medium text-sm transition-all hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Play Store
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-200/50">
          <button
            onClick={handleBackToLogin}
            className="flex-1 bg-primary-blue/90 hover:bg-primary-blue text-white py-3 px-6 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
          >
            Back to Login
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Need web access? Contact administrator for role upgrade.
        </p>
      </div>
    </div>
  )
}


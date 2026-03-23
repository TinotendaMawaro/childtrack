import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import LoadingSpinner from './ui/LoadingSpinner'
import FullScreenLoader from './ui/FullScreenLoader'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate app initialization (2-3 seconds)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          // Navigate to login after splash
          setTimeout(() => navigate('/login'), 300)
          return 100
        }
        return prev + 8 // ~12 steps for 2.4s
      })
    }, 200)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400">
      {/* Logo Container */}
      <div className="w-full max-w-md mx-auto text-center mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-300/40 to-pink-300/40 
                        rounded-3xl flex items-center justify-center backdrop-blur-sm border-4 border-white/40 shadow-2xl">
          <div className="w-28 h-28 bg-gradient-to-br from-primary-blue to-primary-coral rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-4xl animate-bounce">🌸</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          ChildTrack
        </h1>
        <p className="text-xl text-white/90 font-medium tracking-wide drop-shadow-md">
          Nursery Management
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto glass-card rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <LoadingSpinner className="w-8 h-8 text-primary-blue" />
          <span className="text-lg font-semibold text-gray-800">Initializing...</span>
        </div>
        
        <div className="w-full bg-white/30 rounded-xl h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-blue to-primary-coral rounded-xl shadow-lg transition-all duration-500 ease-out shadow-[0_0_20px_rgba(74,144,226,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-3 text-center font-medium">
          {progress === 100 ? 'Ready!' : `${progress}%`}
        </p>
      </div>

      {/* Subtle status indicators */}
      <div className="flex gap-6 mt-12 text-xs text-white/70">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
          <span>Supabase Connected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
          <span>Real-time Ready</span>
        </div>
      </div>
    </div>
  )
}


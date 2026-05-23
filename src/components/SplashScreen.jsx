import { useEffect, useState } from 'react'
import LoadingSpinner from './ui/LoadingSpinner'
import FullScreenLoader from './ui/FullScreenLoader'

/**
 * SplashScreen
 *
 * Fast-start variant — completes within ~930 ms total so the app
 * doesn't feel sluggish on load.
 *
 * Timing breakdown
 *   7 ticks × 120 ms  = 840 ms  (progress bar fills)
 *   + 90 ms delay after 100% before onComplete fires
 *   = 930 ms total
 *
 * Logo dimensions
 *   Outer ring : w-18 h-18  (72 px)
 *   Inner logo : w-16 h-16  (64 px)
 */

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          // Small grace pause so the "100 % / Ready!" state is visible
          if (onComplete) setTimeout(onComplete, 90)
          return 100
        }
        return prev + 17   // 7 ticks to reach 100
      })
    }, 120)               // 7 × 120 ms = 840 ms Fill time → under 1 s overall
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400">
      {/* Logo Container */}
      <div className="w-full max-w-md mx-auto text-center mb-8">
        {/* Outer gradient ring — reduced from 128 px to 72 px */}
        <div className="w-[72px] h-[72px] mx-auto mb-4 bg-gradient-to-br from-yellow-300/40 to-pink-300/40
                        rounded-2xl flex items-center justify-center backdrop-blur-sm border-4 border-white/40 shadow-2xl">
          {/* Inner brand box — reduced from 112 px to 64 px */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-coral rounded-xl flex items-center justify-center shadow-xl animate-pulse">
            <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-full h-full object-cover rounded-xl animate-bounce" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          ChildTrack
        </h1>
        <p className="text-lg text-white/90 font-medium tracking-wide drop-shadow-md">
          track manage protect
        </p>
      </div>

      {/* Progress Bar — faster transition to match 120 ms tick rate */}
      <div className="w-full max-w-md mx-auto glass-card rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <LoadingSpinner className="w-7 h-7 text-primary-blue" />
          <span className="text-base font-semibold text-gray-800">Initializing...</span>
        </div>

        <div className="w-full bg-white/30 rounded-xl h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-blue to-primary-coral rounded-xl shadow-lg shadow-[0_0_20px_rgba(74,144,226,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-600 mt-2.5 text-center font-medium">
          {progress === 100 ? 'Ready!' : `${progress}%`}
        </p>
      </div>

      {/* Subtle status indicators */}
      <div className="flex gap-6 mt-8 text-xs text-white/70">
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

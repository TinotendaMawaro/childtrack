import { Loader2 } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

export default function FullScreenLoader({ message = 'Loading...', title = 'Loading', className = '' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400/90 via-orange-300/90 to-rose-400/90 backdrop-blur-xl">
      <div className={`glass-card rounded-3xl p-12 text-center shadow-2xl animate-fade-scale max-w-md w-full mx-4 ${className}`}>
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-blue to-primary-coral rounded-3xl flex items-center justify-center shadow-xl">
          <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-20 h-20 object-cover rounded-2xl" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
          <LoadingSpinner className="w-4 h-4" />
          <span>Please wait while we fetch your data</span>
        </div>
      </div>
    </div>
  )
}


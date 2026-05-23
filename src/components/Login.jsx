import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import TermsModal from './ui/TermsModal'
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Check,
  Users,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react'

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [showTermsModal, setShowTermsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const { signIn } = useAuth()

  const showToast = (message, type = 'error') => {
    setToast({ id: Date.now(), message, type, visible: true })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate Terms & Conditions
    if (!acceptTerms) {
      showToast('You must accept the Terms & Conditions to continue')
      setLoading(false)
      return
    }

    try {
      console.log('[Login] Attempting sign in for:', email)
      await signIn(email, password, rememberMe)
      console.log('[Login] Sign in successful, calling onSuccess')
      onSuccess?.()
      console.log('[Login] onSuccess completed')
    } catch (err) {
      console.error('[Login] Sign in error:', err.message)
      showToast(err.message || 'Login failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400 pt-16 pb-20">

      {/* Toast Notification */}
      {toast && toast.visible && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/85 backdrop-blur-sm border border-red-200/50 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in">
          <AlertCircle size={20} />
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:text-red-100 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-blue to-primary-coral flex items-center justify-center shadow-xl">
              <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Authenticating...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg xl:max-w-xl glass-card rounded-3xl p-8 shadow-2xl animate-fade-scale mx-4 sm:mx-6 lg:mx-auto">
        
        {/* Top Illustration */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-yellow-300/30 to-pink-300/30
                          rounded-3xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
            <img src="/src/assets/images/logo.png" alt="ChildTrack Logo" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">ChildTrack</h1>
          <p className="text-gray-600 font-medium">track manage protect</p>
        </div>

        {error && (
          <div className="glass-card-inner p-4 mb-6 text-red-600 text-sm rounded-2xl 
                          border border-red-200/50 bg-red-50/80 backdrop-blur-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 backdrop-blur-sm 
                          border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none 
                          focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue 
                          transition-all shadow-sm hover:shadow-md"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/60 backdrop-blur-sm 
                          border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none 
                          focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue 
                          transition-all shadow-sm hover:shadow-md"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                rememberMe 
                  ? 'bg-primary-blue border-primary-blue shadow-sm' 
                  : 'border-gray-300 hover:border-gray-400'
              }`} onClick={() => setRememberMe(!rememberMe)}>
                {rememberMe && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700 select-none">Remember me</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                acceptTerms 
                  ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                  : 'border-gray-300 hover:border-gray-400'
              }`} onClick={() => setAcceptTerms(!acceptTerms)}>
                {acceptTerms && <ShieldCheck size={14} className="text-white" />}
              </div>
              <span 
                className="text-sm text-primary-blue font-medium cursor-pointer underline hover:no-underline hover:text-primary-blue/80 transition-colors"
                onClick={() => setShowTermsModal(true)}
              >
                I agree to Terms & Conditions *
              </span>
            </label>
          </div>

          {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 text-lg group ${
                loading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-primary-coral to-primary-blue text-white hover:shadow-[0_0_25px_rgba(74,144,226,0.4)] hover:-translate-y-1 active:scale-[0.98] shadow-xl group-hover:animate-pulse-glow-mint'
              }`}>
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Users size={22} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200/50 space-y-3 text-center">
          <a href="#" className="block text-sm text-primary-blue hover:text-primary-blue/80 font-medium transition-colors">
            Forgot Password?
          </a>
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
          </div>
          <p className="text-xs text-gray-400">Secure login powered by Supabase</p>
        </div>

        <TermsModal 
          isOpen={showTermsModal}
          onAccept={() => {
            setAcceptTerms(true)
            setShowTermsModal(false)
          }}
          onClose={() => setShowTermsModal(false)}
        />
      </div>
    </div>
  )
}

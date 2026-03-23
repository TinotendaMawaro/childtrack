import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, ShieldCheck } from 'lucide-react'
import TermsModal from './ui/TermsModal' // Reuse existing modal

export default function TermsScreen() {
  const [accepted, setAccepted] = useState(false)
  const navigate = useNavigate()

  const handleAccept = () => {
    localStorage.setItem('terms-accepted', 'true')
    navigate('/login')
  }

  const handleDecline = () => {
    // Stay or show warning
    alert('You must accept terms to continue')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-orange-300 to-rose-400">
      <div className="w-full max-w-2xl mx-auto">
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600 font-medium">Please review and accept before continuing</p>
          </div>

          <TermsModal 
            isOpen={true}
            onAccept={() => setAccepted(true)}
            onClose={() => {}} 
            className="max-h-[60vh] overflow-y-auto"
          />

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleDecline}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-4 px-6 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <X size={20} />
              Decline
            </button>
            <button
              disabled={!accepted}
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              <Check size={20} />
              {accepted ? 'Accepted - Continue' : 'Accept Terms'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


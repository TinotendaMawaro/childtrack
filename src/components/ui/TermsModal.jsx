import { useState, useEffect } from 'react'
import { X, Check, ChevronLeft, ShieldCheck } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

// Sample Terms content (replace with real content)
const TERMS_CONTENT = `
# ChildTrack Terms & Conditions

**Effective Date: January 1, 2025**

Welcome to ChildTrack! These Terms & Conditions ("Terms") govern your use of our nursery management platform.

## 1. Acceptance of Terms
By accessing or using ChildTrack, you agree to be bound by these Terms. If you do not agree, please do not use our services.

## 2. User Responsibilities
2.1 You agree to:
- Provide accurate information about children and staff
- Maintain confidentiality of parent information
- Use the platform only for legitimate nursery operations
- Report any technical issues promptly

2.2 Prohibited activities:
- Sharing login credentials
- Unauthorized data access
- Commercial use beyond licensed nursery operations

## 3. Data Privacy & Security
3.1 We collect:
- Child attendance records
- Staff schedules and qualifications
- Parent contact information (with consent)

3.2 We use industry-standard encryption and comply with GDPR/child protection regulations.

## 4. Intellectual Property
All ChildTrack software, logos, and materials are proprietary. You receive a limited license for nursery management use only.

## 5. Liability Limitation
ChildTrack is provided "as is". We are not liable for:
- Data entry errors by users
- Third-party service interruptions
- Indirect or consequential damages

## 6. Termination
We may suspend access if:
- Terms violations occur
- Unpaid fees accumulate
- Security risks detected

## 7. Changes to Terms
We may update these Terms. Continued use constitutes acceptance of changes.

## 8. Governing Law
These Terms governed by [Jurisdiction] laws.

**Last Updated: January 1, 2025**

*Contact support@childtrack.com for questions.*
`

export default function TermsModal({ isOpen, onAccept, onClose }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Scroll to top when modal opens
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleAccept = async () => {
    setLoading(true)
    try {
      // Save acceptance to localStorage (or Supabase profile)
      localStorage.setItem('childtrack_terms_accepted', new Date().toISOString())
      onAccept()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal - Desktop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl max-h-[90vh] glass-card rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-scale">
          
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur p-6 border-b border-gray-200 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div>
                <h2 className="font-heading font-bold text-xl text-gray-800">Terms & Conditions</h2>
                <p className="text-sm text-gray-600">Please read and accept</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 prose prose-sm max-w-none">
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              {TERMS_CONTENT}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Read Later
            </button>
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {loading ? 'Saving...' : 'I Accept'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col animate-slide-up-bottom">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white/100 backdrop-blur flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div>
                <h2 className="font-bold text-lg text-gray-800">Terms & Conditions</h2>
                <p className="text-sm text-gray-600">Please read carefully</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-20 prose prose-sm">
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
              {TERMS_CONTENT}
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 bg-white border-t border-gray-200 space-y-3 pt-4">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : <Check className="w-5 h-5" />}
              {loading ? 'Saving...' : 'Accept Terms & Conditions'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}


import { createPortal } from 'react-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ArrowRight, ChevronLeft, ChevronRight, Play, SkipForward } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const ADMIN_TOUR_STEPS = [
  {
    selector: '[data-tour="sidebar"]',
    title: 'Navigation Sidebar',
    content: 'Use this sidebar to quickly switch between different sections of your admin dashboard. Each icon represents a different module.',
    position: 'right'
  },
  {
    selector: '[data-tour="stats"]',
    title: 'Dashboard Stats',
    content: 'Your key metrics at a glance. Track total children, staff members, daily attendance, and pending payments. Numbers animate to show real-time data.',
    position: 'top'
  },
  {
    selector: '[data-tour="transport"]',
    title: 'Transport Tracking',
    content: 'Live transport monitoring. Track bus locations, children onboard, ETAs, and route progress in real-time. Tap any route for detailed status.',
    position: 'left'
  },
  {
    selector: '[data-tour="recruitment"]',
    title: 'Recruitment Pipeline',
    content: 'Manage job applications. Review candidates by status (pending, interview, hired), view CVs, and take action directly from the dashboard.',
    position: 'top'
  }
]

export default function GuidedTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const containerRef = useRef(null)
  const targetRef = useRef(null)

  useEffect(() => {
    // Check if first admin login
    const hasCompletedTour = localStorage.getItem('admin-tour-completed')
    const isAdmin = localStorage.getItem('user-role') === 'ADMIN'
    
    if (isAdmin && !hasCompletedTour) {
      setTimeout(() => {
        setIsOpen(true)
        setIsReady(true)
      }, 1000)
    }
  }, [])

  const handleNext = useCallback(() => {
    if (currentStep < ADMIN_TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }, [currentStep])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const completeTour = useCallback(() => {
    localStorage.setItem('admin-tour-completed', 'true')
    setIsOpen(false)
  }, [])

  const skipTour = useCallback(() => {
    completeTour()
  }, [completeTour])

  const step = ADMIN_TOUR_STEPS[currentStep]
  const targetElement = document?.querySelector(step.selector)

  useEffect(() => {
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      targetRef.current = targetElement
    }
  }, [currentStep, step.selector, targetElement])

  useEffect(() => {
    const handleKeydown = (e) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          skipTour()
          break
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
          handlePrev()
          break
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, currentStep, handleNext, handlePrev, skipTour])

  if (!isReady || !isOpen) return null

  const getTooltipPosition = () => {
    if (!targetRef.current) return {}

    const rect = targetRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let position = {}
    
    switch (step.position) {
      case 'top':
        position.top = `${rect.top - 120}px`
        position.left = `${rect.left + rect.width / 2}px`
        position.transform = 'translateX(-50%)'
        break
      case 'right':
        position.top = `${rect.top + rect.height / 2}px`
        position.left = `${rect.right + 20}px`
        position.transform = 'translateY(-50%)'
        break
      case 'bottom':
        position.top = `${rect.bottom + 20}px`
        position.left = `${rect.left + rect.width / 2}px`
        position.transform = 'translateX(-50%)'
        break
      case 'left':
        position.top = `${rect.top + rect.height / 2}px`
        position.left = `${rect.left - 20}px`
        position.transform = 'translateY(-50%)'
        break
    }

    return position
  }

  const tooltipStyle = getTooltipPosition()

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] pointer-events-auto" />
      
      {/* Spotlight */}
      {targetRef.current && (
        <div 
          className="fixed inset-0 z-[10000]"
          style={{
            mask: `radial-gradient(circle 120px at ${targetRef.current.getBoundingClientRect().left + targetRef.current.getBoundingClientRect().width / 2}px ${targetRef.current.getBoundingClientRect().top + targetRef.current.getBoundingClientRect().height / 2}px, transparent 0%, black 100%)`,
            WebkitMask: `radial-gradient(circle 120px at ${targetRef.current.getBoundingClientRect().left + targetRef.current.getBoundingClientRect().width / 2}px ${targetRef.current.getBoundingClientRect().top + targetRef.current.getBoundingClientRect().height / 2}px, transparent 0%, black 100%)`
          }}
        />
      )}

      {/* Tooltip Bubble */}
      <div 
        className="glass-card rounded-2xl shadow-2xl border border-white/20 p-6 max-w-sm w-80 z-[10001] animate-fade-scale pointer-events-auto"
        style={{
          position: 'fixed',
          ...tooltipStyle,
          maxHeight: '70vh',
          overflow: 'hidden'
        }}
      >
        {/* Step Number */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-primary-blue to-primary-coral flex items-center justify-center">
            <span className="text-white font-bold text-sm">{currentStep + 1}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-lg text-gray-800">{step.title}</h3>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-600 mb-6 leading-relaxed">{step.content}</p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-1.5 bg-gradient-to-r from-primary-blue to-primary-coral rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ADMIN_TOUR_STEPS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Step {currentStep + 1} of {ADMIN_TOUR_STEPS.length}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={skipTour}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all font-medium"
          >
            <SkipForward size={14} />
            Skip Tour
          </button>
          
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-sm text-primary-blue font-medium px-4 py-2 rounded-xl hover:bg-primary-blue/5 transition-all flex-1 justify-center"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl shadow-lg transition-all text-white ${
              currentStep === ADMIN_TOUR_STEPS.length - 1 
                ? 'btn-gradient-coral w-full' 
                : 'bg-gradient-to-r from-primary-blue to-primary-coral hover:shadow-primary-blue/30 hover:-translate-y-0.5 px-6'
            }`}
          >
            {currentStep === ADMIN_TOUR_STEPS.length - 1 ? (
              <>
                <CheckCircle size={18} />
                Finish
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Keyboard Instructions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded font-mono">← →</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded font-mono">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}


import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

/**
 * ConfirmationModal Component
 * Custom modal for user confirmations with consistent UI
 */
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'info', 'success'
  isLoading = false,
  requireTextConfirm = false, // For dangerous actions, require typing to confirm
  confirmPhrase = null, // e.g., "DELETE" - user must type this to confirm
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200',
          headerBg: 'bg-red-50'
        }
      case 'warning':
        return {
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          buttonBg: 'bg-amber-600 hover:bg-amber-700',
          borderColor: 'border-amber-200',
          headerBg: 'bg-amber-50'
        }
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonBg: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200',
          headerBg: 'bg-blue-50'
        }
      case 'success':
        return {
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          borderColor: 'border-green-200',
          headerBg: 'bg-green-50'
        }
      default:
        return {
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          buttonBg: 'bg-gray-600 hover:bg-gray-700',
          borderColor: 'border-gray-200',
          headerBg: 'bg-gray-50'
        }
    }
  }

  const styles = getVariantStyles()

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto animate-slide-up z-10 overflow-hidden">
        {/* Header */}
        <div className={`p-6 border-b ${styles.headerBg}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
              <AlertTriangle className={`w-7 h-7 ${styles.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 font-heading truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Body - Optional confirm phrase input */}
        {requireTextConfirm && confirmPhrase && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600 font-bold">{confirmPhrase}</span> to confirm:
            </label>
            <input
              type="text"
              id="confirm-phrase"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent glass-input"
              placeholder={`Type "${confirmPhrase}" to confirm`}
              autoFocus
            />
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              if (requireTextConfirm && confirmPhrase) {
                const input = document.getElementById('confirm-phrase')
                if (input?.value !== confirmPhrase) {
                  input?.focus()
                  return
                }
              }
              onConfirm()
            }}
            disabled={isLoading}
            className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${styles.buttonBg}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>

      {/* Close on Escape key */}
      <div
        className="absolute inset-0"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        tabIndex={-1}
      />
    </div>,
    document.body
  )
}

/**
 * Hook for managing confirmation modals
 */
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)

  const confirm = (options) => {
    return new Promise((resolve) => {
      setConfig(options)
      setPendingAction(() => resolve)
      setIsOpen(true)
    })
  }

  const handleConfirm = () => {
    setIsOpen(false)
    if (pendingAction) {
      pendingAction(true)
      setPendingAction(null)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (pendingAction) {
      pendingAction(false)
      setPendingAction(null)
    }
  }

  return {
    confirm,
    ConfirmModal: config ? (
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        variant={config.variant}
        isLoading={config.isLoading}
        requireTextConfirm={config.requireTextConfirm}
        confirmPhrase={config.confirmPhrase}
      />
    ) : null
  }
}
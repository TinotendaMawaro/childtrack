import { usePermission } from '../hooks/usePermissions'
import { Loader2, AlertTriangle } from 'lucide-react'

/**
 * PermissionGuard Component
 * Conditionally renders children based on user permissions
 */
export default function PermissionGuard({
  resource,
  action,
  scope = 'own',
  children,
  fallback = null,
  showLoading = false,
  loadingComponent = null,
  requireAll = false, // If true, requires ALL permissions in array
  permissions = null // Alternative: pass array of permission objects
}) {
  // Handle single permission
  if (!permissions) {
    const { hasAccess, checking } = usePermission(resource, action, scope)

    if (checking) {
      if (showLoading) {
        return loadingComponent || (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
            <span className="ml-2 text-sm text-gray-600">Checking permissions...</span>
          </div>
        )
      }
      return null
    }

    return hasAccess ? children : (fallback || null)
  }

  // Handle multiple permissions
  const permissionChecks = permissions.map(perm => {
    const { hasAccess, checking } = usePermission(
      perm.resource,
      perm.action,
      perm.scope || 'own'
    )
    return { hasAccess, checking }
  })

  const allChecking = permissionChecks.some(p => p.checking)
  const hasAllAccess = requireAll
    ? permissionChecks.every(p => p.hasAccess)
    : permissionChecks.some(p => p.hasAccess)

  if (allChecking) {
    if (showLoading) {
      return loadingComponent || (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
          <span className="ml-2 text-sm text-gray-600">Checking permissions...</span>
        </div>
      )
    }
    return null
  }

  return hasAllAccess ? children : (fallback || null)
}

/**
 * Permission Button Component
 * Button that only shows if user has permission
 */
export function PermissionButton({
  resource,
  action,
  scope = 'own',
  children,
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const { hasAccess, checking } = usePermission(resource, action, scope)

  if (checking || !hasAccess) {
    return null
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Permission Form Field Component
 * Form field that shows read-only or hides based on permissions
 */
export function PermissionField({
  resource,
  action,
  scope = 'own',
  children,
  readOnlyFallback = null,
  hideIfNoAccess = false
}) {
  const { hasAccess, checking } = usePermission(resource, action, scope)

  if (checking) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!hasAccess) {
    if (hideIfNoAccess) return null
    return readOnlyFallback || (
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    )
  }

  return children
}

/**
 * Permission Alert Component
 * Shows warning if user lacks permission
 */
export function PermissionAlert({
  resource,
  action,
  scope = 'own',
  message = "You don't have permission to perform this action.",
  showIcon = true
}) {
  const { hasAccess, checking } = usePermission(resource, action, scope)

  if (checking || hasAccess) return null

  return (
    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
      {showIcon && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
      <span className="text-sm">{message}</span>
    </div>
  )
}

/**
 * CRUD Permission Wrapper
 * Provides CRUD permissions for a resource
 */
export function CRUDPermissions({ resource, scope = 'own', children }) {
  const { hasAccess: canCreate } = usePermission(resource, 'create', scope)
  const { hasAccess: canRead } = usePermission(resource, 'read', scope)
  const { hasAccess: canUpdate } = usePermission(resource, 'update', scope)
  const { hasAccess: canDelete } = usePermission(resource, 'delete', scope)

  const crudPermissions = {
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    create: canCreate,
    read: canRead,
    update: canUpdate,
    delete: canDelete
  }

  return children(crudPermissions)
}
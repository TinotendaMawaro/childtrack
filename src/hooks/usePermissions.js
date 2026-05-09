import { useState, useEffect, useCallback } from 'react'
import { permissionEngine } from '../lib/permissionEngine'

/**
 * React Hook for Permission Management
 * Provides easy-to-use permission checking in React components
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user permissions on mount
  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = useCallback(async () => {
    try {
      setLoading(true)
      const userPerms = await permissionEngine.getUserPermissions()
      setPermissions(userPerms)
      setError(null)
    } catch (err) {
      console.error('Failed to load permissions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(async (resource, action, scope = 'own') => {
    return await permissionEngine.checkPermission(resource, action, scope)
  }, [])

  /**
   * Check multiple permissions at once
   */
  const hasPermissions = useCallback(async (permissionList) => {
    return await permissionEngine.checkMultiplePermissions(permissionList)
  }, [])

  /**
   * Check if user can perform CRUD on a resource
   */
  const canCRUD = useCallback(async (resource, scope = 'own') => {
    const actions = ['create', 'read', 'update', 'delete']
    const checks = actions.map(action => ({
      resource, action, scope
    }))

    const results = await hasPermissions(checks)

    return {
      create: results[`${resource}:create:${scope}`] || false,
      read: results[`${resource}:read:${scope}`] || false,
      update: results[`${resource}:update:${scope}`] || false,
      delete: results[`${resource}:delete:${scope}`] || false,
      // Convenience properties
      canCreate: results[`${resource}:create:${scope}`] || false,
      canRead: results[`${resource}:read:${scope}`] || false,
      canUpdate: results[`${resource}:update:${scope}`] || false,
      canDelete: results[`${resource}:delete:${scope}`] || false
    }
  }, [hasPermissions])

  /**
   * Grant permission to user (admin only)
   */
  const grantPermission = useCallback(async (userId, resource, action, scope = 'own', options = {}) => {
    try {
      await permissionEngine.grantUserPermission(userId, resource, action, scope, options)
      await loadPermissions() // Refresh permissions
      return { success: true }
    } catch (error) {
      throw error
    }
  }, [loadPermissions])

  /**
   * Revoke permission from user (admin only)
   */
  const revokePermission = useCallback(async (userId, resource, action, scope = 'own') => {
    try {
      await permissionEngine.revokeUserPermission(userId, resource, action, scope)
      await loadPermissions() // Refresh permissions
      return { success: true }
    } catch (error) {
      throw error
    }
  }, [loadPermissions])

  /**
   * Clear permission cache
   */
  const clearCache = useCallback(() => {
    permissionEngine.clearCache()
  }, [])

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasPermissions,
    canCRUD,
    grantPermission,
    revokePermission,
    clearCache,
    reloadPermissions: loadPermissions
  }
}

/**
 * Hook for checking a specific permission with automatic re-checking
 */
export function usePermission(resource, action, scope = 'own') {
  const [hasAccess, setHasAccess] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkPermission()
  }, [resource, action, scope])

  const checkPermission = useCallback(async () => {
    setChecking(true)
    try {
      const result = await permissionEngine.checkPermission(resource, action, scope)
      setHasAccess(result)
    } catch (error) {
      console.error('Permission check failed:', error)
      setHasAccess(false)
    } finally {
      setChecking(false)
    }
  }, [resource, action, scope])

  return { hasAccess, checking, recheck: checkPermission }
}
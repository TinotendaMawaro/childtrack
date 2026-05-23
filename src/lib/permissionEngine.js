import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'

/**
 * Permission Engine for CRUD Operations
 * Provides centralized permission checking with caching and audit logging
 */

// Permission cache to avoid repeated database calls
const permissionCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export class PermissionEngine {
  constructor() {
    this.userPermissions = null
    this.rolePermissions = null
    this.lastFetch = null
  }

  /**
   * Check if user has permission for a specific resource and action
   * @param {string} resource - The resource (staff, children, classes, finance, recruitment)
   * @param {string} action - The action (create, read, update, delete)
   * @param {string} scope - The scope (own, department, organization)
   * @param {string} userId - Optional user ID override
   * @returns {Promise<boolean>}
   */
  async checkPermission(resource, action, scope = 'own', userId = null) {
    const cacheKey = `${userId || 'current'}:${resource}:${action}:${scope}`

    // Check cache first
    const cached = permissionCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.result
    }

    try {
      // Get current user if not specified
      if (!userId) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return false
        userId = session.user.id
      }

      // Call database function
      const { data, error } = await supabase
        .rpc('check_user_permission', {
          p_user_id: userId,
          p_resource: resource,
          p_action: action,
          p_scope: scope
        })

      if (error) {
        console.error('Permission check error:', error)
        return false
      }

      const result = Boolean(data)

      // Cache result
      permissionCache.set(cacheKey, {
        result,
        timestamp: Date.now()
      })

      return result

    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }

  /**
   * Check multiple permissions at once
   * @param {Array} permissions - Array of {resource, action, scope} objects
   * @param {string} userId - Optional user ID override
   * @returns {Promise<Object>} - Object with permission results
   */
  async checkMultiplePermissions(permissions, userId = null) {
    const results = {}

    await Promise.all(
      permissions.map(async ({ resource, action, scope = 'own' }) => {
        const key = `${resource}:${action}:${scope}`
        results[key] = await this.checkPermission(resource, action, scope, userId)
      })
    )

    return results
  }

  /**
   * Get all permissions for current user
   * @returns {Promise<Array>} - Array of permission objects
   */
  async getUserPermissions() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return []

      // Get role-based permissions
      const { data: rolePerms, error: roleError } = await supabase
        .from('role_permissions')
        .select(`
          permissions!inner(*)
        `)
        .eq('role', session.user.user_metadata?.role || 'USER')

      if (roleError) throw roleError

      // Get user-specific permissions
      const { data: userPerms, error: userError } = await supabase
        .from('user_permissions')
        .select(`
          granted,
          permissions!inner(*)
        `)
        .eq('user_id', session.user.id)
        .eq('granted', true)
        .is('expires_at', null) // Not expired

      if (userError) throw userError

      // Combine permissions (user overrides take precedence)
      const permissions = new Map()

      // Add role permissions
      rolePerms?.forEach(rp => {
        permissions.set(`${rp.permissions.resource}:${rp.permissions.action}:${rp.permissions.scope}`, rp.permissions)
      })

      // Add/override with user permissions
      userPerms?.forEach(up => {
        const key = `${up.permissions.resource}:${up.permissions.action}:${up.permissions.scope}`
        if (up.granted) {
          permissions.set(key, up.permissions)
        } else {
          permissions.delete(key) // Explicit deny
        }
      })

      return Array.from(permissions.values())

    } catch (error) {
      console.error('Failed to get user permissions:', error)
      return []
    }
  }

  /**
   * Clear permission cache
   */
  clearCache() {
    permissionCache.clear()
  }

  /**
   * Grant permission to user (admin only)
   * @param {string} userId - User to grant permission to
   * @param {string} resource - Resource name
   * @param {string} action - Action name
   * @param {string} scope - Permission scope
   * @param {Object} options - Additional options
   */
  async grantUserPermission(userId, resource, action, scope = 'own', options = {}) {
    try {
      // Get permission ID
      const { data: perm, error: permError } = await supabase
        .from('permissions')
        .select('id')
        .eq('resource', resource)
        .eq('action', action)
        .eq('scope', scope)
        .single()

      if (permError || !perm) {
        throw new Error(`Permission not found: ${resource}:${action}:${scope}`)
      }

      // Grant permission
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission_id: perm.id,
          granted: true,
          granted_by: supabase.auth.getUser().data.user?.id,
          expires_at: options.expiresAt || null,
          reason: options.reason || null
        }, {
          onConflict: 'user_id,permission_id'
        })

      if (error) throw error

      // Log the change
      await supabase.rpc('log_policy_change', {
        p_action: 'grant',
        p_resource_type: 'user_permission',
        p_resource_id: perm.id,
        p_changes: {
          user_id: userId,
          permission: `${resource}:${action}:${scope}`,
          reason: options.reason
        }
      })

      // Clear cache
      this.clearCache()

      return { success: true }

    } catch (error) {
      console.error('Failed to grant permission:', error)
      throw error
    }
  }

  /**
   * Revoke user permission (admin only)
   */
  async revokeUserPermission(userId, resource, action, scope = 'own') {
    try {
      const { data: perm } = await supabase
        .from('permissions')
        .select('id')
        .eq('resource', resource)
        .eq('action', action)
        .eq('scope', scope)
        .single()

      if (!perm) return { success: true } // Already revoked

      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('permission_id', perm.id)

      if (error) throw error

      // Log the change
      await supabase.rpc('log_policy_change', {
        p_action: 'revoke',
        p_resource_type: 'user_permission',
        p_resource_id: perm.id,
        p_changes: { user_id: userId, permission: `${resource}:${action}:${scope}` }
      })

      this.clearCache()

      return { success: true }

    } catch (error) {
      console.error('Failed to revoke permission:', error)
      throw error
    }
  }
}

// Singleton instance
export const permissionEngine = new PermissionEngine()
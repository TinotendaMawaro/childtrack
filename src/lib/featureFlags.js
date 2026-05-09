/**
 * Feature Flags for Migration Control
 * Allows gradual rollout of new permission system
 */

// Feature flags - change these to control migration phases
export const FEATURE_FLAGS = {
  // Main permission system toggle
  USE_NEW_PERMISSIONS: process.env.VITE_USE_NEW_PERMISSIONS === 'true' || false,

  // Granular feature toggles
  PERMISSION_GUARDS: process.env.VITE_PERMISSION_GUARDS === 'true' || false,
  AUDIT_LOGGING: process.env.VITE_AUDIT_LOGGING === 'true' || false,
  USER_PERMISSION_OVERRIDES: process.env.VITE_USER_PERMISSION_OVERRIDES === 'true' || false,

  // Migration phases
  MIGRATION_PHASE: process.env.VITE_MIGRATION_PHASE || 'legacy', // 'legacy', 'dual', 'new'
}

/**
 * Check if a feature is enabled
 * @param {string} feature - Feature flag name
 * @returns {boolean}
 */
export function isFeatureEnabled(feature) {
  return FEATURE_FLAGS[feature] || false
}

/**
 * Get current migration phase
 * @returns {string}
 */
export function getMigrationPhase() {
  return FEATURE_FLAGS.MIGRATION_PHASE
}

/**
 * Check if we're in dual mode (support both old and new systems)
 * @returns {boolean}
 */
export function isDualMode() {
  return getMigrationPhase() === 'dual'
}

/**
 * Check if we're fully migrated to new system
 * @returns {boolean}
 */
export function isNewSystem() {
  return getMigrationPhase() === 'new'
}

/**
 * Legacy permission check (for backward compatibility)
 * @param {Object} profile - User profile
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @returns {boolean}
 */
export function checkLegacyPermission(profile, resource, action) {
  if (!profile) return false

  const role = profile.role

  // Legacy role-based logic
  switch (resource) {
    case 'staff':
      return ['ADMIN'].includes(role)
    case 'children':
      return ['ADMIN', 'STAFF'].includes(role)
    case 'classes':
      return ['ADMIN', 'STAFF'].includes(role)
    case 'finance':
      return ['ADMIN'].includes(role)
    case 'recruitment':
      return ['ADMIN'].includes(role)
    default:
      return false
  }
}

/**
 * Unified permission check (supports both legacy and new systems)
 * @param {Object} profile - User profile
 * @param {string} resource - Resource name
 * @param {string} action - Action name
 * @param {string} scope - Permission scope
 * @returns {Promise<boolean>}
 */
export async function checkUnifiedPermission(profile, resource, action, scope = 'own') {
  // If new system is enabled, use it
  if (isFeatureEnabled('USE_NEW_PERMISSIONS')) {
    try {
      const { permissionEngine } = await import('../lib/permissionEngine')
      return await permissionEngine.checkPermission(resource, action, scope)
    } catch (error) {
      console.warn('New permission system failed, falling back to legacy:', error)
      return checkLegacyPermission(profile, resource, action)
    }
  }

  // Otherwise use legacy system
  return checkLegacyPermission(profile, resource, action)
}

// Environment variable validation
if (typeof window !== 'undefined') {
  console.log('[Feature Flags] Current configuration:', {
    USE_NEW_PERMISSIONS: FEATURE_FLAGS.USE_NEW_PERMISSIONS,
    PERMISSION_GUARDS: FEATURE_FLAGS.PERMISSION_GUARDS,
    MIGRATION_PHASE: FEATURE_FLAGS.MIGRATION_PHASE,
    AUDIT_LOGGING: FEATURE_FLAGS.AUDIT_LOGGING,
    USER_PERMISSION_OVERRIDES: FEATURE_FLAGS.USER_PERMISSION_OVERRIDES
  })
}
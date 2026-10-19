/**
 * Lingual RBAC (Role-Based Access Control) Domain Module
 * Static permission matrix and authorization helper utilities.
 */

export type Role = 'STUDENT' | 'CONTENT_EDITOR' | 'CONTENT_REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';

export const ROLES: Record<Role, Role> = {
  STUDENT: 'STUDENT',
  CONTENT_EDITOR: 'CONTENT_EDITOR',
  CONTENT_REVIEWER: 'CONTENT_REVIEWER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export type Permission =
  | 'content.draft.create'
  | 'content.draft.submit_review'
  | 'content.publish'
  | 'content.published.delete'
  | 'admin.dashboard.view'
  | 'user.status.toggle'
  | 'user.role.update'
  | 'audit_log.view'
  | 'system.config.update'
  | 'learner.features.use';

/**
 * Static Permission Matrix per Section 3 of lingual_rbac_plan.md
 */
export const PERMISSION_MATRIX: Record<Permission, Role[]> = {
  'content.draft.create': ['CONTENT_EDITOR', 'ADMIN', 'SUPER_ADMIN'],
  'content.draft.submit_review': ['CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'],
  'content.publish': ['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'],
  'content.published.delete': ['ADMIN', 'SUPER_ADMIN'],
  'admin.dashboard.view': ['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'],
  'user.status.toggle': ['ADMIN', 'SUPER_ADMIN'],
  'user.role.update': ['SUPER_ADMIN'],
  'audit_log.view': ['ADMIN', 'SUPER_ADMIN'],
  'system.config.update': ['SUPER_ADMIN'],
  'learner.features.use': ['STUDENT', 'CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'],
};

/**
 * Check if a given role has permission to perform an action.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSION_MATRIX[permission];
  return Boolean(allowedRoles && allowedRoles.includes(role));
}

/**
 * Ownership check helper:
 * CONTENT_EDITOR can only modify content created by themselves.
 * ADMIN and SUPER_ADMIN can modify any content.
 */
export function canModifyContent(
  user: { id: string; role: Role },
  resource: { createdBy?: string | null }
): boolean {
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return true;
  }

  if (user.role === 'CONTENT_EDITOR') {
    return Boolean(resource.createdBy && resource.createdBy === user.id);
  }

  if (user.role === 'CONTENT_REVIEWER') {
    return true; // Reviewers can view/review all submitted items
  }

  return false;
}

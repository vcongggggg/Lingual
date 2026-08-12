import { Router } from 'express';
import { Roles, rolesGuard, AuthenticatedRequest } from '../middleware/rbac.js';
import { auditLogInterceptor, MOCK_AUDIT_LOGS } from '../middleware/auditLog.js';
import { MOCK_USERS } from './auth.js';
import { Role } from '../../../../packages/domain/src/index.js';

export const adminRouter = Router();

/**
 * GET /api/v1/admin/dashboard
 * Access: CONTENT_REVIEWER, ADMIN, SUPER_ADMIN
 */
adminRouter.get(
  '/dashboard',
  Roles('CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN']),
  (req: AuthenticatedRequest, res) => {
    return res.json({
      summary: {
        totalUsers: MOCK_USERS.length,
        totalAuditLogs: MOCK_AUDIT_LOGS.length,
        activeEditors: MOCK_USERS.filter((u) => u.role === 'CONTENT_EDITOR').length,
        systemStatus: 'healthy',
      },
    });
  }
);

/**
 * GET /api/v1/admin/users
 * Access: ADMIN, SUPER_ADMIN
 */
adminRouter.get(
  '/users',
  Roles('ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['ADMIN', 'SUPER_ADMIN']),
  (req: AuthenticatedRequest, res) => {
    const safeUsers = MOCK_USERS.map(({ passwordHash, ...u }) => u);
    return res.json({ users: safeUsers });
  }
);

/**
 * POST /api/v1/admin/users/:userId/role
 * Access: SUPER_ADMIN ONLY (Assign/revoke user role)
 */
adminRouter.post(
  '/users/:userId/role',
  Roles('SUPER_ADMIN'),
  rolesGuard(['SUPER_ADMIN']),
  auditLogInterceptor('user.role.update', 'User'),
  (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const { newRole } = req.body;

    const validRoles: Role[] = ['STUDENT', 'CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: `Vai trò mới không hợp lệ. Các vai trò cho phép: ${validRoles.join(', ')}` });
    }

    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    req.auditMeta = {
      action: 'user.role.update',
      resourceType: 'User',
      resourceId: userId,
      beforeState: { role: user.role },
      afterState: { role: newRole },
    };

    user.role = newRole;

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ message: 'Cập nhật vai trò thành công', user: safeUser });
  }
);

/**
 * POST /api/v1/admin/users/:userId/toggle-status
 * Access: ADMIN, SUPER_ADMIN (Lock/unlock account)
 */
adminRouter.post(
  '/users/:userId/toggle-status',
  Roles('ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['ADMIN', 'SUPER_ADMIN']),
  auditLogInterceptor('user.status.toggle', 'User'),
  (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    req.auditMeta = {
      action: 'user.status.toggle',
      resourceType: 'User',
      resourceId: userId,
      beforeState: { locked: user.locked || false },
      afterState: { locked: !user.locked },
    };

    user.locked = !user.locked;

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ message: 'Thay đổi trạng thái tài khoản thành công', user: safeUser });
  }
);

/**
 * GET /api/v1/admin/audit-logs
 * Access: ADMIN, SUPER_ADMIN
 */
adminRouter.get(
  '/audit-logs',
  Roles('ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['ADMIN', 'SUPER_ADMIN']),
  (req: AuthenticatedRequest, res) => {
    return res.json({ auditLogs: MOCK_AUDIT_LOGS });
  }
);

/**
 * POST /api/v1/admin/config
 * Access: SUPER_ADMIN ONLY (System configuration / feature flags)
 */
adminRouter.post(
  '/config',
  Roles('SUPER_ADMIN'),
  rolesGuard(['SUPER_ADMIN']),
  auditLogInterceptor('system.config.update', 'SystemConfig'),
  (req: AuthenticatedRequest, res) => {
    req.auditMeta = {
      action: 'system.config.update',
      resourceType: 'SystemConfig',
      resourceId: 'global',
      beforeState: null,
      afterState: req.body,
    };

    return res.json({ message: 'Cập nhật cấu hình hệ thống thành công', config: req.body });
  }
);

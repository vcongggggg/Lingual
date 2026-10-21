import { Router } from 'express';
import { Roles, rolesGuard, AuthenticatedRequest } from '../middleware/rbac.js';
import { auditLogInterceptor } from '../middleware/auditLog.js';
import { userRepository } from '../repositories/user.repository.js';
import { configRepository } from '../repositories/config.repository.js';
import { prisma } from '../lib/prisma.js';
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
  async (req: AuthenticatedRequest, res) => {
    const totalUsers = await prisma.user.count();
    const totalAuditLogs = await prisma.auditLog.count();
    const activeEditors = await prisma.user.count({ where: { role: 'CONTENT_EDITOR' } });

    return res.json({
      summary: {
        totalUsers,
        totalAuditLogs,
        activeEditors,
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
  async (req: AuthenticatedRequest, res) => {
    const users = await userRepository.getAllUsers();
    return res.json({ users });
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
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const newRole = req.body.newRole || req.body.role;

    const validRoles: Role[] = ['STUDENT', 'CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: `Vai trò mới không hợp lệ. Các vai trò cho phép: ${validRoles.join(', ')}` });
    }

    const user = await userRepository.findById(userId);
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

    await userRepository.updateRole(userId, newRole);
    const updatedUser = await userRepository.findById(userId);

    const { passwordHash: _, ...safeUser } = updatedUser!;
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
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    const beforeActive = existingUser.isActive !== false;
    const updatedUser = await userRepository.toggleUserStatus(userId);

    if (!updatedUser) {
      return res.status(500).json({ error: 'Không thể cập nhật trạng thái người dùng' });
    }

    req.auditMeta = {
      action: 'user.status.toggle',
      resourceType: 'User',
      resourceId: userId,
      beforeState: { id: existingUser.id, isActive: beforeActive },
      afterState: { id: updatedUser.id, isActive: updatedUser.isActive },
    };

    const { passwordHash: _, ...safeUser } = updatedUser;
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
  async (req: AuthenticatedRequest, res) => {
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return res.json({ auditLogs });
  }
);

/**
 * GET /api/v1/admin/config
 * Access: SUPER_ADMIN ONLY (Retrieve all system configurations)
 */
adminRouter.get(
  '/config',
  Roles('SUPER_ADMIN'),
  rolesGuard(['SUPER_ADMIN']),
  async (req: AuthenticatedRequest, res) => {
    const configs = await configRepository.getAllConfigs();
    return res.json({ configs });
  }
);

/**
 * GET /api/v1/admin/config/:key
 * Access: SUPER_ADMIN ONLY (Retrieve specific configuration by key)
 */
adminRouter.get(
  '/config/:key',
  Roles('SUPER_ADMIN'),
  rolesGuard(['SUPER_ADMIN']),
  async (req: AuthenticatedRequest, res) => {
    const { key } = req.params;
    const value = await configRepository.getConfig(key);
    if (value === null || value === undefined) {
      return res.status(404).json({ error: `Không tìm thấy cấu hình với key '${key}'` });
    }
    return res.json({ key, value });
  }
);

/**
 * POST /api/v1/admin/config
 * Access: SUPER_ADMIN ONLY (Upsert system configuration / feature flags)
 */
adminRouter.post(
  '/config',
  Roles('SUPER_ADMIN'),
  rolesGuard(['SUPER_ADMIN']),
  auditLogInterceptor('system.config.update', 'SystemConfig'),
  async (req: AuthenticatedRequest, res) => {
    const updater = req.user?.id || 'admin';
    const body = req.body || {};

    const beforeState: Record<string, any> = {};
    const afterState: Record<string, any> = {};

    if (body.key && body.value !== undefined) {
      // Single key-value pair format: { key: "feature_x", value: true }
      const { before, after } = await configRepository.setConfig(body.key, body.value, updater);
      beforeState[body.key] = before;
      afterState[body.key] = after;
    } else if (typeof body === 'object' && Object.keys(body).length > 0) {
      // Key-value dictionary format: { feature_x: true, timeout: 5000 }
      for (const [k, v] of Object.entries(body)) {
        const { before, after } = await configRepository.setConfig(k, v, updater);
        beforeState[k] = before;
        afterState[k] = after;
      }
    } else {
      return res.status(400).json({ error: 'Dữ liệu cấu hình không hợp lệ' });
    }

    req.auditMeta = {
      action: 'system.config.update',
      resourceType: 'SystemConfig',
      resourceId: Object.keys(afterState).length === 1 ? Object.keys(afterState)[0] : 'global',
      beforeState,
      afterState,
    };

    return res.json({
      message: 'Cập nhật cấu hình hệ thống thành công',
      config: afterState,
    });
  }
);

/**
 * DELETE /api/v1/admin/config/:key
 * Access: SUPER_ADMIN ONLY (Delete a system configuration)
 */
adminRouter.delete(
  '/config/:key',
  Roles('SUPER_ADMIN'),
  rolesGuard(['SUPER_ADMIN']),
  auditLogInterceptor('system.config.delete', 'SystemConfig'),
  async (req: AuthenticatedRequest, res) => {
    const { key } = req.params;
    const before = await configRepository.getConfig(key);
    if (before === null || before === undefined) {
      return res.status(404).json({ error: `Không tìm thấy cấu hình với key '${key}'` });
    }

    await configRepository.deleteConfig(key);

    req.auditMeta = {
      action: 'system.config.delete',
      resourceType: 'SystemConfig',
      resourceId: key,
      beforeState: { [key]: before },
      afterState: null,
    };

    return res.json({ message: `Đã xóa cấu hình '${key}' thành công` });
  }
);

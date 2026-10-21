import { Router } from 'express';
import { Roles, rolesGuard, AuthenticatedRequest } from '../middleware/rbac.js';
import { auditLogInterceptor } from '../middleware/auditLog.js';
import { userRepository } from '../repositories/user.repository.js';
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

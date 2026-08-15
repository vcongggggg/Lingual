import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../../../packages/domain/src/index.js';
import { MOCK_USERS } from '../routes/auth.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
    email?: string;
  };
  _requiredRoles?: Role[];
  auditMeta?: {
    action?: string;
    resourceType?: string;
    resourceId?: string;
    beforeState?: any;
    afterState?: any;
  };
}

export const JWT_SECRET = process.env.JWT_SECRET || 'linguaflow_super_secret_jwt_key_2026';

/**
 * Decorator and Middleware helper for attaching required roles metadata to routes
 */
export function Roles(...roles: Role[]) {
  const middleware: any = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req._requiredRoles = roles;
    return next();
  };
  middleware._requiredRoles = roles;
  return middleware;
}

/**
 * RolesGuard Middleware implementing strict DEFAULT-DENY principle.
 * - Parses and verifies JWT token from Authorization header.
 * - Obtains user role from verified JWT or DB.
 * - Default-Deny: If requiredRoles is undefined or empty, returns 403 Forbidden.
 * - Asserts requiredRoles.includes(user.role), else 403 Forbidden.
 */
export function rolesGuard(requiredRoles?: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Truy cập bị từ chối: Chưa cung cấp Token đăng nhập' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const userId = payload.userId || payload.sub;

      // Always read latest role from DB / memory user store
      const dbUser = MOCK_USERS.find((u) => u.id === userId);
      const role: Role = dbUser ? (dbUser.role as Role) : (payload.role as Role);

      if (!role) {
        return res.status(403).json({ error: 'Truy cập bị từ chối: Không tìm thấy Role hợp lệ' });
      }

      req.user = {
        id: userId,
        role,
        email: dbUser?.email,
      };

      // DEFAULT DENY PRINCIPLE: If no @Roles metadata or empty requiredRoles -> DENY
      if (!requiredRoles || requiredRoles.length === 0) {
        return res.status(403).json({
          error: 'Truy cập bị từ chối [Default-Deny]: Endpoint này chưa khai báo @Roles()',
        });
      }

      if (!requiredRoles.includes(role)) {
        return res.status(403).json({
          error: `Truy cập bị từ chối: Vai trò '${role}' không có quyền truy cập endpoint này (Yêu cầu: ${requiredRoles.join(', ')})`,
        });
      }

      return next();
    } catch (err: any) {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  };
}

import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../../../packages/domain/src/index.js';
import { userRepository } from '../repositories/user.repository.js';

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

const envJwtSecret = process.env.JWT_SECRET;
if (!envJwtSecret) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing.');
}
export const JWT_SECRET = envJwtSecret;

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
 * - Obtains user role from PostgreSQL DB via userRepository.
 * - Default-Deny: If requiredRoles is undefined or empty, returns 403 Forbidden.
 * - Asserts requiredRoles.includes(user.role), else 403 Forbidden.
 */
export function rolesGuard(requiredRoles?: Role[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    } else if (req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Truy cập bị từ chối: Chưa cung cấp Token đăng nhập' });
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const userId = payload.userId || payload.sub;

      // Authoritatively read latest role directly from PostgreSQL
      const dbUser = await userRepository.findById(userId);
      if (!dbUser) {
        return res.status(401).json({ error: 'Truy cập bị từ chối: Người dùng không tồn tại' });
      }

      const role: Role = dbUser.role;
      if (!role) {
        return res.status(403).json({ error: 'Truy cập bị từ chối: Không tìm thấy Role hợp lệ' });
      }

      req.user = {
        id: userId,
        role,
        email: dbUser.email,
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
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
      }
      return res.status(401).json({ error: 'Token xác thực không hợp lệ' });
    }
  };
}

import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/rbac.js';

export interface ResolvedUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Resolves the user ID safely across environments:
 * 1. Express req.user (if populated by middleware/guard)
 * 2. Bearer JWT token in Authorization header or httpOnly cookie
 * 3. In non-production (development/test): falls back to 'demo-user-id-001' (never trust client-supplied userId)
 * 4. In production (NODE_ENV === 'production') or when options.strict is true: STRICTLY returns null if no valid token is present
 */
export function resolveAuthUserId(req: Request, options?: { strict?: boolean }): string | null {
  // 1. Authenticated req.user
  if ((req as any).user?.id) {
    return (req as any).user.id;
  }

  // 2. Parse Bearer Authorization header or httpOnly cookie
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const id = payload?.userId || payload?.sub || payload?.id;
      if (id) return id;
    } catch {
      // In non-production only, accept mock test tokens if not strict
      if (process.env.NODE_ENV !== 'production' && token && !options?.strict) {
        return `user-${token.slice(0, 8)}`;
      }
    }
  }

  // If strict mode is requested or in production, reject unauthenticated requests
  if (options?.strict || process.env.NODE_ENV === 'production') {
    return null;
  }

  // 3. In non-production environments (test/development), allow default demo fallback (never trust explicit client userId)
  return 'demo-user-id-001';
}

/**
 * Resolves user object for routes requiring id, email, and role.
 */
export function resolveAuthUser(req: Request, options?: { strict?: boolean }): ResolvedUser | null {
  if ((req as any).user && (req as any).user.id) {
    return {
      id: (req as any).user.id,
      email: (req as any).user.email || 'learner@linguaflow.com',
      role: (req as any).user.role || 'STUDENT',
    };
  }

  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      if (payload?.userId) {
        return {
          id: payload.userId,
          email: payload.email || 'learner@linguaflow.com',
          role: payload.role || 'STUDENT',
        };
      }
    } catch {
      if (process.env.NODE_ENV !== 'production' && token && !options?.strict) {
        return { id: `user-${token.slice(0, 8)}`, email: 'learner@linguaflow.com', role: 'STUDENT' };
      }
    }
  }

  if (options?.strict || process.env.NODE_ENV === 'production') {
    return null;
  }

  return { id: 'demo-user-id-001', email: 'demo@linguaflow.com', role: 'STUDENT' };
}

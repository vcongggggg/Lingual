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
 * 2. Bearer JWT token in Authorization header
 * 3. In non-production (development/test): falls back to explicit userId or 'demo-user-id-001'
 * 4. In production (NODE_ENV === 'production'): STRICTLY returns null if no valid token is present
 */
export function resolveAuthUserId(req: Request): string | null {
  // 1. Authenticated req.user
  if ((req as any).user?.id) {
    return (req as any).user.id;
  }

  // 2. Parse Bearer Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const id = payload?.userId || payload?.sub || payload?.id;
      if (id) return id;
    } catch {
      // In non-production only, accept mock test tokens
      if (process.env.NODE_ENV !== 'production' && token) {
        return `user-${token.slice(0, 8)}`;
      }
    }
  }

  // 3. In non-production environments (test/development), allow explicit param or fallback
  if (process.env.NODE_ENV !== 'production') {
    const explicit = (req.body?.userId as string) || (req.query?.userId as string);
    return explicit || 'demo-user-id-001';
  }

  // 4. In production: strictly refuse fallback without valid token
  return null;
}

/**
 * Resolves user object for routes requiring id, email, and role.
 */
export function resolveAuthUser(req: Request): ResolvedUser | null {
  if ((req as any).user && (req as any).user.id) {
    return {
      id: (req as any).user.id,
      email: (req as any).user.email || 'learner@linguaflow.com',
      role: (req as any).user.role || 'STUDENT',
    };
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
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
      if (process.env.NODE_ENV !== 'production' && token) {
        return { id: `user-${token.slice(0, 8)}`, email: 'learner@linguaflow.com', role: 'STUDENT' };
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return { id: 'demo-user-id-001', email: 'demo@linguaflow.com', role: 'STUDENT' };
  }

  return null;
}

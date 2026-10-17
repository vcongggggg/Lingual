import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './rbac.js';
import { prisma } from '../lib/prisma.js';

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  beforeState: any;
  afterState: any;
  createdAt: Date;
}

/**
 * AuditLogInterceptor Middleware:
 * Automatically records actorId, action, resourceType, resourceId, beforeState, and afterState
 * into PostgreSQL AuditLog model for sensitive actions.
 */
export function auditLogInterceptor(actionName: string, resourceType: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const actorId = req.user?.id || 'system';
          const resourceId = req.params.id || req.params.userId || body?.id || 'n/a';
          const beforeState = req.auditMeta?.beforeState || null;
          const afterState = req.auditMeta?.afterState || body || null;

          prisma.auditLog
            .create({
              data: {
                actorId,
                action: req.auditMeta?.action || actionName,
                resourceType,
                resourceId: String(resourceId),
                beforeState: beforeState ?? undefined,
                afterState: afterState ?? undefined,
              },
            })
            .catch((err) => {
              console.error('AuditLogInterceptor failed to persist log in PostgreSQL:', err);
            });
        } catch (err) {
          console.error('AuditLogInterceptor failed:', err);
        }
      }
      return originalJson(body);
    };

    return next();
  };
}

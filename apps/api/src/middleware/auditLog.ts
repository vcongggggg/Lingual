import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './rbac.js';

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

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [];

/**
 * AuditLogInterceptor Middleware:
 * Automatically records actorId, action, resourceType, resourceId, beforeState, and afterState
 * into AuditLog for sensitive actions.
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

          const logEntry: AuditLogEntry = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            actorId,
            action: req.auditMeta?.action || actionName,
            resourceType,
            resourceId,
            beforeState,
            afterState,
            createdAt: new Date(),
          };

          MOCK_AUDIT_LOGS.unshift(logEntry);
        } catch (err) {
          console.error('AuditLogInterceptor failed:', err);
        }
      }
      return originalJson(body);
    };

    return next();
  };
}

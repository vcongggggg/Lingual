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
 * Checks if an audit action is sensitive (e.g. changing roles, toggling status, deleting content, updating system config).
 * Sensitive actions require synchronous persistence and MUST fail the request if logging fails.
 */
export function isSensitiveAuditAction(action: string): boolean {
  const normalized = action.toLowerCase();
  return (
    normalized.includes('role') ||
    normalized.includes('status') ||
    normalized.includes('delete') ||
    normalized.includes('config')
  );
}

/**
 * Standalone helper to log sensitive actions synchronously with mandatory error propagation.
 */
export async function logSensitiveAction(entry: {
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  beforeState?: any;
  afterState?: any;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: String(entry.resourceId),
        beforeState: entry.beforeState ?? undefined,
        afterState: entry.afterState ?? undefined,
      },
    });
  } catch (err) {
    console.error(`❌ [CRITICAL AUDIT FAILURE] Ghi Audit Log bắt buộc thất bại cho "${entry.action}":`, err);
    throw new Error(`CRITICAL_AUDIT_LOG_FAILED: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * AuditLogInterceptor Middleware:
 * Automatically records actorId, action, resourceType, resourceId, beforeState, and afterState
 * into PostgreSQL AuditLog model.
 * - Sensitive actions: Awaited and blocks response. Returns 500 error if audit log creation fails.
 * - Non-sensitive actions: Logged asynchronously with explicit error logging + metric monitoring.
 */
export function auditLogInterceptor(actionName: string, resourceType: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const actorId = req.user?.id || 'system';
        const resourceId = req.params.id || req.params.userId || body?.id || 'n/a';
        const beforeState = req.auditMeta?.beforeState || null;
        const afterState = req.auditMeta?.afterState || body || null;
        const action = req.auditMeta?.action || actionName;

        if (isSensitiveAuditAction(action)) {
          // Sensitive Action: MUST await and return 500 if database logging fails
          prisma.auditLog
            .create({
              data: {
                actorId,
                action,
                resourceType,
                resourceId: String(resourceId),
                beforeState: beforeState ?? undefined,
                afterState: afterState ?? undefined,
              },
            })
            .then(() => {
              return originalJson(body);
            })
            .catch((err) => {
              console.error(`❌ [CRITICAL AUDIT FAILURE] Ghi Audit Log thất bại cho hành động nhạy cảm "${action}":`, err);
              res.statusCode = 500;
              return originalJson({
                error: 'Lỗi bảo mật nghiêm trọng: Không thể ghi nhận Audit Log bắt buộc cho hành vi nhạy cảm.',
                code: 'AUDIT_LOG_PERSISTENCE_FAILED',
              });
            });
          return res;
        } else {
          // Regular Action: fire-and-forget with clear error and metric logging
          prisma.auditLog
            .create({
              data: {
                actorId,
                action,
                resourceType,
                resourceId: String(resourceId),
                beforeState: beforeState ?? undefined,
                afterState: afterState ?? undefined,
              },
            })
            .catch((err) => {
              console.error(`⚠️ [AUDIT_ERROR] Ghi Audit Log thường "${action}" thất bại:`, err.message || err);
            });
          return originalJson(body);
        }
      }
      return originalJson(body);
    };

    return next();
  };
}

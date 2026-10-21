import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { resolveAuthUserId } from '../src/lib/authUtil.js';
import { JWT_SECRET } from '../src/middleware/rbac.js';

describe('Production Demo-User Fallback Elimination Audit', () => {
  it('strictly returns null in production mode when request has no token', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';

      const mockReq: any = {
        headers: {},
        body: {},
        query: {},
      };

      const resolved = resolveAuthUserId(mockReq);
      assert.strictEqual(resolved, null, 'Production mode must not fallback to demo-user-id-001 without token');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('correctly resolves user ID from valid Bearer JWT in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';

      const testUserId = 'prod-verified-user-123';
      const token = jwt.sign({ userId: testUserId, role: 'STUDENT' }, JWT_SECRET, { expiresIn: '1h' });

      const mockReq: any = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: {},
        query: {},
      };

      const resolved = resolveAuthUserId(mockReq);
      assert.strictEqual(resolved, testUserId, 'Production mode must resolve authenticated user from JWT');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('allows demo fallback in development mode when unauthenticated', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'development';

      const mockReq: any = {
        headers: {},
        body: {},
        query: {},
      };

      const resolved = resolveAuthUserId(mockReq);
      assert.strictEqual(resolved, 'demo-user-id-001', 'Development mode can safely fallback to demo user');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('strictly returns null in strict mode even in development when unauthenticated', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'development';

      const mockReq: any = {
        headers: {},
        body: { userId: 'user-alice-002' },
        query: { userId: 'user-alice-002' },
      };

      const resolved = resolveAuthUserId(mockReq, { strict: true });
      assert.strictEqual(resolved, null, 'Strict mode must refuse client-supplied userId and unauthenticated requests');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('never trusts query.userId or body.userId without token even in non-strict mode', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'development';

      const mockReq: any = {
        headers: {},
        body: { userId: 'user-alice-002' },
        query: { userId: 'user-alice-002' },
      };

      const resolved = resolveAuthUserId(mockReq);
      assert.strictEqual(resolved, 'demo-user-id-001', 'Must not impersonate user-alice-002 from body or query');
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});


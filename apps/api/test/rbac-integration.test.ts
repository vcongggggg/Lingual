import jwt from 'jsonwebtoken';
import { rolesGuard, JWT_SECRET, AuthenticatedRequest } from '../src/middleware/rbac.js';
import { canModifyContent, Role } from '../../../packages/domain/src/index.js';
import { prisma } from '../src/lib/prisma.js';

function generateToken(userId: string, role: Role): string {
  return jwt.sign({ userId, sub: userId, role }, JWT_SECRET, { expiresIn: '15m' });
}

const testUsers: { id: string; email: string; role: Role }[] = [
  { id: 'user-student-001', email: 'student-rbac@lingual.test', role: 'STUDENT' },
  { id: 'user-content_editor-001', email: 'editor1-rbac@lingual.test', role: 'CONTENT_EDITOR' },
  { id: 'user-content_editor-002', email: 'editor2-rbac@lingual.test', role: 'CONTENT_EDITOR' },
  { id: 'user-editor-001', email: 'editor-legacy1-rbac@lingual.test', role: 'CONTENT_EDITOR' },
  { id: 'user-editor-002', email: 'editor-legacy2-rbac@lingual.test', role: 'CONTENT_EDITOR' },
  { id: 'user-content_reviewer-001', email: 'reviewer-rbac@lingual.test', role: 'CONTENT_REVIEWER' },
  { id: 'user-admin-001', email: 'admin-rbac@lingual.test', role: 'ADMIN' },
  { id: 'user-super_admin-001', email: 'superadmin-rbac@lingual.test', role: 'SUPER_ADMIN' },
];

async function seedTestUsers() {
  for (const u of testUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: { role: u.role as any },
      create: {
        id: u.id,
        email: u.email,
        displayName: u.id,
        role: u.role as any,
      },
    });
  }
}

async function testGuard(
  role: Role,
  requiredRoles: Role[] | undefined
): Promise<{ status: number; error?: string }> {
  return new Promise((resolve) => {
    const token = generateToken(`user-${role.toLowerCase()}-001`, role);
    const req: any = {
      headers: { authorization: `Bearer ${token}` },
    };
    const res: any = {
      statusCode: 200,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        resolve({ status: this.statusCode, error: data.error });
      },
    };
    const next = () => {
      resolve({ status: 200 });
    };

    const guardMiddleware = rolesGuard(requiredRoles);
    guardMiddleware(req as AuthenticatedRequest, res, next);
  });
}

async function testGuardWithCookie(
  role: Role,
  requiredRoles: Role[] | undefined,
  options?: { customToken?: string; useHeaderCookie?: boolean; bearerToken?: string }
): Promise<{ status: number; error?: string }> {
  return new Promise((resolve) => {
    const token = options?.customToken !== undefined
      ? options.customToken
      : generateToken(`user-${role.toLowerCase()}-001`, role);

    const headers: Record<string, string> = {};
    if (options?.bearerToken) {
      headers.authorization = `Bearer ${options.bearerToken}`;
    }
    if (options?.useHeaderCookie) {
      headers.cookie = `access_token=${token}`;
    }

    const req: any = {
      headers,
      cookies: options?.useHeaderCookie ? undefined : (token ? { access_token: token } : {}),
    };
    const res: any = {
      statusCode: 200,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        resolve({ status: this.statusCode, error: data.error });
      },
    };
    const next = () => {
      resolve({ status: 200 });
    };

    const guardMiddleware = rolesGuard(requiredRoles);
    guardMiddleware(req as AuthenticatedRequest, res, next);
  });
}

async function runRBACIntegrationTests() {
  await seedTestUsers();
  console.log('🧪 Running Comprehensive 5-Role RBAC Integration Tests...\n');
  let failures = 0;

  // TEST 1: STUDENT calling Admin endpoint (requires ADMIN, SUPER_ADMIN) -> MUST get 403 Forbidden
  const t1 = await testGuard('STUDENT', ['ADMIN', 'SUPER_ADMIN']);
  if (t1.status === 403) {
    console.log('✅ TEST 1 PASSED: STUDENT calling Admin endpoint got 403 Forbidden.');
  } else {
    console.error(`❌ TEST 1 FAILED: Expected 403, got ${t1.status}`);
    failures++;
  }

  // TEST 2: DEFAULT-DENY CHECK: Handler missing @Roles decorator (requiredRoles undefined) -> MUST get 403 Forbidden for ALL roles
  const t2a = await testGuard('STUDENT', undefined);
  const t2b = await testGuard('SUPER_ADMIN', undefined);
  if (t2a.status === 403 && t2b.status === 403) {
    console.log('✅ TEST 2 PASSED: Default-Deny principle verified! Missing @Roles() yields 403 Forbidden even for SUPER_ADMIN.');
  } else {
    console.error(`❌ TEST 2 FAILED: Default-Deny failed. STUDENT: ${t2a.status}, SUPER_ADMIN: ${t2b.status}`);
    failures++;
  }

  // TEST 3: ADMIN trying to change user role (requires SUPER_ADMIN) -> MUST get 403 Forbidden
  const t3 = await testGuard('ADMIN', ['SUPER_ADMIN']);
  if (t3.status === 403) {
    console.log('✅ TEST 3 PASSED: ADMIN trying to change role got 403 Forbidden (SUPER_ADMIN ONLY).');
  } else {
    console.error(`❌ TEST 3 FAILED: Expected 403, got ${t3.status}`);
    failures++;
  }

  // TEST 4: SUPER_ADMIN accessing role management -> MUST get 200 OK
  const t4 = await testGuard('SUPER_ADMIN', ['SUPER_ADMIN']);
  if (t4.status === 200) {
    console.log('✅ TEST 4 PASSED: SUPER_ADMIN successfully authorized for role assignment.');
  } else {
    console.error(`❌ TEST 4 FAILED: Expected 200, got ${t4.status}`);
    failures++;
  }

  // TEST 5: CONTENT_EDITOR creating draft (requires CONTENT_EDITOR, ADMIN, SUPER_ADMIN) -> MUST get 200 OK
  const t5 = await testGuard('CONTENT_EDITOR', ['CONTENT_EDITOR', 'ADMIN', 'SUPER_ADMIN']);
  if (t5.status === 200) {
    console.log('✅ TEST 5 PASSED: CONTENT_EDITOR authorized to create content draft.');
  } else {
    console.error(`❌ TEST 5 FAILED: Expected 200, got ${t5.status}`);
    failures++;
  }

  // TEST 6: CONTENT_EDITOR publishing content (requires CONTENT_REVIEWER, ADMIN, SUPER_ADMIN) -> MUST get 403 Forbidden
  const t6 = await testGuard('CONTENT_EDITOR', ['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN']);
  if (t6.status === 403) {
    console.log('✅ TEST 6 PASSED: CONTENT_EDITOR publishing content got 403 Forbidden.');
  } else {
    console.error(`❌ TEST 6 FAILED: Expected 403, got ${t6.status}`);
    failures++;
  }

  // TEST 7: OWNERSHIP CHECK: CONTENT_EDITOR A editing CONTENT_EDITOR B's draft -> MUST return false
  const userA = { id: 'user-editor-001', role: 'CONTENT_EDITOR' as Role };
  const resourceB = { createdBy: 'user-editor-002' };
  const canEditOther = canModifyContent(userA, resourceB);
  if (!canEditOther) {
    console.log("✅ TEST 7 PASSED: Ownership check verified! CONTENT_EDITOR A cannot edit CONTENT_EDITOR B's draft.");
  } else {
    console.error("❌ TEST 7 FAILED: CONTENT_EDITOR A should NOT be able to edit CONTENT_EDITOR B's draft!");
    failures++;
  }

  // TEST 8: OWNERSHIP CHECK: CONTENT_EDITOR A editing OWN draft -> MUST return true
  const resourceA = { createdBy: 'user-editor-001' };
  const canEditOwn = canModifyContent(userA, resourceA);
  if (canEditOwn) {
    console.log('✅ TEST 8 PASSED: CONTENT_EDITOR A can edit own draft.');
  } else {
    console.error('❌ TEST 8 FAILED: CONTENT_EDITOR A should be able to edit own draft!');
    failures++;
  }

  // TEST 9: COOKIE AUTH: Request with valid cookie but wrong role (STUDENT -> Admin endpoint) -> MUST get 403 Forbidden (NOT 401)
  const t9 = await testGuardWithCookie('STUDENT', ['ADMIN', 'SUPER_ADMIN']);
  if (t9.status === 403) {
    console.log('✅ TEST 9 PASSED: Valid cookie with wrong role (STUDENT) got 403 Forbidden (not 401).');
  } else {
    console.error(`❌ TEST 9 FAILED: Expected 403, got ${t9.status}`);
    failures++;
  }

  // TEST 10: COOKIE AUTH: Request with valid cookie and matching role (ADMIN -> Admin endpoint) -> MUST get 200 OK
  const t10 = await testGuardWithCookie('ADMIN', ['ADMIN', 'SUPER_ADMIN']);
  if (t10.status === 200) {
    console.log('✅ TEST 10 PASSED: Valid cookie with matching role (ADMIN) passed guard (200 OK).');
  } else {
    console.error(`❌ TEST 10 FAILED: Expected 200, got ${t10.status}`);
    failures++;
  }

  // TEST 11: COOKIE HEADER AUTH: Request with raw header cookie (SUPER_ADMIN -> SuperAdmin endpoint) -> MUST get 200 OK
  const t11 = await testGuardWithCookie('SUPER_ADMIN', ['SUPER_ADMIN'], { useHeaderCookie: true });
  if (t11.status === 200) {
    console.log('✅ TEST 11 PASSED: Valid raw cookie header with matching role (SUPER_ADMIN) passed guard (200 OK).');
  } else {
    console.error(`❌ TEST 11 FAILED: Expected 200, got ${t11.status}`);
    failures++;
  }

  // TEST 12: INVALID COOKIE: Forged or corrupted cookie token -> MUST get 401 Unauthorized
  const t12 = await testGuardWithCookie('STUDENT', ['STUDENT'], { customToken: 'invalid.forged.token' });
  if (t12.status === 401) {
    console.log('✅ TEST 12 PASSED: Forged/corrupted cookie token rejected with 401 Unauthorized.');
  } else {
    console.error(`❌ TEST 12 FAILED: Expected 401, got ${t12.status}`);
    failures++;
  }

  // TEST 13: NO AUTH: Request missing both Bearer header and cookie -> MUST get 401 Unauthorized
  const t13 = await testGuardWithCookie('STUDENT', ['STUDENT'], { customToken: '' });
  if (t13.status === 401) {
    console.log('✅ TEST 13 PASSED: Request with no token/cookie rejected with 401 Unauthorized.');
  } else {
    console.error(`❌ TEST 13 FAILED: Expected 401, got ${t13.status}`);
    failures++;
  }

  // TEST 14: PRECEDENCE: Bearer header takes precedence over cookie (Bearer ADMIN vs Cookie STUDENT) -> 200 OK
  const adminToken = generateToken('user-admin-001', 'ADMIN');
  const t14 = await testGuardWithCookie('STUDENT', ['ADMIN', 'SUPER_ADMIN'], { bearerToken: adminToken });
  if (t14.status === 200) {
    console.log('✅ TEST 14 PASSED: Bearer token takes precedence over cookie token.');
  } else {
    console.error(`❌ TEST 14 FAILED: Expected 200, got ${t14.status}`);
    failures++;
  }

  if (failures > 0) {
    console.error(`\n❌ ${failures} Integration Test(s) FAILED.`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 14 RBAC Integration Tests PASSED successfully!');
  }
}

runRBACIntegrationTests().catch(console.error);

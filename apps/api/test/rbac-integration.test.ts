import jwt from 'jsonwebtoken';
import { rolesGuard, JWT_SECRET, AuthenticatedRequest } from '../src/middleware/rbac.js';
import { canModifyContent, Role } from '../../../packages/domain/src/index.js';
import { MOCK_USERS } from '../src/routes/auth.js';

function generateToken(userId: string, role: Role): string {
  return jwt.sign({ userId, sub: userId, role }, JWT_SECRET, { expiresIn: '15m' });
}

// Seed mock test users with all 5 roles
MOCK_USERS.push(
  { id: 'user-student-001', email: 'student@lingual.com', role: 'STUDENT' },
  { id: 'user-editor-001', email: 'editor1@lingual.com', role: 'CONTENT_EDITOR' },
  { id: 'user-editor-002', email: 'editor2@lingual.com', role: 'CONTENT_EDITOR' },
  { id: 'user-reviewer-001', email: 'reviewer@lingual.com', role: 'CONTENT_REVIEWER' },
  { id: 'user-admin-001', email: 'admin@lingual.com', role: 'ADMIN' },
  { id: 'user-superadmin-001', email: 'superadmin@lingual.com', role: 'SUPER_ADMIN' }
);

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

async function runRBACIntegrationTests() {
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

  if (failures > 0) {
    console.error(`\n❌ ${failures} Integration Test(s) FAILED.`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 8 RBAC Integration Tests PASSED successfully!');
  }
}

runRBACIntegrationTests().catch(console.error);

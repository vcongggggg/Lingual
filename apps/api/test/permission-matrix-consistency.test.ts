import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PERMISSION_MATRIX, Permission, Role } from '../../../packages/domain/src/rbac.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDir = path.resolve(__dirname, '../src/routes');

export interface ScannedRouteGuard {
  file: string;
  method: string;
  path: string;
  roles: Role[];
}

/**
 * Static Source Scanner: Quét toàn bộ call site `rolesGuard(...)` trong thư mục routes
 */
export function scanRoutesForRolesGuard(): ScannedRouteGuard[] {
  const scanned: ScannedRouteGuard[] = [];
  const files = fs.readdirSync(routesDir).filter((f) => f.endsWith('.ts'));

  const guardRegex = /rolesGuard\(\s*\[([\s\S]*?)\]\s*\)/g;

  for (const file of files) {
    const fullPath = path.join(routesDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    let match: RegExpExecArray | null;
    while ((match = guardRegex.exec(content)) !== null) {
      const guardIndex = match.index;
      const rawRoles = match[1];

      // Lấy đoạn văn bản tối đa 500 ký tự ngay trước vị trí rolesGuard
      const beforeText = content.slice(Math.max(0, guardIndex - 500), guardIndex);
      const routeMatches = [...beforeText.matchAll(/\.(get|post|put|delete|patch)\(\s*['"]([^'"]+)['"]/gi)];

      if (routeMatches.length > 0) {
        const lastRoute = routeMatches[routeMatches.length - 1];
        const method = lastRoute[1].toUpperCase();
        const routePath = lastRoute[2];

        const roles = rawRoles
          .split(',')
          .map((r) => r.trim().replace(/['"]/g, ''))
          .filter((r): r is Role =>
            Boolean(r) &&
            ['STUDENT', 'CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(r)
          );

        scanned.push({
          file,
          method,
          path: routePath,
          roles,
        });
      }
    }
  }

  return scanned;
}

/**
 * Định nghĩa bảng đối chiếu Permission <-> Endpoint Pattern
 */
interface PermissionEndpointMapping {
  permission: Permission;
  endpoints: { file: string; method: string; pathMatcher: RegExp }[];
  isUnmappedByDesign?: boolean;
  unmappedReason?: string;
}

export const PERMISSION_ROUTE_MAPPINGS: PermissionEndpointMapping[] = [
  {
    permission: 'content.draft.create',
    endpoints: [
      { file: 'curriculum.ts', method: 'POST', pathMatcher: /^\/lessons$/ },
      { file: 'ielts.ts', method: 'POST', pathMatcher: /^\/questions$/ },
    ],
  },
  {
    permission: 'content.draft.submit_review',
    endpoints: [],
    isUnmappedByDesign: true,
    unmappedReason:
      'Gom chung vào handler cập nhật nội dung PUT (/lessons/:lessonId và /questions/:questionId), không có endpoint riêng biệt theo thiết kế.',
  },
  {
    permission: 'content.publish',
    endpoints: [
      { file: 'curriculum.ts', method: 'POST', pathMatcher: /^\/lessons\/[^\/]+\/publish$/ },
      { file: 'ielts.ts', method: 'POST', pathMatcher: /^\/questions\/[^\/]+\/publish$/ },
    ],
  },
  {
    permission: 'content.published.delete',
    endpoints: [
      { file: 'curriculum.ts', method: 'DELETE', pathMatcher: /^\/lessons\/[^\/]+$/ },
      { file: 'ielts.ts', method: 'DELETE', pathMatcher: /^\/questions\/[^\/]+$/ },
    ],
  },
  {
    permission: 'admin.dashboard.view',
    endpoints: [{ file: 'admin.ts', method: 'GET', pathMatcher: /^\/dashboard$/ }],
  },
  {
    permission: 'user.status.toggle',
    endpoints: [{ file: 'admin.ts', method: 'POST', pathMatcher: /^\/users\/[^\/]+\/toggle-status$/ }],
  },
  {
    permission: 'user.role.update',
    endpoints: [{ file: 'admin.ts', method: 'POST', pathMatcher: /^\/users\/[^\/]+\/role$/ }],
  },
  {
    permission: 'audit_log.view',
    endpoints: [{ file: 'admin.ts', method: 'GET', pathMatcher: /^\/audit-logs$/ }],
  },
  {
    permission: 'system.config.update',
    endpoints: [{ file: 'admin.ts', method: 'POST', pathMatcher: /^\/config$/ }],
  },
  {
    permission: 'learner.features.use',
    endpoints: [],
    isUnmappedByDesign: true,
    unmappedReason:
      'Quyền học tập cơ bản áp dụng cho mọi tài khoản đã đăng nhập, được kiểm soát qua tầng xác thực auth middleware thay vì rolesGuard cụ thể.',
  },
];

describe('RBAC Permission Matrix vs Routes rolesGuard Consistency Automated Audit', () => {
  const scannedRoutes = scanRoutesForRolesGuard();

  it('scans and finds all active rolesGuard declarations in routes directory', () => {
    assert.ok(scannedRoutes.length >= 8, `Expected at least 8 routes with rolesGuard, found ${scannedRoutes.length}`);
  });

  it('strictly verifies PERMISSION_MATRIX matches rolesGuard in routes with zero mismatches', () => {
    console.log('\n======================================================================');
    console.log('🛡️  BẮT ĐẦU ĐỐI CHIẾU PERMISSION_MATRIX VỚI ROLESGUARD TRONG API ROUTES');
    console.log('======================================================================');

    let totalPermissionsChecked = 0;
    let matchedCount = 0;
    const mismatches: Array<{
      permission: Permission;
      endpoint: string;
      matrixRoles: Role[];
      actualRoles: Role[];
    }> = [];

    const unmappedList: Array<{
      permission: Permission;
      reason: string;
    }> = [];

    // 1. Duyệt qua toàn bộ 10 permission trong PERMISSION_MATRIX
    const allPermissions = Object.keys(PERMISSION_MATRIX) as Permission[];

    for (const perm of allPermissions) {
      const mapping = PERMISSION_ROUTE_MAPPINGS.find((m) => m.permission === perm);
      const expectedRoles = [...PERMISSION_MATRIX[perm]].sort();

      if (!mapping || mapping.isUnmappedByDesign || mapping.endpoints.length === 0) {
        unmappedList.push({
          permission: perm,
          reason: mapping?.unmappedReason || 'Chưa cấu hình ánh xạ endpoint cho permission này.',
        });
        continue;
      }

      totalPermissionsChecked++;
      console.log(`\n▶ [PERMISSION]: '${perm}'`);
      console.log(`  Expected Roles (Matrix): [${expectedRoles.join(', ')}]`);

      for (const ep of mapping.endpoints) {
        // Tìm endpoint trong danh sách quét
        const matchedRoute = scannedRoutes.find(
          (r) => r.file === ep.file && r.method === ep.method && ep.pathMatcher.test(r.path)
        );

        if (!matchedRoute) {
          mismatches.push({
            permission: perm,
            endpoint: `[${ep.method}] ${ep.file} (pattern: ${ep.pathMatcher})`,
            matrixRoles: expectedRoles,
            actualRoles: [],
          });
          console.error(`  ❌ Endpoint NOT FOUND in code: [${ep.method}] ${ep.file} matching ${ep.pathMatcher}`);
          continue;
        }

        const actualRoles = [...matchedRoute.roles].sort();
        const isEqual =
          expectedRoles.length === actualRoles.length &&
          expectedRoles.every((r, idx) => r === actualRoles[idx]);

        if (isEqual) {
          matchedCount++;
          console.log(`  ✅ [${matchedRoute.method}] ${matchedRoute.file} ${matchedRoute.path} -> [${actualRoles.join(', ')}] (KHỚP 100%)`);
        } else {
          mismatches.push({
            permission: perm,
            endpoint: `[${matchedRoute.method}] ${matchedRoute.file} ${matchedRoute.path}`,
            matrixRoles: expectedRoles,
            actualRoles,
          });
          console.error(`  ❌ MISMATCH tại [${matchedRoute.method}] ${matchedRoute.file} ${matchedRoute.path}:`);
          console.error(`     - PERMISSION_MATRIX: [${expectedRoles.join(', ')}]`);
          console.error(`     - rolesGuard THỰC TẾ: [${actualRoles.join(', ')}]`);
        }
      }
    }

    // 2. In danh sách Unmapped by design
    console.log('\n----------------------------------------------------------------------');
    console.log(`📋 DANH SÁCH PERMISSION UNMAPPED BY DESIGN (${unmappedList.length}):`);
    unmappedList.forEach((u, idx) => {
      console.log(`   ${idx + 1}. '${u.permission}': ${u.reason}`);
    });

    // 3. In danh sách các routes có rolesGuard nhưng không ánh xạ 1-1 với 10 permission
    const mappedRouteKeys = new Set(
      PERMISSION_ROUTE_MAPPINGS.flatMap((m) =>
        m.endpoints.map((e) => `${e.file}::${e.method}`)
      )
    );
    const additionalGuards = scannedRoutes.filter(
      (r) => !mappedRouteKeys.has(`${r.file}::${r.method}`)
    );
    if (additionalGuards.length > 0) {
      console.log('\n📋 CÁC ROUTE PHỤ TRỢ CÓ ROLESGUARD BẢO VỆ RIÊNG BIỆT:');
      additionalGuards.forEach((g) => {
        console.log(`   - [${g.method}] ${g.file} ${g.path} -> [${g.roles.join(', ')}]`);
      });
    }

    console.log('----------------------------------------------------------------------');
    console.log(`📊 TỔNG KẾT ĐỐI CHIẾU:`);
    console.log(`   - Tổng permissions kiểm tra đối chiếu: ${totalPermissionsChecked}`);
    console.log(`   - Tổng endpoints kiểm tra khớp: ${matchedCount}`);
    console.log(`   - Số lượng unmapped by design: ${unmappedList.length}`);
    console.log(`   - Số lượng mismatch phát hiện: ${mismatches.length}`);
    console.log('======================================================================\n');

    if (mismatches.length > 0) {
      const errDetails = mismatches
        .map(
          (m) =>
            `\n- Permission '${m.permission}' tại ${m.endpoint}:\n  Matrix: [${m.matrixRoles.join(', ')}]\n  Actual: [${m.actualRoles.join(', ')}]`
        )
        .join('');
      assert.fail(`Phát hiện ${mismatches.length} điểm lệch giữa PERMISSION_MATRIX và rolesGuard:${errDetails}`);
    } else {
      console.log('🎉 XÁC NHẬN: PERMISSION_MATRIX VÀ ROLESGUARD KHỚP HOÀN TOÀN 100%!');
    }
  });
});

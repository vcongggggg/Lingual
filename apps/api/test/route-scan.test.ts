import { adminRouter } from '../src/routes/admin.js';

/**
 * Step 8: Route Scanner CI Test
 * Inspects all registered routes in adminRouter to ensure EVERY route has explicit @Roles() configuration.
 * Fails build if any route in AdminModule lacks @Roles().
 */
export function scanAdminRoutesForRolesDecorator(): { total: number; protectedCount: number; unprotected: string[] } {
  const unprotected: string[] = [];
  let total = 0;

  adminRouter.stack.forEach((layer) => {
    if (layer.route) {
      total++;
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();

      // Check handler stack for @Roles metadata or rolesGuard middleware
      const hasRolesDecorator = layer.route.stack.some(
        (stackLayer: any) =>
          stackLayer.handle?._requiredRoles ||
          stackLayer.name === 'rolesGuard' ||
          (stackLayer.handle && stackLayer.handle.name === 'rolesGuard')
      );

      if (!hasRolesDecorator) {
        unprotected.push(`[${methods}] ${path}`);
      }
    }
  });

  return { total, protectedCount: total - unprotected.length, unprotected };
}

// Runnable test assertion
console.log('🔍 Running AdminModule Route Security Scan...');
const result = scanAdminRoutesForRolesDecorator();

console.log(`📊 Scanned ${result.total} routes in AdminModule.`);
console.log(`🛡️  Protected routes with @Roles(): ${result.protectedCount}/${result.total}`);

if (result.unprotected.length > 0) {
  console.error('❌ SECURITY FAILURE: The following AdminModule routes are MISSING @Roles() decorator:');
  result.unprotected.forEach((route) => console.error(`   - ${route}`));
  process.exit(1);
} else {
  console.log('✅ ALL AdminModule routes are strictly protected with @Roles() and Default-Deny RolesGuard!');
}

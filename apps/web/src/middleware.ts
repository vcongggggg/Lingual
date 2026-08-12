import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['vi', 'en'];
const defaultLocale = 'vi';

/**
 * Next.js Middleware for Lingual Frontend
 * NOTE: Frontend middleware redirects are for UX PURPOSES ONLY (preventing flash of unauthorized UI).
 * Real security enforcement is strictly handled by NestJS/Express RolesGuard on backend endpoints.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, mascot stickers, api routes, and _next internals
  if (
    pathname.startsWith('/mascot/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(pathname)
  ) {
    return;
  }

  // UX Guard: Check /admin/* access for STUDENT role
  // Reads auth cookie or token payload if present
  if (pathname.includes('/admin')) {
    const userRole = request.cookies.get('user_role')?.value || '';
    if (userRole === 'STUDENT') {
      // UX Redirect: Redirect STUDENT attempting to visit /admin UI back to dashboard
      const locale = locales.find((loc) => pathname.startsWith(`/${loc}`)) || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  // Check if pathname already starts with a valid locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip static files, api routes, _next, mascot, images
    '/((?!api|_next/static|_next/image|favicon.ico|mascot|images|assets|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)',
  ],
};

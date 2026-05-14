import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'secret'
);

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value || '';

  // 1. Handle Locale first
  const response = intlMiddleware(request);

  // 2. Auth Logic
  // Strip locale for checking paths
  const pathWithoutLocale = path.replace(/^\/(vi|en)/, '') || '/';
  
  const isPublicPath = pathWithoutLocale === '/login' || pathWithoutLocale === '/register';
  const isAdminPath = pathWithoutLocale.startsWith('/admin');
  const isProtectedPath = pathWithoutLocale.startsWith('/profile');

  // If path is public and we have a token, redirect to home
  if (isPublicPath && token) {
    const locale = path.split('/')[1] || 'vi';
    return NextResponse.redirect(new URL(`/${locale}`, request.nextUrl));
  }

  // If path is admin, check for admin role
  if (isAdminPath) {
    if (!token) {
      const locale = path.split('/')[1] || 'vi';
      return NextResponse.redirect(new URL(`/${locale}/login`, request.nextUrl));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== 'admin') {
        const locale = path.split('/')[1] || 'vi';
        return NextResponse.redirect(new URL(`/${locale}`, request.nextUrl));
      }
    } catch (error) {
      const locale = path.split('/')[1] || 'vi';
      return NextResponse.redirect(new URL(`/${locale}/login`, request.nextUrl));
    }
  }

  if (isProtectedPath && !token) {
    const locale = path.split('/')[1] || 'vi';
    return NextResponse.redirect(new URL(`/${locale}/login`, request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /_static (inside /public)
    // - all root files inside /public (e.g. /favicon.ico)
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

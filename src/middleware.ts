import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value || '';

  const isPublicPath = path === '/login' || path === '/register';

  // If path is public and we have a token, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // If path is protected and we don't have a token, redirect to login
  // Add protected routes here (e.g., /profile, /orders, /admin)
  const isProtectedPath = path.startsWith('/profile') || path.startsWith('/admin');
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};

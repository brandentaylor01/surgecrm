import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // 1. If not logged in and trying to view the site, bounce to /login
  if (!sessionToken && !pathname.startsWith('/login') && !pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If already logged in and going to /login, send them straight to the dashboard
  if (sessionToken && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all pages except authentication APIs and static system assets
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

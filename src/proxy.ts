import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session');
  const url = request.nextUrl.clone();

  // 1. If not logged in and trying to view the site, redirect to /login
  if (!sessionToken && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/api/auth')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. If already logged in and going to /login, redirect straight to the dashboard
  if (sessionToken && url.pathname.startsWith('/login')) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

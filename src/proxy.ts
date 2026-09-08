import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session');
  const url = request.nextUrl.clone();

  if (!sessionToken && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/api/')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (sessionToken && url.pathname.startsWith('/login')) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

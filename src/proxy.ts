import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define public and auth-only paths
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');

  // 1. Redirect unauthenticated users to login if they try to access dashboard
  if (isDashboardPage && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // You can optionally add a redirect search param
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from auth pages (login)
  if (isAuthPage && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};

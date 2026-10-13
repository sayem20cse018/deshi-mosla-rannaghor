import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED = [
  '/account',
  '/checkout',
  '/order',
];

// Routes that redirect logged-in users away
const AUTH_ONLY = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // If accessing a protected route without token → redirect to login
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If accessing auth routes while already logged in → redirect to account
  const isAuthOnly = AUTH_ONLY.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (isAuthOnly && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/account';
    url.searchParams.delete('redirect');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/order/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};

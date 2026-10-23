import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — only protects /account/* routes.
 * Checkout, cart, product pages are open to ALL users including guests.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // /account/* requires login
  if (pathname.startsWith('/account')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Auth pages (/login, /register) redirect to account if already logged in
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (authPages.some((p) => pathname === p) && token) {
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
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
  // NOTE: /checkout, /cart, /product, /order are intentionally NOT in matcher
  // so guests can access them freely without any auth check
};

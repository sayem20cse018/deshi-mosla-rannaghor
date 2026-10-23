import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Request interceptor -- attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  (error) => Promise.reject(error),
);

// Routes where 401 should silently fail (guest access allowed)
const GUEST_ALLOWED_PATTERNS = [
  '/cart',
  '/cart/',
  '/orders/guest',
  '/orders/meta',
  '/products',
  '/categories',
  '/brands',
  '/coupons/validate',
  '/auth/me',
];

// Pages where 401 should never trigger redirect (guest-accessible pages)
const GUEST_PAGES = ['/checkout', '/cart', '/shop', '/category', '/product', '/order-tracking'];


function isGuestAllowed(url: string): boolean {
  if (!url) return false;
  return GUEST_ALLOWED_PATTERNS.some((p) => url.includes(p));
}

// Response interceptor -- only redirect to login for auth-required routes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      const requestUrl = error.config?.url ?? '';
      const pathname   = window.location.pathname;

      // Never redirect if already on login/admin pages
      const onLoginPage = pathname.startsWith('/login') || pathname.startsWith('/admin');
      const onGuestPage = GUEST_PAGES.some((p) => pathname.startsWith(p));
      // Never redirect for guest-allowed endpoints (cart sync, product API etc.)
      const guestOk = isGuestAllowed(requestUrl);

      if (!onLoginPage && !onGuestPage && !guestOk) {
        Cookies.remove('access_token');
        window.location.href = '/login?redirect=' + encodeURIComponent(pathname);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
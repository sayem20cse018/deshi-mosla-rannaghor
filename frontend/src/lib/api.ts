import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Request interceptor — attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  (error) => Promise.reject(error),
);

// Pages that REQUIRE login — 401 here should redirect to login
const AUTH_REQUIRED_PAGES = [
  '/account/profile',
  '/account/settings',
  '/account/addresses',
  '/account/orders',
  '/account/reviews',
  '/account/wishlist',
  '/account/coupons',
  '/account/payment-history',
];

// Response interceptor — only redirect on 401 for explicit account pages
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      const pathname = window.location.pathname;

      // Only redirect if user is on an account page that truly requires login
      const needsLogin = AUTH_REQUIRED_PAGES.some((p) => pathname.startsWith(p));

      if (needsLogin) {
        Cookies.remove('access_token');
        window.location.href = '/login?redirect=' + encodeURIComponent(pathname);
      }
      // For ALL other pages (checkout, cart, product, home etc.) — just reject silently
    }
    return Promise.reject(error);
  },
);

export default api;

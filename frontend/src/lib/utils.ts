import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price as ৳1,200 */
export function formatPriceEn(amount: number | string | null | undefined): string {
  if (amount == null) return '৳০';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '৳০';
  return `৳${num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/** Format price in Bengali numerals */
export function formatPriceBn(amount: number): string {
  const map: Record<string, string> = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  };
  return `৳${amount
    .toFixed(0)
    .split('')
    .map((c) => map[c] ?? c)
    .join('')}`;
}

/** Discount percentage */
export function calcDiscount(price: number, discountPrice: number): number {
  if (price <= 0) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

/** Truncate text */
export function truncate(text: string, length = 100): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '...';
}

/** WhatsApp URL */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, '');
  const msg = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${clean}${msg}`;
}

/** Rating stars breakdown */
export function ratingBreakdown(rating: number) {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.4;
  const empty = 5 - filled - (half ? 1 : 0);
  return { filled, half, empty };
}

/** Sleep helper */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

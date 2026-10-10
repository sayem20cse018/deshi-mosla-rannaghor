import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in BDT */
export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `৳${num.toLocaleString('bn-BD')}`;
}

/** Format price in BDT (English numerals) */
export function formatPriceEn(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `৳${num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/** Calculate discount percentage */
export function calcDiscount(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

/** Truncate text */
export function truncate(text: string, length = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/** Generate WhatsApp URL */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

/** Rating to stars */
export function ratingToStars(rating: number): { filled: number; half: boolean; empty: number } {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  return { filled, half, empty };
}

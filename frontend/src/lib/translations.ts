import type { Lang } from '@/store/language.store';

// ── Translation dictionary ─────────────────────────────────
const T = {
  // Navigation labels
  home: { bn: 'হোম', en: 'Home' },
  blog: { bn: 'ব্লগ', en: 'Blog' },
  shop: { bn: 'শপ', en: 'Shop' },
  categories: { bn: 'ক্যাটাগরি', en: 'Categories' },
  offers: { bn: 'অফার', en: 'Offers' },
  recipes: { bn: 'রেসিপি', en: 'Recipes' },
  about: { bn: 'আমাদের পরিচয়', en: 'About Us' },
  allProducts: { bn: 'সব পণ্য', en: 'All Products' },
  more: { bn: 'আরও', en: 'More' },

  // Header actions
  trackOrder: { bn: 'অর্ডার ট্র্যাক', en: 'Track Order' },
  myAccount: { bn: 'আমার অ্যাকাউন্ট', en: 'My Account' },
  login: { bn: 'লগইন', en: 'Login' },
  register: { bn: 'নিবন্ধন', en: 'Register' },
  logout: { bn: 'লগআউট', en: 'Logout' },
  wishlist: { bn: 'উইশলিস্ট', en: 'Wishlist' },
  cart: { bn: 'কার্ট', en: 'Cart' },
  search: { bn: 'পণ্য খুঁজুন…', en: 'Search products…' },
  viewAllCats: { bn: 'সব ক্যাটাগরি দেখুন →', en: 'View all categories →' },

  // Language switcher
  langBn: { bn: 'বাংলা', en: 'বাংলা' },
  langEn: { bn: 'English', en: 'English' },
  language: { bn: 'ভাষা', en: 'Language' },

  // Announcement bar
  ann1: {
    bn: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি',
    en: 'Free delivery on orders over ৳1000 nationwide',
  },
  ann2: {
    bn: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়',
    en: 'Code WELCOME10 — 10% off for new customers',
  },
  ann3: { bn: 'ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ', en: 'Cash on Delivery available' },
  ann4: {
    bn: 'ঢাকায় একইদিন ডেলিভারি — সকাল ১১টার আগে',
    en: 'Same-day delivery in Dhaka — order before 11 AM',
  },

  // Account dropdown
  myOrders: { bn: 'আমার অর্ডার', en: 'My Orders' },
  savedAddr: { bn: 'সংরক্ষিত ঠিকানা', en: 'Saved Addresses' },
  adminPanel: { bn: 'Admin Panel', en: 'Admin Panel' },
  close: { bn: 'বন্ধ করুন', en: 'Close' },
  menu: { bn: 'মেনু', en: 'Menu' },
} as const;

export type TranslationKey = keyof typeof T;

/** Get translated string */
export function t(key: TranslationKey, lang: Lang): string {
  return T[key]?.[lang] ?? T[key]?.bn ?? key;
}

/** Get display name from category object */
export function catName(category: { name: string; nameEn?: string | null }, lang: Lang): string {
  if (lang === 'en' && category.nameEn) return category.nameEn;
  return category.name;
}

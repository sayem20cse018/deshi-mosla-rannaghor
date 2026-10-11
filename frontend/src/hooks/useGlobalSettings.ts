'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface GlobalSettings {
  // Store
  storeName:    string;
  storeNameEn:  string;
  storeEmail:   string;
  storePhone:   string;
  storePhone2:  string;
  storeAddress: string;
  storeWhatsapp: string;
  // Brand
  logoUrl:      string;
  logoMobile:   string;
  faviconUrl:   string;
  logoText:     string;
  logoTextEn:   string;
  tagline:      string;
  // Social
  facebook:     string;
  instagram:    string;
  youtube:      string;
  twitter:      string;
}

const FALLBACK: GlobalSettings = {
  storeName:    'দেশি মসলার রান্নাঘর',
  storeNameEn:  'Deshi Moslar Rannaghar',
  storeEmail:   'info@deshimoslar.com',
  storePhone:   '+880 1700-000000',
  storePhone2:  '',
  storeAddress: 'Dhaka, Bangladesh',
  storeWhatsapp: '+880 1700-000000',
  logoUrl:      '',
  logoMobile:   '',
  faviconUrl:   '',
  logoText:     'দেশি মসলার রান্নাঘর',
  logoTextEn:   'Deshi Moslar',
  tagline:      '100% authentic deshi products',
  facebook:     'https://facebook.com/deshimoslar',
  instagram:    'https://instagram.com/deshimoslar',
  youtube:      'https://youtube.com/deshimoslar',
  twitter:      '',
};

function mapSettings(settings: { key: string; value: string }[]): GlobalSettings {
  const m: Record<string, string> = {};
  settings.forEach(s => { m[s.key] = s.value; });
  return {
    storeName:     m['store.name']        || FALLBACK.storeName,
    storeNameEn:   m['store.name_en']     || FALLBACK.storeNameEn,
    storeEmail:    m['store.email']       || FALLBACK.storeEmail,
    storePhone:    m['store.phone']       || FALLBACK.storePhone,
    storePhone2:   m['store.phone2']      || '',
    storeAddress:  m['store.address']     || FALLBACK.storeAddress,
    storeWhatsapp: m['store.whatsapp']    || FALLBACK.storeWhatsapp,
    logoUrl:       m['brand.logo']        || '',
    logoMobile:    m['brand.logo_mobile'] || '',
    faviconUrl:    m['brand.favicon']     || '',
    logoText:      m['brand.logo_text']   || FALLBACK.logoText,
    logoTextEn:    m['brand.logo_text_en']|| FALLBACK.logoTextEn,
    tagline:       m['brand.tagline']     || FALLBACK.tagline,
    facebook:      m['social.facebook']   || FALLBACK.facebook,
    instagram:     m['social.instagram']  || FALLBACK.instagram,
    youtube:       m['social.youtube']    || FALLBACK.youtube,
    twitter:       m['social.twitter']    || '',
  };
}

/** Fetches all branding/store/social settings in one call. Uses fallback if API unavailable. */
export function useGlobalSettings() {
  return useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      const settings: { key: string; value: string }[] = data?.data?.settings ?? [];
      return mapSettings(settings);
    },
    staleTime: 300_000, // 5 minutes
    placeholderData: FALLBACK,
  });
}

export { FALLBACK as DEFAULT_SETTINGS };
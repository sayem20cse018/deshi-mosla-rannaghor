import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

// Default settings seeded on first GET
const DEFAULTS: Record<string, { value: string; description: string; group: string }> = {
  'store.name':         { value: 'দেশি মসলার রান্নাঘর', description: 'Store name (Bengali)', group: 'store' },
  'store.name_en':      { value: 'Deshi Moslar Rannaghar', description: 'Store name (English)', group: 'store' },
  'store.email':        { value: 'info@deshimoslar.com', description: 'Store contact email', group: 'store' },
  'store.phone':        { value: '+880 1700-000000', description: 'Store contact phone', group: 'store' },
  'store.address':      { value: 'Dhaka, Bangladesh', description: 'Store address', group: 'store' },
  'store.currency':     { value: 'BDT', description: 'Currency code', group: 'store' },
  'store.currency_symbol': { value: '৳', description: 'Currency symbol', group: 'store' },
  'store.whatsapp':     { value: '+880 1700-000000', description: 'WhatsApp support number', group: 'store' },
  // Brand
  'brand.logo':         { value: '', description: 'Desktop logo URL (Cloudinary)', group: 'brand' },
  'brand.logo_mobile':  { value: '', description: 'Mobile logo URL (Cloudinary)', group: 'brand' },
  'brand.favicon':      { value: '', description: 'Favicon URL (Cloudinary)', group: 'brand' },
  'brand.logo_text':    { value: 'দেশি মসলার রান্নাঘর', description: 'Logo text (fallback)', group: 'brand' },
  'brand.logo_text_en': { value: 'Deshi Moslar', description: 'Logo text English', group: 'brand' },
  'brand.tagline':      { value: '100% authentic deshi products', description: 'Brand tagline', group: 'brand' },
  // Social
  'social.facebook':    { value: 'https://facebook.com/deshimoslar', description: 'Facebook URL', group: 'social' },
  'social.instagram':   { value: 'https://instagram.com/deshimoslar', description: 'Instagram URL', group: 'social' },
  'social.youtube':     { value: 'https://youtube.com/deshimoslar', description: 'YouTube URL', group: 'social' },
  'social.twitter':     { value: '', description: 'Twitter/X URL', group: 'social' },
  'seo.meta_title':     { value: 'দেশি মসলার রান্নাঘর | Deshi Moslar Rannaghar', description: 'Default SEO title', group: 'seo' },
  'seo.meta_desc':      { value: 'বাংলাদেশের বিশ্বস্ত অনলাইন মসলা ও গ্রোসারি শপ।', description: 'Default meta description', group: 'seo' },
  'seo.keywords':       { value: 'মসলা, grocery, online shop, Bangladesh', description: 'SEO keywords', group: 'seo' },
  'tax.rate':           { value: '0', description: 'Tax rate (%)', group: 'tax' },
  'tax.enabled':        { value: 'false', description: 'Enable tax calculation', group: 'tax' },
  'delivery.free_threshold': { value: '1000', description: 'Free delivery above this amount (৳)', group: 'delivery' },
  'delivery.default_charge': { value: '60', description: 'Default delivery charge (৳)', group: 'delivery' },
  'payment.cod_enabled':     { value: 'true', description: 'Enable Cash on Delivery', group: 'payment' },
  'payment.ssl_enabled':     { value: 'true', description: 'Enable SSLCommerz payments', group: 'payment' },
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(group?: string) {
    // Seed defaults for missing keys
    for (const [key, def] of Object.entries(DEFAULTS)) {
      await this.prisma.siteSettings.upsert({
        where: { key },
        create: { key, value: def.value, description: def.description, group: def.group },
        update: {},
      });
    }

    const settings = await this.prisma.siteSettings.findMany({
      where: group ? { group } : undefined,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    // Return as grouped object
    const grouped: Record<string, Record<string, string>> = {};
    for (const s of settings) {
      const g = s.group ?? 'general';
      if (!grouped[g]) grouped[g] = {};
      grouped[g][s.key.split('.')[1] ?? s.key] = s.value;
    }

    return { success: true, data: { settings, grouped } };
  }

  async get(key: string) {
    const setting = await this.prisma.siteSettings.findUnique({ where: { key } });
    return { success: true, data: setting };
  }

  async set(key: string, value: string) {
    const def = DEFAULTS[key];
    const result = await this.prisma.siteSettings.upsert({
      where: { key },
      create: { key, value, description: def?.description, group: def?.group },
      update: { value },
    });
    return { success: true, data: result };
  }

  async setBulk(items: { key: string; value: string }[]) {
    const results = await Promise.all(items.map(({ key, value }) => this.set(key, value)));
    return { success: true, data: results.map(r => r.data), message: `${items.length} settings saved.` };
  }
}
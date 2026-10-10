import { PrismaClient, AdminRole, StockStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────────────
function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sku(prefix: string, n: number) {
  return `DMR-${prefix}-${String(n).padStart(4, '0')}`;
}

async function main() {
  console.log('\n🌱 দেশি মসলার রান্নাঘর — Seeding database...\n');

  // ════════════════════════════════════════════════════
  // 1. ADMINS
  // ════════════════════════════════════════════════════
  const hash12 = (pw: string) => bcrypt.hash(pw, 12);

  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@deshimoslar.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@deshimoslar.com',
      password: await hash12('Admin@123456'),
      role: AdminRole.SUPER_ADMIN,
    },
  });

  await prisma.admin.upsert({
    where: { email: 'manager@deshimoslar.com' },
    update: {},
    create: {
      name: 'ম্যানেজার রাহেলা',
      email: 'manager@deshimoslar.com',
      password: await hash12('Manager@123'),
      role: AdminRole.MANAGER,
    },
  });

  console.log('✅ Admins created');

  // ════════════════════════════════════════════════════
  // 2. TEST USERS
  // ════════════════════════════════════════════════════
  const testUser = await prisma.user.upsert({
    where: { email: 'rahim@test.com' },
    update: {},
    create: {
      name: 'মোঃ রহিম উদ্দিন',
      email: 'rahim@test.com',
      phone: '01711111111',
      password: await hash12('Customer@123'),
      isEmailVerified: true,
      isPhoneVerified: true,
      cart: { create: {} },
    },
  });

  await prisma.user.upsert({
    where: { email: 'karima@test.com' },
    update: {},
    create: {
      name: 'করিমা বেগম',
      email: 'karima@test.com',
      phone: '01722222222',
      password: await hash12('Customer@123'),
      isEmailVerified: true,
      cart: { create: {} },
    },
  });

  console.log('✅ Test users created');

  // ════════════════════════════════════════════════════
  // 3. CATEGORIES
  // ════════════════════════════════════════════════════
  const categoryData = [
    { name: 'মসলা',          nameEn: 'Spices',            slug: 'mosla',         icon: '🌶️', sortOrder: 1  },
    { name: 'তেল',           nameEn: 'Cooking Oil',        slug: 'tel',           icon: '🫙', sortOrder: 2  },
    { name: 'চাল',           nameEn: 'Rice',               slug: 'chal',          icon: '🍚', sortOrder: 3  },
    { name: 'ডাল',           nameEn: 'Lentils',            slug: 'dal',           icon: '🫘', sortOrder: 4  },
    { name: 'আটা ও ময়দা',   nameEn: 'Flour',              slug: 'ata-maida',     icon: '🌾', sortOrder: 5  },
    { name: 'লবণ',           nameEn: 'Salt',               slug: 'lobon',         icon: '🧂', sortOrder: 6  },
    { name: 'চিনি ও গুড়',   nameEn: 'Sugar & Molasses',  slug: 'chini-gur',     icon: '🍯', sortOrder: 7  },
    { name: 'চা ও কফি',      nameEn: 'Tea & Coffee',       slug: 'cha-kofi',      icon: '☕', sortOrder: 8  },
    { name: 'স্ন্যাকস',      nameEn: 'Snacks',             slug: 'snacks',        icon: '🍿', sortOrder: 9  },
    { name: 'নুডলস',         nameEn: 'Noodles',            slug: 'noodles',       icon: '🍜', sortOrder: 10 },
    { name: 'সস ও আচার',     nameEn: 'Sauce & Pickle',     slug: 'sauce-achar',   icon: '🫙', sortOrder: 11 },
    { name: 'মধু',           nameEn: 'Honey',              slug: 'modhu',         icon: '🍯', sortOrder: 12 },
    { name: 'রান্নার পণ্য',  nameEn: 'Cooking Items',      slug: 'cooking-items', icon: '🥘', sortOrder: 13 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        nameEn: cat.nameEn,
        slug: cat.slug,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categories[cat.slug] = c.id;
  }

  // Sub-categories under মসলা
  const subSpices = [
    { name: 'গুঁড়া মসলা',   nameEn: 'Ground Spices',   slug: 'gura-mosla'    },
    { name: 'আস্ত মসলা',    nameEn: 'Whole Spices',    slug: 'asto-mosla'    },
    { name: 'মিক্স মসলা',   nameEn: 'Mixed Spices',   slug: 'mix-mosla'     },
  ];
  for (const sub of subSpices) {
    const c = await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { ...sub, parentId: categories['mosla'], isActive: true, sortOrder: 0 },
    });
    categories[sub.slug] = c.id;
  }

  console.log(`✅ ${categoryData.length + subSpices.length} categories created`);

  // ════════════════════════════════════════════════════
  // 4. BRANDS
  // ════════════════════════════════════════════════════
  const brandData = [
    { name: 'রাঁধুনী',        nameEn: 'Radhuni',     slug: 'radhuni'     },
    { name: 'প্রাণ',          nameEn: 'PRAN',        slug: 'pran'        },
    { name: 'বিডি ফুড',       nameEn: 'BD Food',     slug: 'bd-food'     },
    { name: 'ফ্রেশ',          nameEn: 'Fresh',       slug: 'fresh'       },
    { name: 'মেঘনা',          nameEn: 'Meghna',      slug: 'meghna'      },
    { name: 'এসিআই',          nameEn: 'ACI',         slug: 'aci'         },
    { name: 'ইগলু',           nameEn: 'Igloo',       slug: 'igloo'       },
    { name: 'দেশি মসলার রান্নাঘর', nameEn: 'Deshi Moslar Rannaghar', slug: 'deshi-moslar' },
    { name: 'সানি',           nameEn: 'Sunny',       slug: 'sunny'       },
    { name: 'তীর',            nameEn: 'Teer',        slug: 'teer'        },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ...b, isActive: true },
    });
    brands[b.slug] = brand.id;
  }
  console.log(`✅ ${brandData.length} brands created`);

  // ════════════════════════════════════════════════════
  // 5. PRODUCTS (60 realistic Bangladeshi products)
  // ════════════════════════════════════════════════════
  type ProductSeed = {
    name: string; nameEn?: string; sku: string; categorySlug: string;
    brandSlug?: string; description?: string; ingredients?: string;
    usage?: string; storageInfo?: string; origin?: string;
    weight: string; price: number; discountPrice?: number;
    stock: number; isBestSeller?: boolean; isFeatured?: boolean;
    isNewArrival?: boolean; tags: string[];
  };

  const productSeedData: ProductSeed[] = [
    // ── গুঁড়া মসলা ───────────────────────────────────
    {
      name: 'ধনে গুঁড়া (দেশি)', nameEn: 'Coriander Powder',
      sku: sku('MSL', 1), categorySlug: 'gura-mosla', brandSlug: 'radhuni',
      description: 'খাঁটি দেশি ধনিয়া থেকে তৈরি সুগন্ধি গুঁড়া মসলা। রান্নার স্বাদ বাড়ায়।',
      ingredients: '১০০% খাঁটি দেশি ধনিয়া', usage: 'তরকারি, মাছ, মাংস রান্নায় ব্যবহার করুন',
      storageInfo: 'ঠান্ডা ও শুকনো স্থানে রাখুন', origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 130, discountPrice: 110, stock: 150,
      isBestSeller: true, isFeatured: true, tags: ['মসলা', 'ধনে', 'গুঁড়া', 'দেশি'],
    },
    {
      name: 'মরিচ গুঁড়া (তীক্ষ্ণ)', nameEn: 'Red Chili Powder',
      sku: sku('MSL', 2), categorySlug: 'gura-mosla', brandSlug: 'radhuni',
      description: 'ঝাল ও সুগন্ধি মরিচ গুঁড়া। তরকারিতে রং ও ঝাল বাড়ায়।',
      ingredients: '১০০% শুকনো লাল মরিচ', usage: 'সব ধরনের তরকারিতে',
      storageInfo: 'আর্দ্রতামুক্ত স্থানে রাখুন', origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 160, discountPrice: 140, stock: 200,
      isBestSeller: true, tags: ['মরিচ', 'ঝাল', 'গুঁড়া'],
    },
    {
      name: 'হলুদ গুঁড়া (খাঁটি)', nameEn: 'Turmeric Powder',
      sku: sku('MSL', 3), categorySlug: 'gura-mosla', brandSlug: 'deshi-moslar',
      description: 'কৃত্রিম রং ছাড়া খাঁটি হলুদ গুঁড়া। রান্নায় সোনালি রং আনে।',
      ingredients: '১০০% প্রাকৃতিক হলুদ', usage: 'মাছ, মাংস, সবজি রান্নায়',
      storageInfo: 'শুকনো স্থানে রাখুন', origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 90, discountPrice: 75, stock: 300,
      isBestSeller: true, isFeatured: true, tags: ['হলুদ', 'গুঁড়া', 'খাঁটি'],
    },
    {
      name: 'জিরা গুঁড়া', nameEn: 'Cumin Powder',
      sku: sku('MSL', 4), categorySlug: 'gura-mosla', brandSlug: 'radhuni',
      description: 'সুগন্ধি জিরা গুঁড়া। বিরিয়ানি ও কারিতে অপরিহার্য।',
      ingredients: '১০০% জিরা', origin: 'বাংলাদেশ',
      weight: '২৫০ গ্রাম', price: 120, stock: 180,
      isFeatured: true, tags: ['জিরা', 'মসলা'],
    },
    {
      name: 'গরম মসলা গুঁড়া', nameEn: 'Garam Masala Powder',
      sku: sku('MSL', 5), categorySlug: 'mix-mosla', brandSlug: 'radhuni',
      description: 'এলাচ, দারুচিনি, লবঙ্গ, গোলমরিচের সুনির্দিষ্ট মিশ্রণ।',
      ingredients: 'এলাচ, দারুচিনি, লবঙ্গ, গোলমরিচ, জায়ফল', origin: 'বাংলাদেশ',
      weight: '১০০ গ্রাম', price: 150, discountPrice: 130, stock: 120,
      isBestSeller: true, tags: ['গরম মসলা', 'মিক্স'],
    },
    {
      name: 'কারি মসলা (বিশেষ)', nameEn: 'Special Curry Masala',
      sku: sku('MSL', 6), categorySlug: 'mix-mosla', brandSlug: 'deshi-moslar',
      description: 'বিশেষ রেসিপিতে তৈরি কারি মসলা। যেকোনো তরকারিতে অসাধারণ স্বাদ।',
      ingredients: 'ধনে, জিরা, হলুদ, মরিচ, এলাচ ও আরও মসলা', origin: 'বাংলাদেশ',
      weight: '১৫০ গ্রাম', price: 180, discountPrice: 155, stock: 100,
      isBestSeller: true, isFeatured: true, tags: ['কারি', 'মসলা'],
    },
    {
      name: 'বিরিয়ানি মসলা', nameEn: 'Biryani Masala',
      sku: sku('MSL', 7), categorySlug: 'mix-mosla', brandSlug: 'radhuni',
      description: 'আসল বিরিয়ানির জন্য পারফেক্ট মসলার মিশ্রণ।',
      ingredients: 'কেওড়া, গোলাপজল, জাফরান, গরম মসলা, আদা', origin: 'বাংলাদেশ',
      weight: '৫০ গ্রাম', price: 80, stock: 200,
      isBestSeller: true, tags: ['বিরিয়ানি', 'মসলা'],
    },
    {
      name: 'মাংসের মসলা', nameEn: 'Meat Masala',
      sku: sku('MSL', 8), categorySlug: 'mix-mosla', brandSlug: 'deshi-moslar',
      description: 'গরু ও খাসির মাংস রান্নার জন্য বিশেষভাবে তৈরি মসলা।',
      ingredients: 'আদা, রসুন, পেঁয়াজ, মরিচ, ধনে, হলুদ ও সিক্রেট মসলা', origin: 'বাংলাদেশ',
      weight: '১৫০ গ্রাম', price: 175, stock: 90,
      isFeatured: true, tags: ['মাংস', 'মসলা', 'গরু', 'খাসি'],
    },

    // ── আস্ত মসলা ─────────────────────────────────────
    {
      name: 'এলাচ (সবুজ)', nameEn: 'Green Cardamom',
      sku: sku('MSL', 9), categorySlug: 'asto-mosla', brandSlug: 'deshi-moslar',
      description: 'সুগন্ধি সবুজ এলাচ। চা, মিষ্টি ও বিরিয়ানিতে ব্যবহার হয়।',
      ingredients: '১০০% প্রাকৃতিক সবুজ এলাচ', origin: 'বাংলাদেশ',
      weight: '৫০ গ্রাম', price: 200, discountPrice: 180, stock: 80,
      tags: ['এলাচ', 'আস্ত', 'মসলা'],
    },
    {
      name: 'দারুচিনি', nameEn: 'Cinnamon Stick',
      sku: sku('MSL', 10), categorySlug: 'asto-mosla', brandSlug: 'deshi-moslar',
      description: 'খাঁটি দেশি দারুচিনি। রান্নায় অনন্য সুবাস আনে।',
      ingredients: '১০০% প্রাকৃতিক দারুচিনি', origin: 'বাংলাদেশ',
      weight: '১০০ গ্রাম', price: 90, stock: 150,
      tags: ['দারুচিনি', 'আস্ত', 'মসলা'],
    },
    {
      name: 'লবঙ্গ', nameEn: 'Cloves',
      sku: sku('MSL', 11), categorySlug: 'asto-mosla', brandSlug: 'deshi-moslar',
      description: 'সুগন্ধি লবঙ্গ। রান্না ও চায়ে ব্যবহৃত হয়।',
      ingredients: '১০০% প্রাকৃতিক লবঙ্গ', origin: 'বাংলাদেশ',
      weight: '৫০ গ্রাম', price: 130, stock: 100,
      tags: ['লবঙ্গ', 'আস্ত', 'মসলা'],
    },
    {
      name: 'গোলমরিচ (কালো)', nameEn: 'Black Pepper',
      sku: sku('MSL', 12), categorySlug: 'asto-mosla', brandSlug: 'deshi-moslar',
      description: 'আস্ত কালো গোলমরিচ। রান্নায় তীব্র ঝাল ও সুগন্ধ দেয়।',
      ingredients: '১০০% প্রাকৃতিক গোলমরিচ', origin: 'বাংলাদেশ',
      weight: '১০০ গ্রাম', price: 160, stock: 120,
      isNewArrival: true, tags: ['গোলমরিচ', 'কালো', 'আস্ত'],
    },

    // ── তেল ──────────────────────────────────────────
    {
      name: 'সরিষার তেল (ঘানি ভাঙা)', nameEn: 'Cold Press Mustard Oil',
      sku: sku('TEL', 1), categorySlug: 'tel', brandSlug: 'deshi-moslar',
      description: 'ঐতিহ্যবাহী পদ্ধতিতে তেঁতুল কাঠের ঘানিতে ভাঙা খাঁটি সরিষার তেল। তীব্র সুবাস ও স্বাদ।',
      ingredients: '১০০% দেশি সরিষা', usage: 'রান্না, ভর্তা, আচার তৈরিতে',
      storageInfo: 'ঠান্ডা ও অন্ধকার স্থানে রাখুন', origin: 'বাংলাদেশ',
      weight: '১ লিটার', price: 280, discountPrice: 250, stock: 200,
      isBestSeller: true, isFeatured: true, tags: ['সরিষার তেল', 'ঘানি', 'খাঁটি'],
    },
    {
      name: 'সয়াবিন তেল', nameEn: 'Soybean Oil',
      sku: sku('TEL', 2), categorySlug: 'tel', brandSlug: 'teer',
      description: 'পরিশোধিত সয়াবিন তেল। রান্নার জন্য সর্বোত্তম।',
      ingredients: 'রিফাইন্ড সয়াবিন তেল', origin: 'বাংলাদেশ',
      weight: '৫ লিটার', price: 850, discountPrice: 790, stock: 100,
      isBestSeller: true, tags: ['সয়াবিন তেল', 'রান্না'],
    },
    {
      name: 'নারকেল তেল (খাঁটি)', nameEn: 'Pure Coconut Oil',
      sku: sku('TEL', 3), categorySlug: 'tel', brandSlug: 'deshi-moslar',
      description: 'খাঁটি নারকেল তেল। রান্না ও ত্বকের যত্নে ব্যবহারযোগ্য।',
      ingredients: '১০০% প্রাকৃতিক নারকেল', origin: 'বাংলাদেশ',
      weight: '৫০০ মিলি', price: 320, stock: 80,
      isNewArrival: true, isFeatured: true, tags: ['নারকেল তেল', 'খাঁটি'],
    },

    // ── চাল ───────────────────────────────────────────
    {
      name: 'মিনিকেট চাল (প্রিমিয়াম)', nameEn: 'Premium Miniket Rice',
      sku: sku('CHL', 1), categorySlug: 'chal', brandSlug: 'fresh',
      description: 'সুন্দরবন অঞ্চলের প্রিমিয়াম মিনিকেট চাল। ভাত রান্নায় অতুলনীয় স্বাদ।',
      ingredients: '১০০% প্রাকৃতিক মিনিকেট ধান', origin: 'খুলনা, বাংলাদেশ',
      weight: '৫ কেজি', price: 350, discountPrice: 320, stock: 120,
      isBestSeller: true, isFeatured: true, tags: ['মিনিকেট', 'চাল', 'ভাত'],
    },
    {
      name: 'নাজিরশাইল চাল', nameEn: 'Nazirshail Rice',
      sku: sku('CHL', 2), categorySlug: 'chal', brandSlug: 'fresh',
      description: 'সুগন্ধি নাজিরশাইল চাল। পোলাও ও বিশেষ রান্নার জন্য পারফেক্ট।',
      ingredients: '১০০% প্রাকৃতিক নাজিরশাইল ধান', origin: 'দিনাজপুর, বাংলাদেশ',
      weight: '৫ কেজি', price: 420, discountPrice: 390, stock: 80,
      isFeatured: true, tags: ['নাজিরশাইল', 'সুগন্ধি', 'পোলাও'],
    },
    {
      name: 'বাসমতি চাল (ইন্ডিয়ান)', nameEn: 'Basmati Rice',
      sku: sku('CHL', 3), categorySlug: 'chal', brandSlug: 'fresh',
      description: 'দীর্ঘ দানার সুগন্ধি বাসমতি চাল। বিরিয়ানির জন্য আদর্শ।',
      origin: 'ইম্পোর্টেড',
      weight: '১ কেজি', price: 180, stock: 150,
      isNewArrival: true, tags: ['বাসমতি', 'বিরিয়ানি', 'সুগন্ধি'],
    },
    {
      name: 'পোলাও চাল', nameEn: 'Polao Rice',
      sku: sku('CHL', 4), categorySlug: 'chal', brandSlug: 'pran',
      description: 'বিশেষভাবে নির্বাচিত পোলাও চাল। উৎসব ও অনুষ্ঠানের জন্য।',
      origin: 'বাংলাদেশ',
      weight: '১ কেজি', price: 150, stock: 200,
      isBestSeller: true, tags: ['পোলাও', 'চাল', 'উৎসব'],
    },

    // ── ডাল ───────────────────────────────────────────
    {
      name: 'মসুর ডাল (লাল)', nameEn: 'Red Lentil',
      sku: sku('DAL', 1), categorySlug: 'dal', brandSlug: 'pran',
      description: 'পরিষ্কার ও মোটা দানার লাল মসুর ডাল। দ্রুত সিদ্ধ হয়।',
      ingredients: '১০০% প্রাকৃতিক মসুর ডাল', origin: 'বাংলাদেশ',
      weight: '১ কেজি', price: 130, discountPrice: 115, stock: 300,
      isBestSeller: true, tags: ['মসুর', 'ডাল', 'লাল'],
    },
    {
      name: 'ছোলার ডাল', nameEn: 'Bengal Gram Dal',
      sku: sku('DAL', 2), categorySlug: 'dal', brandSlug: 'fresh',
      description: 'মোটা ও পুষ্টিকর ছোলার ডাল। হালুয়া ও তরকারিতে ব্যবহৃত।',
      origin: 'বাংলাদেশ',
      weight: '১ কেজি', price: 140, stock: 200,
      tags: ['ছোলার', 'ডাল', 'হালুয়া'],
    },
    {
      name: 'মুগ ডাল (ভাঙা)', nameEn: 'Split Mung Dal',
      sku: sku('DAL', 3), categorySlug: 'dal', brandSlug: 'pran',
      description: 'পাতলা ও হালকা মুগ ডাল। খিচুড়ি ও শিশু খাবারে আদর্শ।',
      origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 90, stock: 250,
      isBestSeller: true, tags: ['মুগ', 'ডাল', 'খিচুড়ি'],
    },
    {
      name: 'মটর ডাল', nameEn: 'Yellow Split Peas',
      sku: sku('DAL', 4), categorySlug: 'dal', brandSlug: 'fresh',
      description: 'হলুদ মটর ডাল। ডালপুরি ও তরকারির জন্য।',
      origin: 'বাংলাদেশ',
      weight: '১ কেজি', price: 110, stock: 180,
      tags: ['মটর', 'ডাল'],
    },

    // ── আটা ও ময়দা ────────────────────────────────────
    {
      name: 'গমের আটা (সাদা)', nameEn: 'Wheat Flour',
      sku: sku('ATA', 1), categorySlug: 'ata-maida', brandSlug: 'fresh',
      description: 'মসৃণ ও সাদা গমের আটা। রুটি, পরাটা ও পিঠার জন্য।',
      ingredients: '১০০% গম', origin: 'বাংলাদেশ',
      weight: '২ কেজি', price: 160, discountPrice: 145, stock: 200,
      isBestSeller: true, tags: ['আটা', 'গম', 'রুটি'],
    },
    {
      name: 'ময়দা (পরিশোধিত)', nameEn: 'Refined Wheat Flour (Maida)',
      sku: sku('ATA', 2), categorySlug: 'ata-maida', brandSlug: 'fresh',
      description: 'পরিশোধিত ময়দা। কেক, বিস্কুট ও নান রুটির জন্য।',
      origin: 'বাংলাদেশ',
      weight: '১ কেজি', price: 70, stock: 300,
      tags: ['ময়দা', 'বেকিং', 'কেক'],
    },
    {
      name: 'লাল আটা (আটা)', nameEn: 'Whole Wheat Flour',
      sku: sku('ATA', 3), categorySlug: 'ata-maida', brandSlug: 'deshi-moslar',
      description: 'পুষ্টিগুণসম্পন্ন লাল আটা। স্বাস্থ্যকর রুটির জন্য সর্বোত্তম।',
      ingredients: '১০০% সম্পূর্ণ গমের দানা', origin: 'বাংলাদেশ',
      weight: '২ কেজি', price: 180, discountPrice: 160, stock: 150,
      isNewArrival: true, isFeatured: true, tags: ['লাল আটা', 'স্বাস্থ্যকর', 'গম'],
    },

    // ── লবণ ───────────────────────────────────────────
    {
      name: 'আয়োডিনযুক্ত লবণ', nameEn: 'Iodized Salt',
      sku: sku('LBN', 1), categorySlug: 'lobon', brandSlug: 'aci',
      description: 'স্বাস্থ্যকর আয়োডিনযুক্ত লবণ। দৈনন্দিন রান্নার জন্য।',
      ingredients: 'সোডিয়াম ক্লোরাইড, আয়োডিন', origin: 'বাংলাদেশ',
      weight: '১ কেজি', price: 40, stock: 500,
      isBestSeller: true, tags: ['লবণ', 'আয়োডিন'],
    },
    {
      name: 'হিমালয়ান পিংক সল্ট', nameEn: 'Himalayan Pink Salt',
      sku: sku('LBN', 2), categorySlug: 'lobon', brandSlug: 'deshi-moslar',
      description: 'হিমালয় থেকে আনা গোলাপি লবণ। ৮৪+ মিনারেলসমৃদ্ধ।',
      origin: 'পাকিস্তান (ইম্পোর্টেড)',
      weight: '৫০০ গ্রাম', price: 120, discountPrice: 100, stock: 100,
      isNewArrival: true, isFeatured: true, tags: ['হিমালয়ান', 'পিংক সল্ট', 'স্বাস্থ্যকর'],
    },

    // ── চিনি ও গুড় ────────────────────────────────────
    {
      name: 'সাদা চিনি (পরিশোধিত)', nameEn: 'White Sugar',
      sku: sku('CHN', 1), categorySlug: 'chini-gur', brandSlug: 'meghna',
      description: 'মসৃণ ও সাদা পরিশোধিত চিনি। মিষ্টি ও রান্নায় ব্যবহারযোগ্য।',
      origin: 'বাংলাদেশ',
      weight: '১ কেজি', price: 130, stock: 400,
      isBestSeller: true, tags: ['চিনি', 'সাদা', 'মিষ্টি'],
    },
    {
      name: 'খেজুরের গুড় (শীতকালীন)', nameEn: 'Date Palm Jaggery',
      sku: sku('CHN', 2), categorySlug: 'chini-gur', brandSlug: 'deshi-moslar',
      description: 'খাঁটি খেজুরের রস থেকে তৈরি শীতকালীন গুড়। পায়েস ও পিঠায় অতুলনীয়।',
      ingredients: '১০০% খেজুর রস', origin: 'যশোর, বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 380, discountPrice: 350, stock: 60,
      isFeatured: true, isBestSeller: true, tags: ['খেজুর গুড়', 'শীতকাল', 'পিঠা'],
    },
    {
      name: 'আখের গুড়', nameEn: 'Sugarcane Jaggery',
      sku: sku('CHN', 3), categorySlug: 'chini-gur', brandSlug: 'deshi-moslar',
      description: 'খাঁটি আখের রস থেকে তৈরি গুড়। প্রাকৃতিক মিষ্টি।',
      ingredients: '১০০% আখের রস', origin: 'রাজশাহী, বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 160, stock: 100,
      tags: ['আখ', 'গুড়', 'প্রাকৃতিক'],
    },

    // ── চা ও কফি ──────────────────────────────────────
    {
      name: 'দেশি চা পাতা', nameEn: 'Bangladeshi Tea Leaves',
      sku: sku('CHA', 1), categorySlug: 'cha-kofi', brandSlug: 'pran',
      description: 'সিলেটের পাহাড়ি বাগানের সতেজ চা পাতা। কড়া লিকার ও সুগন্ধ।',
      ingredients: '১০০% প্রাকৃতিক চা পাতা', origin: 'সিলেট, বাংলাদেশ',
      weight: '৪০০ গ্রাম', price: 320, discountPrice: 290, stock: 150,
      isBestSeller: true, isFeatured: true, tags: ['চা', 'সিলেট', 'দেশি'],
    },
    {
      name: 'মালাই চা মিশ্রণ', nameEn: 'Creamy Tea Blend',
      sku: sku('CHA', 2), categorySlug: 'cha-kofi', brandSlug: 'deshi-moslar',
      description: 'বিশেষ মালাই চায়ের জন্য গোপন মিশ্রণ। এক চুমুকেই অনুভব করুন।',
      ingredients: 'চা পাতা, এলাচ, আদা, দারুচিনি, দুধ গুঁড়া', origin: 'বাংলাদেশ',
      weight: '২০০ গ্রাম', price: 220, discountPrice: 195, stock: 80,
      isNewArrival: true, tags: ['মালাই চা', 'মিক্স', 'বিশেষ'],
    },
    {
      name: 'ইন্সট্যান্ট কফি', nameEn: 'Instant Coffee',
      sku: sku('KOF', 1), categorySlug: 'cha-kofi', brandSlug: 'pran',
      description: 'দ্রুত তৈরি ইন্সট্যান্ট কফি। সকালের শক্তির উৎস।',
      ingredients: 'রোস্টেড কফি বিনস', origin: 'ইম্পোর্টেড',
      weight: '১৫০ গ্রাম', price: 280, stock: 120,
      isNewArrival: true, tags: ['কফি', 'ইন্সট্যান্ট'],
    },

    // ── স্ন্যাকস ──────────────────────────────────────
    {
      name: 'মুড়ি (মচমচে)', nameEn: 'Puffed Rice (Muri)',
      sku: sku('SNK', 1), categorySlug: 'snacks', brandSlug: 'pran',
      description: 'মচমচে মুড়ি। বিকেলের নাস্তায় বা চানাচুর মিশিয়ে খান।',
      origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 60, stock: 300,
      isBestSeller: true, tags: ['মুড়ি', 'স্ন্যাকস', 'বিকেল'],
    },
    {
      name: 'চানাচুর (ঝাল)', nameEn: 'Spicy Chanachur',
      sku: sku('SNK', 2), categorySlug: 'snacks', brandSlug: 'pran',
      description: 'ঝাল ও মচমচে চানাচুর। চায়ের সাথে পারফেক্ট।',
      origin: 'বাংলাদেশ',
      weight: '৩০০ গ্রাম', price: 80, discountPrice: 70, stock: 200,
      isBestSeller: true, tags: ['চানাচুর', 'ঝাল', 'নাস্তা'],
    },
    {
      name: 'চিড়া', nameEn: 'Flattened Rice (Chira)',
      sku: sku('SNK', 3), categorySlug: 'snacks', brandSlug: 'fresh',
      description: 'সাদা চিড়া। দই-চিড়া বা ভাজা চিড়া বানানোর জন্য।',
      origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 70, stock: 250,
      tags: ['চিড়া', 'দই', 'নাস্তা'],
    },

    // ── নুডলস ─────────────────────────────────────────
    {
      name: 'ইন্সট্যান্ট নুডলস (মশলাদার)', nameEn: 'Spicy Instant Noodles',
      sku: sku('NDL', 1), categorySlug: 'noodles', brandSlug: 'pran',
      description: '৩ মিনিটে রান্না হয় এমন মশলাদার নুডলস। শিশু থেকে বড় সবার পছন্দ।',
      origin: 'বাংলাদেশ',
      weight: '৭৫ গ্রাম', price: 35, stock: 500,
      isBestSeller: true, tags: ['নুডলস', 'ইন্সট্যান্ট', 'ঝাল'],
    },
    {
      name: 'চিকেন নুডলস', nameEn: 'Chicken Noodles',
      sku: sku('NDL', 2), categorySlug: 'noodles', brandSlug: 'pran',
      description: 'চিকেন ফ্লেভারের নুডলস। বাচ্চাদের প্রিয়।',
      origin: 'বাংলাদেশ',
      weight: '৭৫ গ্রাম', price: 35, stock: 400,
      tags: ['নুডলস', 'চিকেন', 'বাচ্চা'],
    },

    // ── সস ও আচার ─────────────────────────────────────
    {
      name: 'টমেটো সস', nameEn: 'Tomato Sauce / Ketchup',
      sku: sku('SOS', 1), categorySlug: 'sauce-achar', brandSlug: 'pran',
      description: 'মিষ্টি ও টক টমেটো সস। বার্গার, সমুচা ও পরোটায় দারুণ লাগে।',
      origin: 'বাংলাদেশ',
      weight: '৩৪০ গ্রাম', price: 120, discountPrice: 105, stock: 200,
      isBestSeller: true, tags: ['টমেটো সস', 'কেচাপ', 'ফাস্টফুড'],
    },
    {
      name: 'কামরাঙার আচার (ঝাল)', nameEn: 'Spicy Starfruit Pickle',
      sku: sku('ACH', 1), categorySlug: 'sauce-achar', brandSlug: 'deshi-moslar',
      description: 'ঘরে তৈরির মতো কামরাঙার ঝাল আচার। খাবারের সাথে পারফেক্ট।',
      ingredients: 'কামরাঙা, সরিষা, মরিচ, লবণ, সরিষার তেল',
      origin: 'বাংলাদেশ',
      weight: '৩০০ গ্রাম', price: 150, stock: 80,
      isNewArrival: true, isFeatured: true, tags: ['আচার', 'কামরাঙা', 'ঝাল'],
    },
    {
      name: 'আমের আচার', nameEn: 'Mango Pickle',
      sku: sku('ACH', 2), categorySlug: 'sauce-achar', brandSlug: 'deshi-moslar',
      description: 'কাঁচা আমের ঐতিহ্যবাহী আচার। সরিষার তেল ও মসলায় তৈরি।',
      ingredients: 'কাঁচা আম, সরিষার তেল, মরিচ, মেথি, সরিষা, লবণ',
      origin: 'বাংলাদেশ',
      weight: '৩০০ গ্রাম', price: 140, stock: 100,
      isBestSeller: true, tags: ['আমের আচার', 'কাঁচা আম', 'ঐতিহ্য'],
    },
    {
      name: 'চিলি সস (এক্সট্রা হট)', nameEn: 'Extra Hot Chili Sauce',
      sku: sku('SOS', 2), categorySlug: 'sauce-achar', brandSlug: 'bd-food',
      description: 'অতিরিক্ত ঝাল চিলি সস। সাহসী খাদকদের জন্য।',
      origin: 'বাংলাদেশ',
      weight: '২৫০ গ্রাম', price: 90, stock: 150,
      isNewArrival: true, tags: ['চিলি সস', 'ঝাল', 'এক্সট্রা'],
    },

    // ── মধু ───────────────────────────────────────────
    {
      name: 'সুন্দরবনের মধু (খাঁটি)', nameEn: 'Sundarbans Pure Honey',
      sku: sku('MDH', 1), categorySlug: 'modhu', brandSlug: 'deshi-moslar',
      description: 'সুন্দরবনের মৌচাক থেকে সংগ্রহ করা খাঁটি মধু। সম্পূর্ণ প্রাকৃতিক।',
      ingredients: '১০০% প্রাকৃতিক মধু', usage: 'সরাসরি খান, চায়ে মেশান বা রান্নায় ব্যবহার করুন',
      storageInfo: 'সরাসরি আলো থেকে দূরে রাখুন', origin: 'সুন্দরবন, বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 600, discountPrice: 550, stock: 50,
      isBestSeller: true, isFeatured: true, tags: ['মধু', 'সুন্দরবন', 'খাঁটি'],
    },
    {
      name: 'লিচু ফুলের মধু', nameEn: 'Lychee Blossom Honey',
      sku: sku('MDH', 2), categorySlug: 'modhu', brandSlug: 'deshi-moslar',
      description: 'লিচু ফুলের মৌসুমে সংগ্রহ করা বিশেষ মধু। হালকা মিষ্টি স্বাদ।',
      ingredients: '১০০% প্রাকৃতিক মধু', origin: 'রাজশাহী, বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 500, stock: 40,
      isNewArrival: true, tags: ['লিচু মধু', 'বিশেষ', 'প্রাকৃতিক'],
    },

    // ── রান্নার পণ্য ──────────────────────────────────
    {
      name: 'নারকেল কোরানো (শুকনো)', nameEn: 'Desiccated Coconut',
      sku: sku('RNP', 1), categorySlug: 'cooking-items', brandSlug: 'fresh',
      description: 'শুকনো কোরানো নারকেল। পিঠা, হালুয়া ও মিষ্টি তৈরিতে।',
      origin: 'বাংলাদেশ',
      weight: '২০০ গ্রাম', price: 90, stock: 150,
      tags: ['নারকেল', 'কোরানো', 'পিঠা'],
    },
    {
      name: 'তেঁতুল (শুকনো)', nameEn: 'Dried Tamarind',
      sku: sku('RNP', 2), categorySlug: 'cooking-items', brandSlug: 'deshi-moslar',
      description: 'শুকনো তেঁতুল। টক ও স্বাদের জন্য রান্নায় অপরিহার্য।',
      origin: 'বাংলাদেশ',
      weight: '২৫০ গ্রাম', price: 60, stock: 200,
      isBestSeller: true, tags: ['তেঁতুল', 'টক', 'চাটনি'],
    },
    {
      name: 'শুকনো মরিচ (লাল)', nameEn: 'Dried Red Chili',
      sku: sku('RNP', 3), categorySlug: 'cooking-items', brandSlug: 'deshi-moslar',
      description: 'কড়া লাল শুকনো মরিচ। তড়কা ও ভর্তায় ব্যবহার হয়।',
      origin: 'বাংলাদেশ',
      weight: '২৫০ গ্রাম', price: 110, stock: 200,
      tags: ['শুকনো মরিচ', 'লাল', 'ঝাল'],
    },
    {
      name: 'আদা গুঁড়া', nameEn: 'Ginger Powder',
      sku: sku('RNP', 4), categorySlug: 'cooking-items', brandSlug: 'radhuni',
      description: 'শুকনো আদার গুঁড়া। চা, রান্না ও স্বাস্থ্য পানীয়তে।',
      origin: 'বাংলাদেশ',
      weight: '১০০ গ্রাম', price: 80, stock: 180,
      tags: ['আদা গুঁড়া', 'রান্না'],
    },
    {
      name: 'রসুন গুঁড়া', nameEn: 'Garlic Powder',
      sku: sku('RNP', 5), categorySlug: 'cooking-items', brandSlug: 'radhuni',
      description: 'শুকনো রসুনের গুঁড়া। তাৎক্ষণিক রান্নায় সুবিধাজনক।',
      origin: 'বাংলাদেশ',
      weight: '১০০ গ্রাম', price: 90, stock: 160,
      tags: ['রসুন', 'গুঁড়া', 'রান্না'],
    },
    {
      name: 'বেসন', nameEn: 'Chickpea Flour (Besan)',
      sku: sku('RNP', 6), categorySlug: 'cooking-items', brandSlug: 'fresh',
      description: 'মসৃণ বেসন। পিঁয়াজু, বেগুনি ও মিষ্টি তৈরিতে।',
      origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 80, stock: 220,
      isBestSeller: true, tags: ['বেসন', 'পিঁয়াজু', 'বেগুনি'],
    },
    {
      name: 'সুজি', nameEn: 'Semolina (Suji)',
      sku: sku('RNP', 7), categorySlug: 'cooking-items', brandSlug: 'fresh',
      description: 'মোটা দানার সুজি। হালুয়া ও পায়েসের জন্য।',
      origin: 'বাংলাদেশ',
      weight: '৫০০ গ্রাম', price: 65, stock: 300,
      isBestSeller: true, tags: ['সুজি', 'হালুয়া', 'পায়েস'],
    },
    {
      name: 'তিল (সাদা)', nameEn: 'White Sesame Seeds',
      sku: sku('RNP', 8), categorySlug: 'cooking-items', brandSlug: 'deshi-moslar',
      description: 'সাদা তিল। পিঠা, নাড়ু ও তাহিনির জন্য।',
      origin: 'বাংলাদেশ',
      weight: '২০০ গ্রাম', price: 110, discountPrice: 95, stock: 120,
      isNewArrival: true, tags: ['তিল', 'পিঠা', 'নাড়ু'],
    },
  ];

  // Insert products
  const productIds: Record<string, string> = {};

  for (const p of productSeedData) {
    const discountPct = p.discountPrice
      ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
      : undefined;

    const catId = categories[p.categorySlug];
    if (!catId) {
      console.warn(`⚠️  Category not found: ${p.categorySlug} for product ${p.name}`);
      continue;
    }

    const productSlug = slug(p.nameEn || p.name);

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        nameEn: p.nameEn,
        slug: productSlug,
        sku: p.sku,
        categoryId: catId,
        brandId: p.brandSlug ? brands[p.brandSlug] : undefined,
        description: p.description,
        ingredients: p.ingredients,
        usage: p.usage,
        storageInfo: p.storageInfo,
        origin: p.origin,
        weight: p.weight,
        price: p.price,
        discountPrice: p.discountPrice,
        discountPercent: discountPct,
        stockStatus:
          p.stock === 0
            ? StockStatus.OUT_OF_STOCK
            : p.stock <= 10
            ? StockStatus.LOW_STOCK
            : StockStatus.IN_STOCK,
        isActive: true,
        isFeatured: p.isFeatured ?? false,
        isBestSeller: p.isBestSeller ?? false,
        isNewArrival: p.isNewArrival ?? false,
        tags: p.tags,
      },
    });

    productIds[p.sku] = product.id;

    // Inventory
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        totalStock: p.stock,
        availableStock: p.stock,
        soldQuantity: Math.floor(Math.random() * 50),
        lowStockAlert: 15,
      },
    });
  }

  console.log(`✅ ${productSeedData.length} products created with inventory`);

  // ════════════════════════════════════════════════════
  // 6. RECIPES
  // ════════════════════════════════════════════════════
  type RecipeSeed = {
    name: string; nameEn: string; slug: string;
    description: string; cookingInstructions: string;
    preparationTime: number; cookingTime: number;
    servingSize: number; category: string; difficulty: string; tags: string[];
    ingredients: { name: string; quantity: string; unit?: string; sku?: string }[];
  };

  const recipeSeedData: RecipeSeed[] = [
    {
      name: 'কাচ্চি বিরিয়ানি', nameEn: 'Kacchi Biryani',
      slug: 'kacchi-biryani',
      description: 'ঐতিহ্যবাহী কাচ্চি বিরিয়ানি। কাঁচা মাংস ও চাল একসাথে রান্না করা হয়। উৎসব ও বিশেষ অনুষ্ঠানের অন্যতম প্রধান খাবার।',
      cookingInstructions: `১. মাংস ধুয়ে পরিষ্কার করুন।\n২. দই, পেঁয়াজ বেরেস্তা, আদা-রসুন বাটা ও বিরিয়ানি মসলা দিয়ে মেরিনেট করুন (৪-৬ ঘণ্টা)।\n৩. চাল আধা সিদ্ধ করুন।\n৪. হাঁড়িতে স্তরে স্তরে মাংস ও চাল দিন।\n৫. ঘি, জাফরান ও কেওড়া জল ছড়িয়ে দিন।\n৬. আটার ময়ান দিয়ে মুখ বন্ধ করুন।\n৭. ৪৫-৬০ মিনিট দমে রান্না করুন।`,
      preparationTime: 360, cookingTime: 60, servingSize: 6,
      category: 'বিরিয়ানি', difficulty: 'কঠিন',
      tags: ['বিরিয়ানি', 'উৎসব', 'মাংস', 'ঈদ'],
      ingredients: [
        { name: 'বাসমতি চাল', quantity: '৫০০', unit: 'গ্রাম', sku: sku('CHL', 3) },
        { name: 'বিরিয়ানি মসলা', quantity: '৫০', unit: 'গ্রাম', sku: sku('MSL', 7) },
        { name: 'গরম মসলা গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 5) },
        { name: 'মাংসের মসলা', quantity: '২', unit: 'চামচ', sku: sku('MSL', 8) },
        { name: 'সরিষার তেল', quantity: '৩', unit: 'টেবিল চামচ', sku: sku('TEL', 1) },
        { name: 'খাসির মাংস', quantity: '১', unit: 'কেজি' },
        { name: 'দই', quantity: '২০০', unit: 'গ্রাম' },
        { name: 'পেঁয়াজ', quantity: '৪টি', unit: 'মাঝারি' },
        { name: 'ঘি', quantity: '৩', unit: 'টেবিল চামচ' },
      ],
    },
    {
      name: 'মাছের ঝোল', nameEn: 'Fish Curry',
      slug: 'macher-jhol',
      description: 'বাংলাদেশের ঐতিহ্যবাহী মাছের ঝোল। হলুদ, মরিচ ও সরিষার তেলে রান্না করা সহজ ও সুস্বাদু।',
      cookingInstructions: `১. মাছ পরিষ্কার করে হলুদ ও লবণ মাখান।\n২. সরিষার তেলে মাছ হালকা ভেজে তুলুন।\n৩. ঐ তেলে পেঁয়াজ কুচি ভাজুন।\n৪. আদা-রসুন বাটা, হলুদ, মরিচ ও ধনে গুঁড়া দিন।\n৫. কষিয়ে টমেটো দিন।\n৬. পানি দিয়ে ফুটালে মাছ দিন।\n৭. ৮-১০ মিনিট রান্না করুন।`,
      preparationTime: 15, cookingTime: 25, servingSize: 4,
      category: 'মাছের রান্না', difficulty: 'সহজ',
      tags: ['মাছ', 'ঝোল', 'দেশি', 'ভাত'],
      ingredients: [
        { name: 'হলুদ গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 3) },
        { name: 'মরিচ গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 2) },
        { name: 'ধনে গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 1) },
        { name: 'সরিষার তেল', quantity: '৪', unit: 'টেবিল চামচ', sku: sku('TEL', 1) },
        { name: 'আয়োডিনযুক্ত লবণ', quantity: 'পরিমাণমতো', sku: sku('LBN', 1) },
        { name: 'রুই বা কাতলা মাছ', quantity: '৫০০', unit: 'গ্রাম' },
        { name: 'পেঁয়াজ', quantity: '২টি', unit: 'মাঝারি' },
        { name: 'টমেটো', quantity: '১টি' },
      ],
    },
    {
      name: 'গরুর মাংসের কারি', nameEn: 'Beef Curry',
      slug: 'gorur-mangser-kari',
      description: 'মসলাদার গরুর মাংসের কারি। ঈদুল আজহায় বিশেষ পছন্দের রান্না।',
      cookingInstructions: `১. মাংস ছোট টুকরো করে ধুয়ে নিন।\n২. পেঁয়াজ কুচি বেরেস্তা করুন।\n৩. আদা-রসুন বাটা, মাংসের মসলা, হলুদ ও মরিচ দিয়ে কষান।\n৪. মাংস দিয়ে ১৫ মিনিট কষান।\n৫. গরম পানি দিয়ে প্রেশার কুকারে ২০ মিনিট রান্না করুন।\n৬. গরম মসলা ছিটিয়ে পরিবেশন করুন।`,
      preparationTime: 20, cookingTime: 45, servingSize: 5,
      category: 'মাংসের রান্না', difficulty: 'মাঝারি',
      tags: ['গরু', 'মাংস', 'কারি', 'ঈদ'],
      ingredients: [
        { name: 'মাংসের মসলা', quantity: '৩', unit: 'চামচ', sku: sku('MSL', 8) },
        { name: 'হলুদ গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 3) },
        { name: 'মরিচ গুঁড়া', quantity: '২', unit: 'চামচ', sku: sku('MSL', 2) },
        { name: 'গরম মসলা গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 5) },
        { name: 'সরিষার তেল', quantity: '৫', unit: 'টেবিল চামচ', sku: sku('TEL', 1) },
        { name: 'আয়োডিনযুক্ত লবণ', quantity: 'পরিমাণমতো', sku: sku('LBN', 1) },
        { name: 'গরুর মাংস', quantity: '১', unit: 'কেজি' },
        { name: 'পেঁয়াজ', quantity: '৩টি' },
      ],
    },
    {
      name: 'ডিম ভর্তা', nameEn: 'Egg Bhorta',
      slug: 'dim-bhorta',
      description: 'সহজ ও দ্রুত তৈরি ডিম ভর্তা। গরম ভাতের সাথে অনন্য।',
      cookingInstructions: `১. ডিম সিদ্ধ করে খোসা ছাড়ান।\n২. পেঁয়াজ, মরিচ, ধনেপাতা কুচি করুন।\n৩. সরিষার তেল গরম করে পেঁয়াজ ভাজুন।\n৪. ডিম চটকে সব একসাথে মেশান।\n৫. লবণ দিয়ে ভালো মিশিয়ে পরিবেশন করুন।`,
      preparationTime: 5, cookingTime: 15, servingSize: 2,
      category: 'ভর্তা', difficulty: 'সহজ',
      tags: ['ভর্তা', 'ডিম', 'দ্রুত', 'ভাত'],
      ingredients: [
        { name: 'সরিষার তেল', quantity: '২', unit: 'চামচ', sku: sku('TEL', 1) },
        { name: 'মরিচ গুঁড়া', quantity: '½', unit: 'চামচ', sku: sku('MSL', 2) },
        { name: 'আয়োডিনযুক্ত লবণ', quantity: 'পরিমাণমতো', sku: sku('LBN', 1) },
        { name: 'ডিম', quantity: '৪টি' },
        { name: 'পেঁয়াজ', quantity: '১টি' },
        { name: 'কাঁচামরিচ', quantity: '২টি' },
      ],
    },
    {
      name: 'মুগ ডালের খিচুড়ি', nameEn: 'Mung Dal Khichuri',
      slug: 'mug-daler-khichuri',
      description: 'বৃষ্টির দিনে বা অসুস্থ অবস্থায় খাওয়ার জন্য পারফেক্ট মুগ ডালের খিচুড়ি।',
      cookingInstructions: `১. চাল ও ডাল ধুয়ে ভিজিয়ে রাখুন।\n২. হাঁড়িতে তেল গরম করে হলুদ ও জিরা ফোড়ন দিন।\n৩. পেঁয়াজ ভেজে আদা-রসুন বাটা দিন।\n৪. চাল ও ডাল দিয়ে কষান।\n৫. গরম পানি ও লবণ দিয়ে ঢেকে রান্না করুন।\n৬. নরম হলে ঘি ছিটিয়ে পরিবেশন করুন।`,
      preparationTime: 20, cookingTime: 30, servingSize: 4,
      category: 'খিচুড়ি', difficulty: 'সহজ',
      tags: ['খিচুড়ি', 'মুগ ডাল', 'বৃষ্টি', 'সহজ'],
      ingredients: [
        { name: 'মিনিকেট চাল', quantity: '২ কাপ', sku: sku('CHL', 1) },
        { name: 'মুগ ডাল', quantity: '১ কাপ', sku: sku('DAL', 3) },
        { name: 'হলুদ গুঁড়া', quantity: '½', unit: 'চামচ', sku: sku('MSL', 3) },
        { name: 'জিরা গুঁড়া', quantity: '½', unit: 'চামচ', sku: sku('MSL', 4) },
        { name: 'সয়াবিন তেল', quantity: '৩', unit: 'চামচ', sku: sku('TEL', 2) },
        { name: 'আয়োডিনযুক্ত লবণ', quantity: 'পরিমাণমতো', sku: sku('LBN', 1) },
        { name: 'পেঁয়াজ', quantity: '২টি' },
      ],
    },
    {
      name: 'ইলিশ সরিষা', nameEn: 'Ilish Shorshe (Hilsa in Mustard)',
      slug: 'ilish-shorshe',
      description: 'বাঙালির প্রিয় ইলিশ মাছ সরিষা দিয়ে রান্না। পহেলা বৈশাখের অবশ্যই পদ।',
      cookingInstructions: `১. সরিষা বেটে পেস্ট তৈরি করুন।\n২. হলুদ, মরিচ ও লবণ মিশিয়ে ইলিশ মেরিনেট করুন।\n৩. সরিষার তেলে হালকা ভাজুন।\n৪. সরিষা পেস্ট ও কাঁচামরিচ দিয়ে ঢেকে দিন।\n৫. ১০ মিনিট মাঝ আঁচে রান্না করুন।`,
      preparationTime: 15, cookingTime: 20, servingSize: 4,
      category: 'মাছের রান্না', difficulty: 'মাঝারি',
      tags: ['ইলিশ', 'সরিষা', 'বৈশাখ', 'দেশি'],
      ingredients: [
        { name: 'সরিষার তেল', quantity: '৪', unit: 'টেবিল চামচ', sku: sku('TEL', 1) },
        { name: 'হলুদ গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 3) },
        { name: 'মরিচ গুঁড়া', quantity: '১', unit: 'চামচ', sku: sku('MSL', 2) },
        { name: 'আয়োডিনযুক্ত লবণ', quantity: 'পরিমাণমতো', sku: sku('LBN', 1) },
        { name: 'ইলিশ মাছ', quantity: '৫০০', unit: 'গ্রাম' },
        { name: 'সরিষার দানা', quantity: '২', unit: 'চামচ' },
        { name: 'কাঁচামরিচ', quantity: '৫-৬টি' },
      ],
    },
  ];

  for (const r of recipeSeedData) {
    const recipe = await prisma.recipe.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        name: r.name,
        nameEn: r.nameEn,
        slug: r.slug,
        description: r.description,
        cookingInstructions: r.cookingInstructions,
        preparationTime: r.preparationTime,
        cookingTime: r.cookingTime,
        servingSize: r.servingSize,
        category: r.category,
        difficulty: r.difficulty,
        tags: r.tags,
        isActive: true,
      },
    });

    for (let i = 0; i < r.ingredients.length; i++) {
      const ing = r.ingredients[i];
      const productId = ing.sku ? productIds[ing.sku] : undefined;
      await prisma.recipeIngredient.upsert({
        where: { id: `${recipe.id}-${i}` },
        update: {},
        create: {
          id: `${recipe.id}-${i}`,
          recipeId: recipe.id,
          productId: productId || null,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          sortOrder: i,
        },
      });
    }
  }

  console.log(`✅ ${recipeSeedData.length} recipes created with ingredients`);

  // ════════════════════════════════════════════════════
  // 7. TESTIMONIALS
  // ════════════════════════════════════════════════════
  const testimonials = [
    {
      name: 'তানজিলা আক্তার', role: 'গৃহিণী, ঢাকা', rating: 5,
      comment: 'অসাধারণ মানের মসলা! রান্নায় সত্যিকারের দেশীয় স্বাদ পাচ্ছি। বিশেষ করে সরিষার তেলের ঘ্রাণ ও স্বাদটা অনন্য। নিয়মিত অর্ডার করছি।',
      sortOrder: 1,
    },
    {
      name: 'মোঃ রফিকুল ইসলাম', role: 'ব্যবসায়ী, চট্টগ্রাম', rating: 5,
      comment: 'দ্রুত ডেলিভারি এবং পণ্যের গুণমান চমৎকার। অনলাইনে এত ভালো মান আশা করিনি। দেশি মসলার রান্নাঘর থেকে কেনাকাটা একটা আনন্দের অভিজ্ঞতা।',
      sortOrder: 2,
    },
    {
      name: 'নাফিসা খানম', role: 'শিক্ষার্থী, রাজশাহী', rating: 4,
      comment: 'অনলাইনে মসলা কিনতে প্রথমে দ্বিধা ছিল, কিন্তু প্যাকেজিং ও মান দেখে মুগ্ধ হয়েছি। বিশেষ করে খেজুরের গুড় অসাধারণ।',
      sortOrder: 3,
    },
    {
      name: 'আব্দুল কাদের', role: 'প্রবাসী, মালয়েশিয়া', rating: 5,
      comment: 'পরিবারের জন্য দেশি মসলা পাঠাই। মানের কোনো আপোস নেই। বিদেশে থেকেও দেশের স্বাদ পাওয়া যাচ্ছে।',
      sortOrder: 4,
    },
    {
      name: 'শামীমা বেগম', role: 'গৃহিণী, সিলেট', rating: 5,
      comment: 'সুন্দরবনের মধু নিলাম। সম্পূর্ণ খাঁটি। আর দেশি হলুদ গুঁড়া সত্যিই কৃত্রিম রং ছাড়া। এরকম বিশ্বস্ত ব্র্যান্ড দরকার ছিল।',
      sortOrder: 5,
    },
    {
      name: 'হাসান মাহমুদ', role: 'উদ্যোক্তা, খুলনা', rating: 5,
      comment: 'বন্ধুর পরামর্শে প্রথমবার অর্ডার করেছিলাম। এখন আর অন্য কোথাও যাই না। রেসিপি শপিং ফিচারটা দারুণ কাজে আসে।',
      sortOrder: 6,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.name },
      update: {},
      create: { id: t.name, ...t, isActive: true },
    });
  }

  console.log(`✅ ${testimonials.length} testimonials created`);

  // ════════════════════════════════════════════════════
  // 8. BANNERS
  // ════════════════════════════════════════════════════
  const banners = [
    {
      title: 'দেশি মসলার স্বাদে ঘর হোক আরও বিশেষ',
      subtitle: 'নির্বাচিত দেশি মসলা ও নিত্যপ্রয়োজনীয় পণ্য, এখন আপনার দরজায়',
      image: '/images/banners/hero-1.jpg',
      buttonText: 'এখনই কিনুন',
      link: '/shop',
      position: 'HERO' as const,
      sortOrder: 1,
    },
    {
      title: 'দেশি মসলা ও আটা-ময়দায় ২৫% পর্যন্ত ছাড়',
      subtitle: 'সীমিত সময়ের অফার, দেরি না করে অর্ডার করুন',
      image: '/images/banners/promo-1.jpg',
      buttonText: 'অফার দেখুন',
      link: '/offers',
      position: 'PROMOTIONAL' as const,
      sortOrder: 1,
    },
  ];

  for (const b of banners) {
    await prisma.banner.upsert({
      where: { id: b.title },
      update: {},
      create: { id: b.title, ...b, isActive: true },
    });
  }

  console.log(`✅ ${banners.length} banners created`);

  // ════════════════════════════════════════════════════
  // 9. COUPONS
  // ════════════════════════════════════════════════════
  const coupons = [
    {
      code: 'WELCOME10',
      description: 'নতুন গ্রাহকদের জন্য ১০% স্বাগত ছাড়',
      discountType: 'PERCENTAGE' as const,
      discountValue: 10,
      minOrderAmount: 300,
      maxDiscount: 150,
      startDate: new Date('2025-01-01'),
      expiryDate: new Date('2026-12-31'),
      usageLimit: 5000,
      userLimit: 1,
      isActive: true,
    },
    {
      code: 'FREEDEL',
      description: 'বিনামূল্যে ডেলিভারি কুপন',
      discountType: 'FREE_DELIVERY' as const,
      discountValue: 0,
      minOrderAmount: 500,
      startDate: new Date('2025-01-01'),
      expiryDate: new Date('2026-12-31'),
      usageLimit: 1000,
      userLimit: 2,
      isActive: true,
    },
    {
      code: 'EID2025',
      description: 'ঈদুল আজহা বিশেষ ছাড় — ১৫%',
      discountType: 'PERCENTAGE' as const,
      discountValue: 15,
      minOrderAmount: 500,
      maxDiscount: 300,
      startDate: new Date('2025-06-01'),
      expiryDate: new Date('2025-06-30'),
      usageLimit: 2000,
      userLimit: 1,
      isActive: true,
    },
    {
      code: 'SAVE50',
      description: 'সরাসরি ৫০ টাকা ছাড়',
      discountType: 'FIXED_AMOUNT' as const,
      discountValue: 50,
      minOrderAmount: 400,
      startDate: new Date('2025-01-01'),
      expiryDate: new Date('2026-06-30'),
      usageLimit: 3000,
      userLimit: 3,
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  console.log(`✅ ${coupons.length} coupons created`);

  // ════════════════════════════════════════════════════
  // 10. DELIVERY CHARGES
  // ════════════════════════════════════════════════════
  const deliveryCharges = [
    { label: 'ঢাকা সিটি', district: 'ঢাকা', charge: 60, minOrderFree: 1000 },
    { label: 'চট্টগ্রাম সিটি', district: 'চট্টগ্রাম', charge: 80, minOrderFree: 1200 },
    { label: 'সিলেট সিটি', district: 'সিলেট', charge: 90, minOrderFree: 1200 },
    { label: 'রাজশাহী সিটি', district: 'রাজশাহী', charge: 90, minOrderFree: 1200 },
    { label: 'খুলনা সিটি', district: 'খুলনা', charge: 90, minOrderFree: 1200 },
    { label: 'বরিশাল সিটি', district: 'বরিশাল', charge: 100, minOrderFree: 1500 },
    { label: 'ময়মনসিংহ সিটি', district: 'ময়মনসিংহ', charge: 90, minOrderFree: 1200 },
    { label: 'রংপুর সিটি', district: 'রংপুর', charge: 100, minOrderFree: 1500 },
    { label: 'সারাদেশ (অন্যান্য)', division: 'সারাদেশ', charge: 120, minOrderFree: 1500 },
  ];

  for (const d of deliveryCharges) {
    await prisma.deliveryCharge.upsert({
      where: { id: d.label },
      update: {},
      create: { id: d.label, ...d, isActive: true },
    });
  }

  console.log(`✅ ${deliveryCharges.length} delivery charges created`);

  // ════════════════════════════════════════════════════
  // 11. SITE SETTINGS
  // ════════════════════════════════════════════════════
  const settings = [
    // General
    { key: 'site_name',           value: 'দেশি মসলার রান্নাঘর',          group: 'general', description: 'Website name in Bengali' },
    { key: 'site_name_en',        value: 'Deshi Moslar Rannaghar',         group: 'general', description: 'Website name in English' },
    { key: 'site_tagline',        value: 'প্রতিটি রান্নায় আসল স্বাদ',    group: 'general', description: 'Site tagline' },
    { key: 'site_email',          value: 'info@deshimoslar.com',           group: 'general', description: 'Contact email' },
    { key: 'site_phone',          value: '+8801700000000',                 group: 'general', description: 'Contact phone' },
    { key: 'site_address',        value: 'ঢাকা, বাংলাদেশ',               group: 'general', description: 'Physical address' },
    // Social
    { key: 'facebook_url',        value: 'https://facebook.com/deshimoslar', group: 'social', description: 'Facebook page URL' },
    { key: 'instagram_url',       value: 'https://instagram.com/deshimoslar', group: 'social', description: 'Instagram URL' },
    { key: 'youtube_url',         value: 'https://youtube.com/deshimoslar', group: 'social', description: 'YouTube channel URL' },
    // Support
    { key: 'whatsapp_number',     value: '+8801700000000',                 group: 'support', description: 'WhatsApp support number' },
    { key: 'whatsapp_message',    value: 'আমি দেশি মসলার রান্নাঘর থেকে সাহায্য চাই।', group: 'support', description: 'Default WhatsApp message' },
    // Announcement
    { key: 'announcement_bar',    value: '৳১০০০+ অর্ডারে ফ্রি ডেলিভারি | কোড: WELCOME10 — ১০% ছাড় | ক্যাশ অন ডেলিভারি উপলব্ধ', group: 'announcement', description: 'Top announcement bar text' },
    { key: 'announcement_active', value: 'true',                           group: 'announcement', description: 'Show/hide announcement bar' },
    // Inventory
    { key: 'low_stock_threshold', value: '15',                             group: 'inventory', description: 'Low stock alert threshold' },
    // SEO
    { key: 'meta_title',          value: 'দেশি মসলার রান্নাঘর | অনলাইন গ্রোসারি শপ', group: 'seo', description: 'Default meta title' },
    { key: 'meta_description',    value: 'বাংলাদেশের সেরা অনলাইন মসলা ও গ্রোসারি শপ। দেশীয় মসলা, চাল, ডাল, তেল এবং রান্নার প্রয়োজনীয় পণ্য ঘরে বসে অর্ডার করুন।', group: 'seo', description: 'Default meta description' },
    // Payment
    { key: 'cod_enabled',         value: 'true',                           group: 'payment', description: 'Enable Cash on Delivery' },
    { key: 'bkash_enabled',       value: 'true',                           group: 'payment', description: 'Enable bKash payment' },
    { key: 'nagad_enabled',       value: 'true',                           group: 'payment', description: 'Enable Nagad payment' },
    { key: 'sslcommerz_enabled',  value: 'false',                          group: 'payment', description: 'Enable SSLCommerz gateway' },
    { key: 'min_order_amount',    value: '200',                            group: 'payment', description: 'Minimum order amount in BDT' },
  ];

  for (const s of settings) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log(`✅ ${settings.length} site settings created`);

  // ════════════════════════════════════════════════════
  // 12. SAMPLE REVIEWS
  // ════════════════════════════════════════════════════
  const sampleReviews = [
    { sku: sku('MSL', 1), rating: 5, title: 'অসাধারণ ধনে গুঁড়া', comment: 'সত্যিই খাঁটি ধনে গুঁড়া। রান্নায় দারুণ সুবাস আসে।' },
    { sku: sku('TEL', 1), rating: 5, title: 'খাঁটি সরিষার তেল', comment: 'ঘানিতে ভাঙা তেলের সেই আসল ঘ্রাণ পাচ্ছি। অনেক দিন পর।' },
    { sku: sku('MDH', 1), rating: 5, title: 'সুন্দরবনের আসল মধু', comment: 'এত খাঁটি মধু আগে খাইনি। কোনো মিষ্টি মেশানো নেই।' },
    { sku: sku('CHL', 1), rating: 4, title: 'ভালো মিনিকেট চাল', comment: 'ভাত নরম ও সুস্বাদু হয়। তবে দাম একটু বেশি।' },
    { sku: sku('MSL', 6), rating: 5, title: 'বেস্ট কারি মসলা', comment: 'এই মসলা দিলে তরকারি অনেক ভালো হয়। পরিবারের সবাই পছন্দ করেছে।' },
  ];

  for (let i = 0; i < sampleReviews.length; i++) {
    const rev = sampleReviews[i];
    const productId = productIds[rev.sku];
    if (!productId) continue;
    // Use createMany-style with skipDuplicates via findFirst + create
    const existing = await prisma.review.findFirst({
      where: { userId: testUser.id, productId },
    });
    if (!existing) {
      await prisma.review.create({
        data: {
          userId: testUser.id,
          productId,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          status: 'APPROVED',
        },
      });
    }
  }

  console.log(`✅ ${sampleReviews.length} sample reviews created`);

  // ════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════
  const counts = {
    admins:     await prisma.admin.count(),
    users:      await prisma.user.count(),
    categories: await prisma.category.count(),
    brands:     await prisma.brand.count(),
    products:   await prisma.product.count(),
    inventory:  await prisma.inventory.count(),
    recipes:    await prisma.recipe.count(),
    coupons:    await prisma.coupon.count(),
    testimonials: await prisma.testimonial.count(),
    banners:    await prisma.banner.count(),
    reviews:    await prisma.review.count(),
    settings:   await prisma.siteSettings.count(),
  };

  console.log('\n════════════════════════════════════');
  console.log('🎉 Seeding completed successfully!');
  console.log('════════════════════════════════════');
  console.table(counts);
  console.log('\n📧 Admin login:    admin@deshimoslar.com  /  Admin@123456');
  console.log('📧 Customer login: rahim@test.com          /  Customer@123');
  console.log('════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

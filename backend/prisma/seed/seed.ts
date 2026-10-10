import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  await prisma.admin.upsert({
    where: { email: 'admin@deshimoslar.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@deshimoslar.com',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin created: admin@deshimoslar.com / Admin@123456');

  // ── Test Customer
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      name: 'টেস্ট গ্রাহক',
      email: 'customer@test.com',
      phone: '01700000001',
      password: customerPassword,
      role: 'CUSTOMER',
      cart: { create: {} },
    },
  });
  console.log('✅ Customer created: customer@test.com / Customer@123');

  // ── Categories
  const categoryData = [
    { name: 'মসলা', nameEn: 'Spices', slug: 'mosla', sortOrder: 1 },
    { name: 'তেল', nameEn: 'Oil', slug: 'tel', sortOrder: 2 },
    { name: 'চাল', nameEn: 'Rice', slug: 'chal', sortOrder: 3 },
    { name: 'ডাল', nameEn: 'Lentils', slug: 'dal', sortOrder: 4 },
    { name: 'আটা ও ময়দা', nameEn: 'Flour', slug: 'ata-maida', sortOrder: 5 },
    { name: 'লবণ', nameEn: 'Salt', slug: 'lobon', sortOrder: 6 },
    { name: 'চিনি ও গুড়', nameEn: 'Sugar & Molasses', slug: 'chini-gur', sortOrder: 7 },
    { name: 'চা ও কফি', nameEn: 'Tea & Coffee', slug: 'cha-kofi', sortOrder: 8 },
    { name: 'স্ন্যাকস', nameEn: 'Snacks', slug: 'snacks', sortOrder: 9 },
    { name: 'নুডলস', nameEn: 'Noodles', slug: 'noodles', sortOrder: 10 },
    { name: 'সস ও আচার', nameEn: 'Sauce & Pickle', slug: 'sauce-achar', sortOrder: 11 },
    { name: 'মধু', nameEn: 'Honey', slug: 'modhu', sortOrder: 12 },
    { name: 'রান্নার পণ্য', nameEn: 'Cooking Items', slug: 'cooking-items', sortOrder: 13 },
  ];

  for (const cat of categoryData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categoryData.length} categories created`);

  // ── Delivery Charges
  await prisma.deliveryCharge.upsert({
    where: { id: 'dhaka-inside' },
    update: {},
    create: {
      id: 'dhaka-inside',
      district: 'ঢাকা',
      charge: 60,
      minOrderFree: 1000,
    },
  });
  await prisma.deliveryCharge.upsert({
    where: { id: 'outside-dhaka' },
    update: {},
    create: {
      id: 'outside-dhaka',
      division: 'সারাদেশ',
      charge: 120,
      minOrderFree: 1500,
    },
  });
  console.log('✅ Delivery charges created');

  // ── Site Settings
  const settings = [
    { key: 'whatsapp_number', value: '+8801700000000', description: 'WhatsApp support number' },
    { key: 'site_name', value: 'দেশি মসলার রান্নাঘর', description: 'Website name' },
    { key: 'site_name_en', value: 'Deshi Moslar Rannaghar', description: 'Website name (English)' },
    { key: 'announcement_bar', value: 'Free Delivery on orders over ৳1000 | Use code WELCOME10 for 10% off', description: 'Top announcement bar text' },
    { key: 'low_stock_threshold', value: '10', description: 'Low stock alert threshold' },
  ];

  for (const s of settings) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ Site settings created');

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

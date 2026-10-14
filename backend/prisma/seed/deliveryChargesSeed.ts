import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDeliveryCharges() {
  const charges = [
    { label: 'ঢাকা মহানগর',      division: 'ঢাকা',      district: 'ঢাকা',         charge: 40,  minOrderFree: 800  },
    { label: 'গাজীপুর',           division: 'ঢাকা',      district: 'গাজীপুর',      charge: 60,  minOrderFree: 1000 },
    { label: 'নারায়ণগঞ্জ',        division: 'ঢাকা',      district: 'নারায়ণগঞ্জ',   charge: 60,  minOrderFree: 1000 },
    { label: 'মানিকগঞ্জ',         division: 'ঢাকা',      district: 'মানিকগঞ্জ',    charge: 70,  minOrderFree: 1200 },
    { label: 'মুন্সীগঞ্জ',         division: 'ঢাকা',      district: 'মুন্সীগঞ্জ',    charge: 70,  minOrderFree: 1200 },
    { label: 'নরসিংদী',           division: 'ঢাকা',      district: 'নরসিংদী',      charge: 70,  minOrderFree: 1200 },
    { label: 'চট্টগ্রাম সিটি',     division: 'চট্টগ্রাম', district: 'চট্টগ্রাম',    charge: 100, minOrderFree: 1500 },
    { label: 'কক্সবাজার',          division: 'চট্টগ্রাম', district: 'কক্সবাজার',    charge: 120, minOrderFree: 1500 },
    { label: 'কুমিল্লা',           division: 'চট্টগ্রাম', district: 'কুমিল্লা',     charge: 100, minOrderFree: 1500 },
    { label: 'নোয়াখালী',          division: 'চট্টগ্রাম', district: 'নোয়াখালী',     charge: 110, minOrderFree: 1500 },
    { label: 'ফেনী',              division: 'চট্টগ্রাম', district: 'ফেনী',          charge: 110, minOrderFree: 1500 },
    { label: 'সিলেট',             division: 'সিলেট',     district: 'সিলেট',        charge: 120, minOrderFree: 1500 },
    { label: 'হবিগঞ্জ',           division: 'সিলেট',     district: 'হবিগঞ্জ',      charge: 120, minOrderFree: 1500 },
    { label: 'মৌলভীবাজার',        division: 'সিলেট',     district: 'মৌলভীবাজার',   charge: 120, minOrderFree: 1500 },
    { label: 'সুনামগঞ্জ',          division: 'সিলেট',     district: 'সুনামগঞ্জ',    charge: 130, minOrderFree: 1500 },
    { label: 'রাজশাহী',           division: 'রাজশাহী',   district: 'রাজশাহী',      charge: 120, minOrderFree: 1500 },
    { label: 'বগুড়া',            division: 'রাজশাহী',   district: 'বগুড়া',        charge: 110, minOrderFree: 1500 },
    { label: 'পাবনা',             division: 'রাজশাহী',   district: 'পাবনা',         charge: 110, minOrderFree: 1500 },
    { label: 'নাটোর',             division: 'রাজশাহী',   district: 'নাটোর',         charge: 120, minOrderFree: 1500 },
    { label: 'খুলনা',             division: 'খুলনা',     district: 'খুলনা',         charge: 120, minOrderFree: 1500 },
    { label: 'যশোর',              division: 'খুলনা',     district: 'যশোর',          charge: 110, minOrderFree: 1500 },
    { label: 'সাতক্ষীরা',          division: 'খুলনা',     district: 'সাতক্ষীরা',    charge: 130, minOrderFree: 1500 },
    { label: 'বরিশাল',            division: 'বরিশাল',    district: 'বরিশাল',        charge: 130, minOrderFree: 1500 },
    { label: 'পটুয়াখালী',          division: 'বরিশাল',    district: 'পটুয়াখালী',    charge: 140, minOrderFree: 2000 },
    { label: 'রংপুর',             division: 'রংপুর',     district: 'রংপুর',         charge: 130, minOrderFree: 1500 },
    { label: 'দিনাজপুর',          division: 'রংপুর',     district: 'দিনাজপুর',      charge: 130, minOrderFree: 1500 },
    { label: 'গাইবান্ধা',          division: 'রংপুর',     district: 'গাইবান্ধা',     charge: 130, minOrderFree: 1500 },
    { label: 'ময়মনসিংহ',         division: 'ময়মনসিংহ', district: 'ময়মনসিংহ',     charge: 100, minOrderFree: 1500 },
    { label: 'নেত্রকোনা',          division: 'ময়মনসিংহ', district: 'নেত্রকোনা',     charge: 110, minOrderFree: 1500 },
    { label: 'জামালপুর',           division: 'ময়মনসিংহ', district: 'জামালপুর',      charge: 110, minOrderFree: 1500 },
    { label: 'সারাদেশ (ডিফল্ট)',  division: null,        district: null,            charge: 60,  minOrderFree: 1000 },
  ];

  for (const dc of charges) {
    const existing = await prisma.deliveryCharge.findFirst({
      where: { label: dc.label },
    });
    if (!existing) {
      await prisma.deliveryCharge.create({ data: { ...dc, isActive: true } });
    }
  }

  console.log(`✅ ${charges.length} delivery charges seeded`);
  await prisma.$disconnect();
}

seedDeliveryCharges().catch(console.error);

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test users...');

  // Test customer
  const hash = await bcrypt.hash('Customer@123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'rahim@test.com' },
    update: { password: hash, isActive: true },
    create: {
      name: 'রহিম উদ্দিন',
      email: 'rahim@test.com',
      phone: '01700000001',
      password: hash,
      role: 'CUSTOMER',
      isActive: true,
    },
  });
  console.log('✅ Customer:', user.email, '/ Customer@123');

  // Test customer 2
  const hash2 = await bcrypt.hash('Test@12345', 12);
  const user2 = await prisma.user.upsert({
    where: { email: 'test@deshimoslar.com' },
    update: { password: hash2, isActive: true },
    create: {
      name: 'Test User',
      email: 'test@deshimoslar.com',
      phone: '01700000002',
      password: hash2,
      role: 'CUSTOMER',
      isActive: true,
    },
  });
  console.log('✅ Customer2:', user2.email, '/ Test@12345');

  await prisma.$disconnect();
  console.log('Done!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
